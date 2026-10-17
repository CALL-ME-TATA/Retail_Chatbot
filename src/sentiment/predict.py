import os
from functools import lru_cache

MODEL = os.getenv("SENTIMENT_MODEL", "cardiffnlp/twitter-roberta-base-sentiment-latest")


@lru_cache(maxsize=1)
def _clf():
    from transformers import pipeline  # lazy: importing transformers/torch takes ~40s, keep it off API startup

    return pipeline("text-classification", model=MODEL, top_k=None)


def predict(text: str) -> dict:
    """-> {label: negative|neutral|positive, score: float, probs: {label: float}}"""
    probs = {d["label"].lower(): d["score"] for d in _clf()(text)[0]}
    label = max(probs, key=probs.get)
    return {"label": label, "score": probs[label], "probs": probs}
