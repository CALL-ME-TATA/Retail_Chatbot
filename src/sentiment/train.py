"""Fine-tune DistilBERT on real Amazon product reviews (1-2 stars=negative, 3=neutral, 4-5=positive).

    python -m src.sentiment.train            # ~3000 reviews per class, 2 epochs, CPU-friendly
Saves to models/retail-sentiment/. Evaluate on hand-labeled chat turns with src.sentiment.evaluate.
"""
import random
import sys

import torch
from datasets import load_dataset
from transformers import AutoModelForSequenceClassification, AutoTokenizer

BASE = "distilbert-base-uncased"
OUT = "models/retail-sentiment"
LABELS = ["negative", "neutral", "positive"]
PER_CLASS, EPOCHS, BATCH, MAXLEN, LR = int(sys.argv[1]) if len(sys.argv) > 1 else 1000, 2, 16, 64, 3e-5


def star_to_label(star: int) -> int:  # dataset labels are 0-4 = 1-5 stars
    return 0 if star <= 1 else 1 if star == 2 else 2


def load_balanced(n_per_class):
    ds = load_dataset("SetFit/amazon_reviews_multi_en", split="train").shuffle(seed=0)
    buckets, out = {0: [], 1: [], 2: []}, []
    for r in ds:
        b = buckets[star_to_label(r["label"])]
        if len(b) < n_per_class:
            b.append((r["text"], star_to_label(r["label"])))
        if all(len(v) >= n_per_class for v in buckets.values()):
            break
    for v in buckets.values():
        out += v
    random.Random(0).shuffle(out)
    return out


def main():
    data = load_balanced(PER_CLASS)
    tok = AutoTokenizer.from_pretrained(BASE)
    model = AutoModelForSequenceClassification.from_pretrained(
        BASE, num_labels=3, id2label=dict(enumerate(LABELS)), label2id={l: i for i, l in enumerate(LABELS)})
    opt = torch.optim.AdamW(model.parameters(), lr=LR)
    model.train()
    steps = EPOCHS * (len(data) // BATCH)
    step = 0
    for ep in range(EPOCHS):
        random.Random(ep).shuffle(data)
        for i in range(0, len(data) - BATCH + 1, BATCH):
            texts, ys = zip(*data[i:i + BATCH])
            enc = tok(list(texts), truncation=True, max_length=MAXLEN, padding=True, return_tensors="pt")
            loss = model(**enc, labels=torch.tensor(ys)).loss
            loss.backward()
            opt.step()
            opt.zero_grad()
            step += 1
            if step % 20 == 0:
                print(f"step {step}/{steps} loss {loss.item():.3f}", flush=True)
    model.save_pretrained(OUT)
    tok.save_pretrained(OUT)
    print("saved", OUT)


if __name__ == "__main__":
    main()
