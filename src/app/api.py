"""REST backend.  uvicorn src.app.api:app --reload"""
from fastapi import FastAPI
from pydantic import BaseModel

from src.chatbot.pipeline import Session

app = FastAPI(title="EmpathIQ API")
_sessions: dict[str, Session] = {}  # ponytail: in-memory; use Redis if multiple workers are needed


class ChatIn(BaseModel):
    session_id: str
    message: str


@app.post("/chat")
def chat(body: ChatIn):
    s = _sessions.setdefault(body.session_id, Session())
    r = s.chat(body.message)
    return {k: r[k] for k in ("reply", "sentiment", "escalation", "trajectory", "path", "handoff_summary")}
