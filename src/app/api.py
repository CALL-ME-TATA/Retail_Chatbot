"""REST backend.  uvicorn src.app.api:app --port 8000

Everything the frontend shows is computed here from real pipeline runs (no canned data).
"""
import json
import os
import re
import threading
import time
from contextlib import asynccontextmanager
from datetime import datetime
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from src.chatbot.pipeline import Session
from src.chatbot.responder import STRATEGY

ROOT = Path(__file__).parents[2]
KB = json.loads((ROOT / "data" / "retail_kb.json").read_text(encoding="utf-8"))
CUSTOMERS = {c["id"]: c for c in KB.get("customers", [])}
SCENARIOS = json.loads((ROOT / "data" / "demo_scenarios.json").read_text(encoding="utf-8"))
DEMO_CONVS = json.loads((ROOT / "data" / "demo_conversations.json").read_text(encoding="utf-8"))
EVAL_PATH = ROOT / "data" / "processed" / "eval_results.json"


def _seed(convs):
    """Run each demo customer's opening messages through the real pipeline (background, so the API starts at once)."""
    for c, messages in convs:
        for m in messages:
            try:
                _process(c, m)
            except Exception as e:
                print(f"[seed] {c['customer']}: {type(e).__name__}: {e}")


@asynccontextmanager
async def lifespan(_app):
    if os.getenv("SEED_DEMO", "1") == "1":  # SEED_DEMO=0 starts with an empty inbox
        convs = [(_new_conv(customer=CUSTOMERS[d["customer"]]), d["messages"]) for d in DEMO_CONVS]
        threading.Thread(target=_seed, args=(convs,), daemon=True).start()
    yield


app = FastAPI(title="EmpathIQ API", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])  # dev only

# ponytail: in-memory state; use Redis/Postgres if multiple workers or persistence are needed
_convs: dict[str, dict] = {}
_turns: list[dict] = []

# keyword lexicon for aspect tagging; ponytail: no LLM fallback, add if the lexicon misses too often
ASPECTS = {
    "Delivery": r"deliver|ship|package|parcel|tracking|late|arriv|courier|transit|delay",
    "Price": r"price|refund|charge|cost|money|discount|paid|billing|invoice",
    "Product": r"quality|broke|damag|defect|stopped working|size|battery|sneaker|earbud|monitor|coffee|backpack|camera|blanket|moisturi",
    "Service": r"support|agent|service|rude|ignor|staff|representative",
}
SCOPE_INTENT = {"off_topic": "Off-topic (declined)", "injection": "Instruction-override attempt (declined)",
                "greeting": "Greeting / small talk", "empty": "Empty message"}
EMOTION = {"negative": "Frustrated", "neutral": "Inquiring", "positive": "Delighted"}
_ORDER = re.compile(r"ORD-\d+", re.I)


def tag_aspect(text: str) -> str:
    hits = {a: len(re.findall(pat, text.lower())) for a, pat in ASPECTS.items()}
    best = max(hits, key=hits.get)
    return best if hits[best] else "Service"


def _now():
    return datetime.now().strftime("%I:%M %p")


def _new_conv(cid: str | None = None, customer: dict | None = None) -> dict:
    """New conversation for the given customer, else the next customer without one, else a walk-in."""
    n = len(_convs) + 1
    if customer is None:
        used = {c["customer_id"] for c in _convs.values()}
        customer = next((k for k in CUSTOMERS.values() if k["id"] not in used), None)
    name = customer["name"] if customer else f"Walk-in customer {n}"
    order = customer and KB["orders"].get(customer["order"])
    c = {"id": cid or f"conv-{n}", "customer_id": customer["id"] if customer else None, "customer": name,
         "initials": "".join(w[0] for w in name.split()[:2]).upper(),
         "since": f"Customer since {customer['since']}" if customer else "New session",
         "session": Session(), "messages": [], "turns": [], "last": None,
         "order": {"id": customer["order"], **order} if order else None}
    _convs[c["id"]] = c
    return c


