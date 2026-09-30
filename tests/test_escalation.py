from src.chatbot.escalation import Tracker


def P(label, score=0.9):
    return {"label": label, "score": score}


def test_positive_no_escalation():
    assert not Tracker().update(P("positive"), "love it")["escalate"]


def test_two_negatives_escalate():
    t = Tracker()
    assert not t.update(P("negative"), "my order is late")["escalate"]
    assert t.update(P("negative"), "still nothing, awful")["escalate"]


def test_legal_threat_immediate_high():
    d = Tracker().update(P("neutral"), "I will call my lawyer")
    assert d["escalate"] and d["urgency"] == "high"


def test_single_neutral_no_escalation():
    assert not Tracker().update(P("neutral"), "what is the return window")["escalate"]


def test_one_negative_after_neutral_no_escalation():
    t = Tracker()
    t.update(P("neutral"), "what is the return window")
    assert not t.update(P("negative"), "my order is a bit late")["escalate"]
