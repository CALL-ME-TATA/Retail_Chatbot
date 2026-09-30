"""Chat UI.  Run from the repo root:  streamlit run src/app/main.py"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parents[2]))

import streamlit as st

from src.chatbot.pipeline import Session

EMOJI = {"negative": "🔴", "neutral": "⚪", "positive": "🟢"}

st.set_page_config(page_title="EmpathIQ", page_icon="💬", layout="wide")
if "session" not in st.session_state:
    st.session_state.session, st.session_state.log = Session(), []
    st.session_state.escalated = None

chat, side = st.columns([2, 1])

with chat:
    st.title("EmpathIQ · Retail Support")
    st.caption("You are chatting with an AI assistant. Try order ORD-1002 or ORD-1003.")
    if st.session_state.escalated:
        st.error(f"🚨 **Escalated to a human agent**  \n{st.session_state.escalated}")
    for m in st.session_state.log:
        with st.chat_message(m["role"]):
            st.write(m["content"])
            if m.get("meta"):
                st.caption(m["meta"])

    if msg := st.chat_input("Type your message"):
        st.session_state.log.append({"role": "user", "content": msg})
        with st.spinner("Thinking..."):
            r = st.session_state.session.chat(msg)
        s = r["sentiment"]
        meta = f"{EMOJI[s['label']]} {s['label']} ({s['score']:.0%})"
        if r["escalation"]["escalate"]:
            meta += f" · escalate: {r['escalation']['reason']}"
            st.session_state.escalated = r["handoff_summary"]
        st.session_state.log.append({"role": "assistant", "content": r["reply"], "meta": meta, "path": r["path"]})
        st.rerun()

with side:
    st.subheader("Conversation sentiment")
    traj = st.session_state.session.trajectory
    if traj:
        st.line_chart(traj, height=200)
        st.metric("Score (−1 angry … +1 happy)", f"{traj[-1]:+.2f}")
    else:
        st.info("Send a message to start tracking.")
    last = next((m for m in reversed(st.session_state.log) if m.get("path")), None)
    if last:
        st.subheader("Last LangGraph path")
        st.code(" → ".join(last["path"]))
    if st.button("New conversation"):
        st.session_state.clear()
        st.rerun()
