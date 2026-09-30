from src.chatbot.escalation import Tracker
from src.chatbot.responder import HANDOFF, respond
from src.chatbot.retail_context import retrieve
from src.data.preprocess import mask_pii
from src.sentiment.predict import predict


class Session:
    def __init__(self):
        self.tracker = Tracker()
        self.history = []   # {"role","content"} pairs, PII-masked
        self.trajectory = []

    def chat(self, message: str) -> dict:
        text = mask_pii(message)
        pred = predict(text)
        esc = self.tracker.update(pred, text)
        reply, safe = respond(self.history, text, pred["label"], retrieve(text), esc["escalate"])
        if not safe and not esc["escalate"]:  # guardrail rejection -> hand off
            esc = {"escalate": True, "reason": "Reply failed policy guardrail", "urgency": "medium"}
            reply += HANDOFF
        self.history += [{"role": "user", "content": text}, {"role": "assistant", "content": reply}]
        self.trajectory.append(round(self.tracker.C, 3))
        return {"reply": reply, "sentiment": pred, "escalation": esc,
                "trajectory": self.trajectory, "handoff_summary": self._summary(esc)}

    def _summary(self, esc):
        if not esc["escalate"]:
            return None
        turns = [f"- [{l}] {t}" for l, _, t in self.tracker.turns[-5:]]
        return f"Escalation ({esc['urgency']}): {esc['reason']}\nRecent customer messages:\n" + "\n".join(turns)
