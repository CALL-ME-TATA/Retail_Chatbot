import re

# order matters: card numbers before phone numbers
_PII = [
    (re.compile(r"[\w.+-]+@[\w-]+\.[\w.]+"), "[EMAIL]"),
    (re.compile(r"\b(?:\d[ -]?){13,16}\b"), "[CARD]"),
    (re.compile(r"\+?\d[\d\s().-]{8,}\d"), "[PHONE]"),
]


def mask_pii(text: str) -> str:
    # ponytail: regex only, misses names/addresses; add an NER pass if time allows
    for pat, tag in _PII:
        text = pat.sub(tag, text)
    return text
