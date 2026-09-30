"""REST backend.  uvicorn src.app.api:app --port 8000"""
import re

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from src.chatbot.pipeline import Session

app = FastAPI(title="EmpathIQ API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])  # dev only
_sessions: dict[str, Session] = {}  # ponytail: in-memory; use Redis if multiple workers are needed

# keyword lexicon for aspect tagging; ponytail: no LLM fallback, add if the lexicon misses too often
ASPECTS = {
    "Delivery": r"deliver|ship|package|parcel|tracking|late|arriv|courier|transit|delay",
    "Price": r"price|refund|charge|cost|money|discount|paid|billing|invoice",
    "Product": r"quality|broke|damag|defect|stopped working|size|battery|sneaker|earbud|monitor|coffee|backpack|camera|blanket|moisturi",
    "Service": r"support|agent|service|rude|ignor|staff|representative",
}


def tag_aspect(text: str) -> str:
    hits = {a: len(re.findall(pat, text.lower())) for a, pat in ASPECTS.items()}
    best = max(hits, key=hits.get)
    return best if hits[best] else "Service"


class ChatIn(BaseModel):
    session_id: str
    message: str


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/chat")
def chat(body: ChatIn):
    s = _sessions.setdefault(body.session_id, Session())
    r = s.chat(body.message)
    out = {k: r[k] for k in ("reply", "sentiment", "escalation", "trajectory", "path", "handoff_summary")}
    out["aspect"] = tag_aspect(body.message)
    return out
