import os
import re

from dotenv import load_dotenv

load_dotenv()
MODEL = os.getenv("ANTHROPIC_MODEL", "claude-haiku-4-5-20251001")

STRATEGY = {
    "negative": "The customer is upset. Apologize sincerely, reflect their feeling in your own words, then give one concrete next step.",
    "neutral": "Answer clearly and briefly.",
    "positive": "Thank the customer warmly and affirm their good experience.",
}
SYSTEM = (
    "You are a retail customer support assistant. Always acknowledge the customer's feeling first, then act. "
    "Use ONLY the facts in the KNOWLEDGE section. Never promise refunds, credits, discounts, compensation or delivery dates "
    "that are not stated there; if unsure, offer to connect a human agent. Keep replies under 80 words. Strategy: {strategy}"
)
FALLBACK = {
    "negative": "I'm really sorry about this experience, and I understand how frustrating it is. Let me get this sorted for you.",
    "neutral": "Thanks for reaching out. Let me help you with that.",
    "positive": "Thank you so much, we're delighted to hear that!",
}
HANDOFF = " I'm connecting you with a human agent who can take this further."

_CLAIM = re.compile(r"\$\s?\d[\d,.]*|\b\d+\s*(?:business\s+)?(?:days?|hours?)\b|\b\d+\s*%")
_PROMISE = re.compile(
    r"\bi(?:'ve| have)?\s+(?:issued|processed|approved|refunded)\b|\bguarantee\b|"
    r"\brefund (?:is|has been) (?:approved|issued|processed)\b", re.I)


def _norm(s):
    return re.sub(r"\s+", "", s.lower())


def is_safe(reply: str, allowed_text: str) -> bool:
    """Reject replies that promise things or cite numbers/prices/durations not in the KB or user message."""
    if _PROMISE.search(reply):
        return False
    allowed = _norm(allowed_text)
    return all(_norm(m.group(0)) in allowed for m in _CLAIM.finditer(reply))


def respond(history: list[dict], user_msg: str, sentiment: str, snippets: list[str], escalate: bool) -> tuple[str, bool]:
    """-> (reply, safe). safe=False means the LLM output was rejected and a template was used."""
    reply, safe = None, True
    if os.getenv("ANTHROPIC_API_KEY"):
        try:
            import anthropic
            r = anthropic.Anthropic().messages.create(
                model=MODEL, max_tokens=250,
                system=SYSTEM.format(strategy=STRATEGY[sentiment]) + "\n\nKNOWLEDGE:\n" + "\n".join(snippets),
                messages=history + [{"role": "user", "content": user_msg}])
            reply = r.content[0].text.strip()
            if not is_safe(reply, "\n".join(snippets) + " " + user_msg):
                reply, safe = None, False
        except Exception:
            reply = None  # API down -> template, not a guardrail failure
    reply = reply or FALLBACK[sentiment]
    return reply + (HANDOFF if escalate else ""), safe
