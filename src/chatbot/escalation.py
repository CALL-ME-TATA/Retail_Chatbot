import re

VAL = {"negative": -1, "neutral": 0, "positive": 1}
LAMBDA = 0.6          # decay for conversation score
NEG_CONF = 0.7        # R1 confidence threshold
SCORE_T = -0.5        # R2 conversation score threshold
DRIFT_T = -0.6        # R2 drift threshold
REPEAT_SIM = 0.4      # R4 word-overlap threshold
_TRIGGER = re.compile(
    r"\b(lawyer|attorney|legal action|sue|court|fraud|scam|chargeback|"
    r"speak to (?:a |an )?(?:human|person|agent|manager|representative)|real person)\b", re.I)
_DEMAND = re.compile(
    r"\b(want|need|demand|expect|give me|owe|entitled|require)\b.{0,40}\b(refund|money back|compensat\w*|reimburs\w*)", re.I)


def _words(t):
    return set(re.findall(r"[a-z]+", t.lower()))


class Tracker:
    def __init__(self):
        self.turns = []   # (label, conf, text)
        self.scores = []  # signed confidence per turn
        self.C = 0.0

    def update(self, pred: dict, text: str) -> dict:
        label, conf = pred["label"], pred["score"]
        s = VAL[label] * conf
        self.scores.append(s)
        self.C = LAMBDA * self.C + (1 - LAMBDA) * s
        prev_neg = [w for l, _, t in self.turns if l == "negative" for w in [_words(t)]]
        self.turns.append((label, conf, text))

        reason, urgency = None, "medium"
        if _TRIGGER.search(text):
            reason, urgency = "Customer mentioned legal/fraud issue or asked for a human (R3)", "high"
        elif _DEMAND.search(text):
            reason = "Customer is demanding a refund/compensation, which needs human approval (R5)"
        elif len(self.turns) >= 2 and all(l == "negative" and c >= NEG_CONF for l, c, _ in self.turns[-2:]):
            reason = "Two consecutive confident negative turns (R1)"
        elif label == "negative" and (self.C <= SCORE_T or self._drift() <= DRIFT_T):
            reason = "Conversation sentiment is low or dropping fast (R2)"
        elif label == "negative" and sum(len(_words(text) & w) / max(len(_words(text) | w), 1) >= REPEAT_SIM for w in prev_neg) >= 2:
            reason = "Same complaint repeated three times (R4)"
        return {"escalate": reason is not None, "reason": reason, "urgency": urgency if reason else "none"}

    def _drift(self):
        s = self.scores[-3:]
        return (s[-1] - s[0]) / 2 if len(s) == 3 else 0.0  # needs 3 turns of history
