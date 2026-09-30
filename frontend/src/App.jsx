import React, { useEffect, useState } from 'react';
import { MessageSquare, AlertOctagon, PhoneCall, Plus } from 'lucide-react';

import Navbar from './components/Navbar';
import AIStatus from './components/AIStatus';
import StatCard from './components/StatCard';
import ConversationList from './components/ConversationList';
import ChatWindow from './components/ChatWindow';
import SentimentCard from './components/SentimentCard';
import EmotionCard from './components/EmotionCard';
import IntentCard from './components/IntentCard';
import SentimentTrajectory from './components/SentimentTrajectory';
import EscalationCard from './components/EscalationCard';
import ResponseStrategyCard from './components/ResponseStrategyCard';
import HandoffModal from './components/HandoffModal';
import DemoScenariosBar from './components/DemoScenariosBar';
import InsightsView from './components/InsightsView';
import KnowledgeView from './components/KnowledgeView';

import { createConversation, getConversations, getStats, sendChat } from './api';

// Every value rendered here comes from the backend pipeline (FastAPI -> LangGraph). Nothing is mocked.
export default function App() {
  const [activeTab, setActiveTab] = useState('conversation');
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isHandoffModalOpen, setIsHandoffModalOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  const selectedConversation = conversations.find((c) => c.id === selectedId) || null;

  const upsert = (conv) =>
    setConversations((prev) =>
      prev.some((c) => c.id === conv.id) ? prev.map((c) => (c.id === conv.id ? conv : c)) : [...prev, conv]
    );

  const newConversation = async () => {
    const conv = await createConversation();
    upsert(conv);
    setSelectedId(conv.id);
    setStats(await getStats());
  };

  useEffect(() => {
    (async () => {
      try {
        const convs = await getConversations();
        if (convs.length) {
          setConversations(convs);
          setSelectedId(convs[0].id);
          setStats(await getStats());
        } else {
          await newConversation();
        }
      } catch (e) {
        setError(e.message);
      }
    })();
  }, []);

  const handleSendMessage = async (text) => {
    if (!selectedConversation || isAnalyzing) return;
    // show the customer's own message immediately; everything else comes back from the pipeline
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    upsert({
      ...selectedConversation,
      messages: [...selectedConversation.messages,
        { id: `pending-${Date.now()}`, sender: 'customer', senderName: selectedConversation.customer, time, content: text }],
    });
    setIsAnalyzing(true);
    try {
      const r = await sendChat(selectedConversation.id, text);
      upsert(r.conversation);
      setStats(r.stats);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRunScenario = (scenario) => {
    setActiveTab('conversation');
    handleSendMessage(scenario.inputPrompt);
  };

  if (!selectedConversation) {
    return (
      <div className="min-h-screen bg-background text-ink flex items-center justify-center p-6">
        <div className="bg-surface border border-border rounded-card p-6 max-w-md text-sm">
          {error ? (
            <>
              <p className="font-semibold text-danger">Cannot reach the EmpathIQ backend.</p>
              <p className="text-ink-secondary mt-2">{error}</p>
              <p className="text-ink-secondary mt-2">
                Start it with <code>python -m uvicorn src.app.api:app --port 8000</code> and reload.
              </p>
            </>
          ) : (
            <p className="text-ink-secondary">Connecting to the backend…</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-ink flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">Customer Support</h1>
            <p className="text-sm text-ink-secondary mt-1">
              Understand customer sentiment, respond with empathy, and escalate when needed.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={newConversation}
              className="px-3 py-1.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-medium flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> New conversation
            </button>
            <AIStatus isAnalyzing={isAnalyzing} />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg border border-danger-border bg-danger-light text-danger text-xs">
            Backend error: {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard label="Active Conversations" value={stats?.activeConversations ?? '—'}
            trend="Live from backend" icon={MessageSquare} badgeColor="neutral" />
          <StatCard label="Negative Conversations" value={stats?.negativeConversations ?? '—'}
            trend="Latest turn classified negative" icon={AlertOctagon} badgeColor="warning" />
          <StatCard label="Escalations" value={stats?.escalationsToday ?? '—'}
            trend="Flagged for a human agent" icon={PhoneCall} badgeColor="danger" />
        </div>

        <DemoScenariosBar onSelectScenario={handleRunScenario} />

        {activeTab === 'conversation' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-3">
              <ConversationList
                conversations={conversations}
                selectedConversation={selectedConversation}
                onSelectConversation={(c) => setSelectedId(c.id)}
              />
            </div>

            <div className="lg:col-span-5">
              <ChatWindow
                conversation={selectedConversation}
                messages={selectedConversation.messages}
                isAnalyzing={isAnalyzing}
                onSendMessage={handleSendMessage}
              />
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-ink">Conversation Intelligence</h2>
                </div>
                <span className="text-[11px] text-ink-secondary font-mono">Live pipeline</span>
              </div>

              <SentimentCard sentiment={selectedConversation.sentiment} confidence={selectedConversation.confidence} />
              <EmotionCard emotion={selectedConversation.emotion} />
              <IntentCard
                intent={selectedConversation.intent}
                aspect={selectedConversation.aspect}
                aspectBreakdown={selectedConversation.aspectBreakdown}
                priority={selectedConversation.priority}
              />
              <SentimentTrajectory trajectory={selectedConversation.trajectory} />
              <EscalationCard
                escalation={selectedConversation.escalate ? selectedConversation.escalationDetails : null}
                onOpenHandoff={() => setIsHandoffModalOpen(true)}
                onMarkReviewed={() => {}}
              />
              <ResponseStrategyCard strategy={selectedConversation.strategy} />
            </div>
          </div>
        )}

        {activeTab === 'insights' && <InsightsView />}
        {activeTab === 'knowledge' && <KnowledgeView />}
        {activeTab === 'overview' && <InsightsView />}
      </main>

      {selectedConversation.escalationDetails && (
        <HandoffModal
          isOpen={isHandoffModalOpen}
          onClose={() => setIsHandoffModalOpen(false)}
          customerName={selectedConversation.customer}
          handoffData={selectedConversation.escalationDetails.handoffSummary}
        />
      )}
    </div>
  );
}
