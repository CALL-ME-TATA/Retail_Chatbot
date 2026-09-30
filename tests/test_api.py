from fastapi.testclient import TestClient

from src.app import api

c = TestClient(api.app)


def test_chat_flows_through_pipeline_and_updates_state():
    conv = c.post("/conversations").json()
    r = c.post("/chat", json={"session_id": conv["id"], "message": "My order ORD-1002 is late and I want a full refund"}).json()
    assert r["escalation"]["escalate"] and r["path"][-1] == "finalize"
    v = r["conversation"]
    assert v["orderStatus"] == "In transit" and v["escalate"] and len(v["messages"]) == 2 and len(v["trajectory"]) == 1
    assert r["stats"]["escalationsToday"] >= 1
    assert c.get("/insights").json()["turns"] >= 1


def test_static_endpoints_come_from_data_files():
    assert len(c.get("/scenarios").json()) >= 5
    assert any("30 days" in p["text"] for p in c.get("/knowledge").json()["policies"])
