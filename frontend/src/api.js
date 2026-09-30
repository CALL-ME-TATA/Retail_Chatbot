import { simulateAiAnalysis } from './data/mockData';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const EMOTION = { negative: 'Frustrated', neutral: 'Inquiring', positive: 'Delighted' };
const STRATEGY = { negative: 'Reflect and apologize', neutral: 'Inform', positive: 'Affirm and delight' };

// Calls the EmpathIQ backend (FastAPI + LangGraph) and maps it to the shape the UI expects.
// Falls back to the local mock if the backend is unreachable so the demo never breaks.
export async function analyzeMessage(sessionId, text) {
  try {
    const res = await fetch(`${API}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: String(sessionId), message: text }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const r = await res.json();
    const label = r.sentiment.label;
    const esc = r.escalation;
    return {
      aiReply: r.reply,
      sentiment: label,
      confidence: r.sentiment.score,
      emotion: EMOTION[label],
      intent: esc.escalate ? 'Escalation Required' : label === 'neutral' ? 'General Support Inquiry' : 'Customer Feedback',
      aspect: r.aspect,
      aspectBreakdown: [{ aspect: r.aspect, sentiment: label, note: text.slice(0, 40) }],
      priority: esc.escalate ? (esc.urgency === 'high' ? 'high' : 'medium') : 'low',
      escalate: esc.escalate,
      escalationReason: esc.reason,
      escalationTrigger: esc.reason,
      strategyAction: esc.escalate ? 'Immediate Human Handoff' : STRATEGY[label],
      trajectoryScore: r.trajectory[r.trajectory.length - 1],
    };
  } catch (e) {
    console.warn('Backend unavailable, using mock analysis:', e.message);
    return simulateAiAnalysis(text);
  }
}
