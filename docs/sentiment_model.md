# Sentiment model

## Models compared
| Model | Training data | Accuracy | Macro-F1 | Negative recall |
|---|---|---|---|---|
| `cardiffnlp/twitter-roberta-base-sentiment-latest` (zero-shot) | general tweets (pretrained) | **97.2%** | **0.972** | **0.943** |
| DistilBERT fine-tuned by us (`models/retail-sentiment`) | 3,000 real Amazon product reviews (1-2 stars neg, 3 neutral, 4-5 pos), 2 epochs | 84.0% | 0.836 | 0.857 |

Test set: 106 short retail chat turns (`data/processed/test_labeled.csv`), disjoint from the training data.
Both models meet the 80% accuracy target.

## Reading the results honestly
- The fine-tuned model's weakness is **neutral chat questions read as positive** (10 of 35). A 3-star review is not the same thing as a neutral question, so review-trained labels transfer imperfectly to chat.
- The zero-shot model wins on this test set, which is small and whose labels were drafted by an AI assistant and not yet reviewed by the team. Treat the numbers as indicative.
- Training used `SetFit/amazon_reviews_multi_en`. Retraining on Amazon Reviews 2023 (the PRD's dataset) was not done for lack of time.

## Use
`SENTIMENT_MODEL=models/retail-sentiment python -m src.sentiment.evaluate` (default is the cardiffnlp model).
Weights are gitignored; rebuild with `python -m src.sentiment.train` (about 15-30 min on CPU).
