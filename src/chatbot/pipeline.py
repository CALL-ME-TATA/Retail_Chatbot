"""LangGraph state machine for one chat turn.

mask_pii -> sentiment -> track -> retrieve -> generate -> guard -+-> finalize -> END
                                                 ^--- retry ----+  (once, with a stricter prompt)
"""
from typing import Any, TypedDict

from langgraph.graph import END, START, StateGraph

from src.chatbot.escalation import Tracker
from src.chatbot.responder import FALLBACK, HANDOFF, draft, is_safe
from src.chatbot.retail_context import retrieve
from src.data.preprocess import mask_pii
from src.sentiment.predict import predict

MAX_ATTEMPTS = 2


class State(TypedDict, total=False):
    message: str
    text: str
    history: list
    tracker: Any
    pred: dict
    esc: dict
    snippets: list
    reply: str | None
    safe: bool
    attempts: int
    final: str
    path: list  # nodes visited, shown in the UI


def _visit(s, name):
    return s.get("path", []) + [name]


def n_mask(s):
    return {"text": mask_pii(s["message"]), "path": _visit(s, "mask_pii")}


def n_sentiment(s):
    return {"pred": predict(s["text"]), "path": _visit(s, "sentiment")}


def n_track(s):
    return {"esc": s["tracker"].update(s["pred"], s["text"]), "path": _visit(s, "track")}


def n_retrieve(s):
    return {"snippets": retrieve(s["text"]), "attempts": 0, "path": _visit(s, "retrieve")}


def n_generate(s):
    strict = s["attempts"] > 0
    r = draft(s["history"], s["text"], s["pred"]["label"], s["snippets"], strict=strict, escalate=s["esc"]["escalate"])
    return {"reply": r, "attempts": s["attempts"] + 1, "path": _visit(s, "generate")}


def n_guard(s):
    ok = s["reply"] is None or is_safe(s["reply"], "\n".join(s["snippets"]) + " " + s["text"])
    return {"safe": ok, "path": _visit(s, "guardrail")}


def after_guard(s):
    return "finalize" if s["safe"] or s["attempts"] >= MAX_ATTEMPTS else "generate"


def n_finalize(s):
    esc, reply = dict(s["esc"]), s["reply"]
    if not s["safe"]:  # still unsafe after retry -> template + human handoff
        reply = None
        if not esc["escalate"]:
            esc = {"escalate": True, "reason": "Reply failed policy guardrail", "urgency": "medium"}
    if reply is None:  # template replies need the handoff sentence added; LLM replies already state it
        reply = FALLBACK[s["pred"]["label"]] + (HANDOFF if esc["escalate"] else "")
    return {"esc": esc, "final": reply, "path": _visit(s, "finalize")}


def _build():
    g = StateGraph(State)
    for name, fn in [("mask_pii", n_mask), ("sentiment", n_sentiment), ("track", n_track), ("retrieve", n_retrieve),
                     ("generate", n_generate), ("guardrail", n_guard), ("finalize", n_finalize)]:
        g.add_node(name, fn)
    g.add_edge(START, "mask_pii")
    for a, b in [("mask_pii", "sentiment"), ("sentiment", "track"), ("track", "retrieve"),
                 ("retrieve", "generate"), ("generate", "guardrail")]:
        g.add_edge(a, b)
    g.add_conditional_edges("guardrail", after_guard, {"finalize": "finalize", "generate": "generate"})
    g.add_edge("finalize", END)
    return g.compile()


GRAPH = _build()


class Session:
    def __init__(self):
        self.tracker = Tracker()
        self.history = []   # {"role","content"} pairs, PII-masked
        self.trajectory = []

    def chat(self, message: str) -> dict:
        s = GRAPH.invoke({"message": message, "history": self.history, "tracker": self.tracker, "path": []})
        self.history += [{"role": "user", "content": s["text"]}, {"role": "assistant", "content": s["final"]}]
        self.trajectory.append(round(self.tracker.C, 3))
        return {"reply": s["final"], "sentiment": s["pred"], "escalation": s["esc"],
                "trajectory": self.trajectory, "path": s["path"],
                "attempts": s["attempts"], "guardrail_passed": s["safe"], "handoff_summary": self._summary(s["esc"])}

    def _summary(self, esc):
        if not esc["escalate"]:
            return None
        turns = [f"- [{l}] {t}" for l, _, t in self.tracker.turns[-5:]]
        return f"Escalation ({esc['urgency']}): {esc['reason']}\nRecent customer messages:\n" + "\n".join(turns)
