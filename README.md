# EmpathIQ: Retail Customer Sentiment Chatbot

> Most sentiment tools only *label* text. EmpathIQ closes the loop: it **detects** how a customer feels, **decides** whether the bot should keep going or hand off to a human, and **replies** with empathy, without inventing policy.

## The idea in one minute
| Step | What it does | How |
|---|---|---|
| **Detect** | Per-turn sentiment plus conversation trajectory | DistilBERT fine-tuned on real Amazon product reviews; decayed score and drift across turns |
| **Decide** | Keep helping, or escalate, with a reason | Explicit rules (R1 to R5) on top of the model score: repeated negativity, dropping trend, legal/fraud words, refund demands |
| **Reply** | Empathetic answer grounded in store data | Gemini via LangChain, using retrieved products, orders and policies (RAG); strategy chosen by rule |
| **Protect** | Never promise what policy does not allow | Guardrail rejects unsupported prices, durations and commitments; retry once, then template plus human handoff |

**Why it matters:** customers rate chatbots lower than humans, and perceived empathy explains the gap. But an empathetic bot that promises an unauthorized refund is worse than a cold one. EmpathIQ is evaluated on all three stages together (detection, escalation, safety), which existing work studies separately. See [docs/PRD.tex](docs/PRD.tex) for the literature review and research gaps.

## Architecture (LangGraph)
```
mask_pii -> sentiment -> track -> retrieve -> generate -> guardrail -+-> finalize -> END
                                                  ^---- retry -------+   (once, stricter prompt)
```
Each box is a node in a LangGraph `StateGraph` ([src/chatbot/pipeline.py](src/chatbot/pipeline.py)). The guardrail retry is a conditional edge. The UI shows the path taken for every message.

## Repo layout
- `src/sentiment/`: `train.py` (fine-tune), `predict.py`, `evaluate.py`
- `src/chatbot/`: `pipeline.py` (LangGraph), `escalation.py`, `responder.py`, `retail_context.py`
- `src/data/`: PII masking
- `src/app/main.py`: Streamlit chat UI
- `data/`: `retail_kb.json` (products, orders, policies), `processed/test_labeled.csv` (chat test set)
- `docs/`: PRD (LaTeX), model and integration notes; `tests/`: unit tests

## Run
```bash
pip install -r requirements.txt
# .env (gitignored):  GEMINI_API_KEY=...   (optional: ANTHROPIC_API_KEY=...)
python -m src.sentiment.train            # optional: fine-tune on Amazon reviews (~20 min CPU)
SENTIMENT_MODEL=models/retail-sentiment python -m src.sentiment.evaluate
streamlit run src/app/main.py
python -m pytest tests -q
```
Without an API key the bot still works using template replies.

## Demo scenarios
1. Neutral question: "What is your return window?" -> factual answer from the policy KB.
2. Late order (ORD-1002) -> apology plus order status; sentiment drops.
3. Repeated anger -> banner: escalated with a handoff summary.
4. "I want a full refund and compensation" -> empathy, no promise, human takes over.

## Privacy and limits
Emails, phone and card numbers are masked before anything is stored or sent to an LLM (regex only; not a full guarantee). English only. The test set is small and its labels were drafted by an AI assistant, so treat reported numbers as indicative. Orders are mock data.
