import os
import re

from dotenv import load_dotenv

load_dotenv()
# free-tier limits are per model, so fall through the list on rate-limit errors
GEMINI_MODELS = os.getenv("GEMINI_MODELS", "gemini-3.1-flash-lite,gemini-3.5-flash-lite,gemini-flash-lite-latest,gemini-3.8-flash").split(",")
ANTHROPIC_MODEL = os.getenv("ANTHROPIC_MODEL", "claude-haiku-4-5-20251001")

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
HANDOFF_NOTE = " A human agent is taking over this chat right now: tell the customer that, and do not ask whether they want one."
STRICT = " Your previous draft made an unsupported claim. Do not state any price, number of days or commitment that is not in KNOWLEDGE."
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


def draft(history: list[dict], user_msg: str, sentiment: str, snippets: list[str], strict: bool = False, escalate: bool = False) -> str | None:
    """LLM draft via Gemini (LangChain) or Claude; None if no provider is configured or the call fails."""
    system = SYSTEM.format(strategy=STRATEGY[sentiment]) + (STRICT if strict else "") + (HANDOFF_NOTE if escalate else "") + "\n\nKNOWLEDGE:\n" + "\n".join(snippets)
    if os.getenv("GEMINI_API_KEY"):
        from langchain_google_genai import ChatGoogleGenerativeAI
        msgs = [("system", system)] + [("human" if m["role"] == "user" else "ai", m["content"]) for m in history]
        for model in GEMINI_MODELS:
            try:
                llm = ChatGoogleGenerativeAI(model=model, google_api_key=os.environ["GEMINI_API_KEY"],
                                             temperature=0.4, max_output_tokens=2000, timeout=20, max_retries=0)
                out = llm.invoke(msgs + [("human", user_msg)]).text.strip()
                if out:
                    return out
            except Exception as e:
                print(f"[responder] {model} failed: {type(e).__name__}")
    try:
        if os.getenv("ANTHROPIC_API_KEY"):
            import anthropic
            r = anthropic.Anthropic().messages.create(
                model=ANTHROPIC_MODEL, max_tokens=250, system=system,
                messages=history + [{"role": "user", "content": user_msg}])
            return r.content[0].text.strip()
    except Exception as e:  # API down, quota, no credits -> caller falls back to a template
        print(f"[responder] LLM call failed: {type(e).__name__}")
    return None
