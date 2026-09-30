# Tech stack: planned vs. what was built

Legend: ✅ used as planned · 🔄 used, but a different or simpler tool · ❌ not built (future work)

| Layer | Planned (Tech Stack PDF) | Status | What the project actually uses |
|---|---|---|---|
| Orchestration | LangGraph | ✅ | `src/chatbot/pipeline.py`: 7-node StateGraph with a guardrail retry edge |
| | LangChain (templates, wrappers, parsers) | 🔄 | Only the `langchain-google-genai` LLM wrapper; prompts are plain strings, no parsers |
| | LangSmith tracing | ❌ | The graph path is returned per message and shown in the UI instead |
| Sentiment model | HF Transformers + PyTorch | ✅ | Inference and a fine-tuning loop (`src/sentiment/train.py`) |
| | HF Datasets: Amazon Reviews 2023, Twitter Customer Support, GoEmotions | 🔄 | `SetFit/amazon_reviews_multi_en` (older Amazon reviews) only |
| | Base checkpoints: cardiffnlp, nlptown, j-hartmann emotion | 🔄 | cardiffnlp used zero-shot as the default; fine-tune started from `distilbert-base-uncased`; nlptown and j-hartmann not used |
| | Three-stage fine-tune | 🔄 | One stage, 3,000 reviews, 2 epochs |
| | ONNX Runtime; CalibratedClassifierCV / netcal | ❌ | No quantization or calibration |
| Aspect tagging | Keyword lexicon + spaCy + LLM fallback | 🔄 | Hand-written keyword lexicon (`src/app/api.py`); no spaCy, no LLM fallback |
| Trajectory / escalation | NumPy decay and slope | 🔄 | Same decayed average and drift in plain Python (`escalation.py`) |
| | Redis session state | 🔄 | In-memory dict per session |
| | scikit-learn logistic-regression risk score | 🔄 | Explicit rules R1–R5 (consecutive negatives, low score or drift, legal/fraud words, repeated complaint, refund demand) |
| RAG | Chroma + sentence-transformers + LangChain retriever | 🔄 | TF-IDF (scikit-learn) with light stemming over `data/retail_kb.json`; no vector DB |
| Response generation | ChatPromptTemplate "acknowledge then act" | 🔄 | Same strategy in a system prompt, chosen by sentiment rule |
| | GPT-4o-mini / Claude Haiku or Sonnet | 🔄 | **Gemini** (free-tier lite models, fallback chain) primary; Claude Haiku wired as backup; template replies if no LLM |
| | Ollama + Llama-3 fallback | ❌ | Not wired in |
| Guardrails | NeMo Guardrails + pytest | 🔄 | Custom guardrail node in the LangGraph pipeline (regex on promises, prices and durations) with one retry, then template plus human handoff; pytest regression tests in `tests/` |
| PII | Microsoft Presidio | 🔄 | Regex masking of emails, cards and phones (`src/data/preprocess.py`); no address or name detection. Order IDs are kept on purpose for lookup |
| Synthetic data / labeling | LangChain synthetic loop; Label Studio | ❌ | No synthetic dialogues generated. Test set (106 turns, `data/processed/test_labeled.csv`) was drafted by an AI assistant and needs team review |
| Storage | PostgreSQL/SQLite + Redis | ❌ | Nothing persisted |
| Evaluation | scikit-learn accuracy, macro-F1, precision/recall | ✅ | `src/sentiment/evaluate.py` |
| | ECE, LLM-as-judge, matplotlib | ❌ | Not built |
| Backend | FastAPI + Uvicorn | ✅ | `src/app/api.py`: `POST /chat`, `GET /health`, CORS. No WebSocket streaming |
| Frontend | Streamlit or Gradio | ✅ | Streamlit UI (`src/app/main.py`) |
| | React, Tailwind, HTML/CSS, JS | ✅ | `frontend/` (Vite, React, Tailwind, lucide-react), wired to `/chat` with a mock fallback |
| Platforms | Colab/Kaggle, HF Hub hosting, Docker, HF Spaces/Render, GitHub Actions, LangSmith Cloud | ❌ | Trained on a laptop CPU; weights not published; no Dockerfile, hosting or CI. GitHub is used for version control |

## Also used, not in the PDF
`python-dotenv` (config), `pandas` (evaluation data), `anthropic` SDK (backup LLM), `pypdf`, `pytest`.

## Honest notes for the submission
- The default sentiment model is the **zero-shot** cardiffnlp checkpoint (97.2% on our test set). Our own fine-tuned model scored 84.0%, so it is offered as an option (`SENTIMENT_MODEL=models/retail-sentiment`), not the default.
- The PDF's "fine-tuned in three stages on retail review and chat data" is **not** what was built.