def _view(c: dict) -> dict:
    """Conversation in the shape the UI renders, built only from real pipeline output."""
    last, order = c["last"], c["order"]
    v = {"id": c["id"], "customer": c["customer"], "initials": c["initials"], "avatar": None,
         "messages": c["messages"], "lastMessage": c["messages"][-1]["content"] if c["messages"] else "No messages yet",
         "timestamp": c["messages"][-1]["time"] if c["messages"] else "New", "customerSince": c["since"],
         "orderId": order["id"] if order else "No order",
         "product": order["item"] if order else "No order referenced",
         "orderStatus": order["status"] if order else "No order referenced",
         "expectedDelivery": order["note"] if order else "N/A",
         "trajectory": c["turns"], "sentiment": "neutral", "confidence": 0, "emotion": "Awaiting message",
         "intent": "No messages yet", "aspect": "N/A", "aspectBreakdown": [], "priority": "low", "escalate": False,
         "escalationDetails": None, "strategy": None}
    if not last:
        return v
    label, esc = last["sentiment"]["label"], last["escalation"]
    kind = "complaint" if label == "negative" else "feedback" if label == "positive" else "inquiry"
    v.update(sentiment=label, confidence=last["sentiment"]["score"], emotion=EMOTION[label], aspect=last["aspect"],
             aspectBreakdown=[{"aspect": t["aspect"], "sentiment": t["sentiment"].lower(), "note": t["text"]} for t in c["turns"][-3:]],
             intent=("Escalation required" if esc["escalate"] else SCOPE_INTENT.get(last["scope"])
                     or f"{last['aspect']} {kind}"),
             priority=esc["urgency"] if esc["escalate"] else "low", escalate=esc["escalate"],
             strategy={"type": "ACKNOWLEDGE → ACT" if label == "negative" else "INFORM" if label == "neutral" else "AFFIRM",
                       "action": STRATEGY[label], "guidance": STRATEGY[label]})
    if esc["escalate"]:
        v["escalationDetails"] = {
            "priority": esc["urgency"].capitalize(), "reason": esc["reason"], "trigger": esc["reason"],
            "recommendedAction": "Human agent review", "summaryText": last["handoff_summary"],
            "handoffSummary": {"customer": c["customer"],
                               "issue": f"{last['aspect']} issue" + (f" ({order['item']})" if order else ""),
                               "sentiment": f"{label.capitalize()} ({last['sentiment']['score']:.0%})",
                               "trend": " → ".join(t["sentiment"] for t in c["turns"][-4:]), "reason": esc["reason"],
                               "recommendedAction": "Human agent review",
                               "carrierStatus": order["status"] if order else "N/A", "estimatedValue": "N/A"}}
    return v


def _stats() -> dict:
    cs = list(_convs.values())
    return {"activeConversations": len(cs),
            "negativeConversations": sum(1 for c in cs if c["last"] and c["last"]["sentiment"]["label"] == "negative"),
            "escalationsToday": sum(1 for c in cs if c["last"] and c["last"]["escalation"]["escalate"])}


class ChatIn(BaseModel):
    session_id: str
    message: str


@app.get("/health")
def health():
    return {"ok": True}


@app.get("/conversations")
def conversations():
    return [_view(c) for c in _convs.values()]


@app.post("/conversations")
def create_conversation():
    return _view(_new_conv())


@app.get("/stats")
def stats():
    return _stats()


@app.get("/scenarios")
def scenarios():
    return SCENARIOS


@app.get("/knowledge")
def knowledge():
    return {"policies": KB["policies"], "products": KB["products"], "orders": len(KB["orders"])}


@app.get("/insights")
def insights():
    n = len(_turns)
    aspects = {}
    for t in _turns:
        a = aspects.setdefault(t["aspect"], {"aspect": t["aspect"], "positive": 0, "neutral": 0, "negative": 0, "total": 0})
        a[t["label"]] += 1
        a["total"] += 1
    scores = [c["session"].tracker.C for c in _convs.values() if c["turns"]]
    return {"turns": n, "conversations": len(_convs), "aspects": list(aspects.values()),
            "escalation_rate": sum(t["escalated"] for t in _turns) / n if n else None,
            "guardrail_first_pass": sum(t["first_pass"] for t in _turns) / n if n else None,
            "avg_latency_s": sum(t["latency"] for t in _turns) / n if n else None,
            "avg_score": sum(scores) / len(scores) if scores else None,
            "model_eval": json.loads(EVAL_PATH.read_text()) if EVAL_PATH.exists() else None}


def _process(c: dict, message: str) -> dict:
    """Run one customer message through the LangGraph pipeline and record the result on the conversation."""
    t0 = time.time()
    r = c["session"].chat(message)
    latency = time.time() - t0
    r["aspect"] = tag_aspect(message) if r["scope"] == "retail" else "Other"
    for oid in _ORDER.findall(message):
        if o := KB["orders"].get(oid.upper()):
            c["order"] = {"id": oid.upper(), **o}
    lab = r["sentiment"]["label"]
    k = len(c["messages"])
    c["messages"] += [{"id": f"u-{k}", "sender": "customer", "senderName": c["customer"], "time": _now(), "content": message},
                      {"id": f"a-{k}", "sender": "ai", "senderName": "EmpathIQ AI", "time": _now(), "content": r["reply"]}]
    n = len(c["turns"]) + 1
    c["turns"].append({"turn": f"Turn {n}", "label": f"T{n}", "score": r["trajectory"][-1], "sentiment": lab.capitalize(),
                       "aspect": r["aspect"], "text": message[:30] + ("..." if len(message) > 30 else "")})
    c["last"] = r
    _turns.append({"aspect": r["aspect"], "label": lab, "escalated": r["escalation"]["escalate"],
                   "first_pass": r["attempts"] == 1 and r["guardrail_passed"], "latency": latency})
    return r


@app.post("/chat")
def chat(body: ChatIn):
    c = _convs.get(body.session_id) or _new_conv(body.session_id)
    r = _process(c, body.message)
    out = {k: r[k] for k in ("reply", "sentiment", "escalation", "scope", "trajectory", "path", "handoff_summary", "aspect")}
    return {**out, "conversation": _view(c), "stats": _stats()}
