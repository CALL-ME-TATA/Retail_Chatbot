from fastapi.testclient import TestClient

from src.app.api import app


def test_chat_endpoint():
    r = TestClient(app).post("/chat", json={"session_id": "t", "message": "I want a full refund and compensation"})
    assert r.status_code == 200 and r.json()["escalation"]["escalate"]
