// All UI data comes from the EmpathIQ backend (FastAPI + LangGraph). No mock data.
const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function req(path, options) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return res.json();
}

export const getConversations = () => req('/conversations');
export const createConversation = () => req('/conversations', { method: 'POST' });
export const getStats = () => req('/stats');
export const getScenarios = () => req('/scenarios');
export const getKnowledge = () => req('/knowledge');
export const getInsights = () => req('/insights');
export const sendChat = (sessionId, message) =>
  req('/chat', { method: 'POST', body: JSON.stringify({ session_id: sessionId, message }) });
