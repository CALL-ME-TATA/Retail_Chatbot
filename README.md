# Retail Customer Sentiment Analysis Chatbot

AI chatbot that detects customer sentiment in real time, replies empathetically, and recommends escalation for negative cases.

## Layout
- `data/` raw / processed / synthetic feedback (anonymized)
- `src/data/` cleaning, class balancing, synthetic data generation
- `src/sentiment/` train / predict / evaluate (target: >=80% accuracy)
- `src/chatbot/` response generation, escalation rules, retail product context
- `src/app/` chat interface (Streamlit)
- `docs/` model + integration documentation
- `demo/` demo video and scenarios
- `tests/`, `notebooks/`, `models/`

## Run
```
pip install -r requirements.txt
streamlit run src/app/main.py
```
