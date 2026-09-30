import json
import os
import sys
from pathlib import Path

import pandas as pd
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, f1_score, recall_score

from src.sentiment.predict import predict

LABELS = ["negative", "neutral", "positive"]


def main(path="data/processed/test_labeled.csv"):
    df = pd.read_csv(path)
    pred = [predict(t)["label"] for t in df.text]
    res = {"n": len(df), "accuracy": accuracy_score(df.label, pred), "macro_f1": f1_score(df.label, pred, average="macro"),
           "negative_recall": float(recall_score(df.label, pred, labels=["negative"], average=None)[0]),
           "model": os.getenv("SENTIMENT_MODEL", "cardiffnlp/twitter-roberta-base-sentiment-latest")}
    Path("data/processed/eval_results.json").write_text(json.dumps(res, indent=2))  # served by the API /insights
    print(f"n={res['n']}  accuracy={res['accuracy']:.3f}  macro-F1={res['macro_f1']:.3f}  negative-recall={res['negative_recall']:.3f}")
    print(classification_report(df.label, pred, labels=LABELS, zero_division=0))
    print(confusion_matrix(df.label, pred, labels=LABELS))


if __name__ == "__main__":
    main(*sys.argv[1:])
