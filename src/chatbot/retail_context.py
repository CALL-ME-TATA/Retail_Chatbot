import json
import re
from pathlib import Path

from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS, TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

_KB = json.loads((Path(__file__).parents[2] / "data" / "retail_kb.json").read_text(encoding="utf-8"))
_DOCS = [d["text"] for d in _KB["products"] + _KB["policies"]]


def _tok(text: str) -> list[str]:
    # crude stemmer so "returns/returned/returning" all match "return"
    out = []
    for w in re.findall(r"[a-z0-9-]+", text.lower()):
        if w in ENGLISH_STOP_WORDS:
            continue
        if len(w) > 4:
            w = re.sub(r"(ing|ed|es|s)$", "", w)
            w = re.sub(r"(.)\1$", r"\1", w)  # shipp -> ship
        out.append(w)
    return out


_VEC = TfidfVectorizer(analyzer=_tok).fit(_DOCS)
_MAT = _VEC.transform(_DOCS)
_ORDER = re.compile(r"ORD-\d+", re.I)


def retrieve(query: str, k: int = 3) -> list[str]:
    """Order details for any order id in the query, plus top-k KB snippets."""
    out = []
    for oid in _ORDER.findall(query):
        o = _KB["orders"].get(oid.upper())
        if o:
            out.append(f"Order {oid.upper()}: {o['item']}, status {o['status']}. {o['note']}")
    sims = cosine_similarity(_VEC.transform([query]), _MAT)[0]
    out += [_DOCS[i] for i in sims.argsort()[::-1][:k] if sims[i] > 0]
    return out
