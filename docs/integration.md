# Integration

- **Orchestration:** LangGraph `StateGraph` in `src/chatbot/pipeline.py` (mask_pii, sentiment, track, retrieve, generate, guardrail with one retry, finalize).
- **LLM:** Gemini via `langchain-google-genai` with a fallback chain across free-tier models; Anthropic Claude as backup; template replies if no LLM is reachable.
- **REST API:** `uvicorn src.app.api:app`, then `POST /chat {"session_id": "...", "message": "..."}` returns reply, sentiment, escalation decision, trajectory, graph path and handoff summary.
- **UI:** `streamlit run src/app/main.py` (calls the pipeline directly).
- **Config:** `.env` with `GEMINI_API_KEY` (and optionally `ANTHROPIC_API_KEY`, `GEMINI_MODELS`, `SENTIMENT_MODEL`).
- **Handoff:** when `escalation.escalate` is true the API returns `handoff_summary` for the human agent.
