import sys

import pandas as pd
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, f1_score, recall_score

from src.sentiment.predict import predict

LABELS = ["negative", "neutral", "positive"]


def main(path="data/processed/test_labeled.csv"):
    df = pd.read_csv(path)
    pred = [predict(t)["label"] for t in df.text]
    print(f"n={len(df)}  accuracy={accuracy_score(df.label, pred):.3f}  "
          f"macro-F1={f1_score(df.label, pred, average='macro'):.3f}  "
          f"negative-recall={recall_score(df.label, pred, labels=['negative'], average=None)[0]:.3f}")
    print(classification_report(df.label, pred, labels=LABELS, zero_division=0))
    print(confusion_matrix(df.label, pred, labels=LABELS))


if __name__ == "__main__":
    main(*sys.argv[1:])
