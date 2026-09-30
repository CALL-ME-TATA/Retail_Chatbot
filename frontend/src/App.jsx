import React, { useState } from 'react';
import {
  MessageSquare,
  AlertOctagon,
  PhoneCall,
  Activity,
  Sparkles,
  Bot
} from 'lucide-react';

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

import {
  MOCK_CONVERSATIONS,
  INITIAL_STATS,
} from './data/mockData';
import { analyzeMessage } from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('conversation');
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [selectedConversation, setSelectedConversation] = useState(MOCK_CONVERSATIONS[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isHandoffModalOpen, setIsHandoffModalOpen] = useState(false);
  const [stats, setStats] = useState(INITIAL_STATS);

  // When a user selects another conversation from the left panel
  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
  };

  // When a user sends a message in the chat
  const handleSendMessage = (text) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage = {
      id: `usr-${Date.now()}`,
      sender: 'customer',
      senderName: selectedConversation.customer,
      time: timestamp,
      content: text,
    };

    // Append user message immediately
    const updatedMessages = [...selectedConversation.messages, userMessage];
    const updatedConv = {
      ...selectedConversation,
      messages: updatedMessages,
      lastMessage: text,
      timestamp: 'Just now',
    };

    setSelectedConversation(updatedConv);
    setConversations((prev) =>
      prev.map((c) => (c.id === updatedConv.id ? updatedConv : c))
    );

    // Trigger AI Sentiment Analysis & Response
    setIsAnalyzing(true);

    analyzeMessage(selectedConversation.id, text).then((analysis) => {
      const aiTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const aiMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        senderName: 'EmpathIQ AI',
        time: aiTimestamp,
        content: analysis.aiReply,
      };

      // Add turn to trajectory
      const turnCount = (updatedConv.trajectory?.length || 0) + 1;
      const newTrajectoryPoint = {
        turn: `Turn ${turnCount}`,
        label: `T${turnCount}`,
        score: analysis.trajectoryScore,
        sentiment: analysis.sentiment.charAt(0).toUpperCase() + analysis.sentiment.slice(1),
        text: text.slice(0, 30) + (text.length > 30 ? '...' : '')
      };

      const newTrajectory = [...(updatedConv.trajectory || []), newTrajectoryPoint];

      // Build escalation details if required
      const newEscalationDetails = analysis.escalate
        ? {
          priority: analysis.priority === 'high' ? 'High' : 'Medium',
          reason: analysis.escalationReason || 'Repeated customer frustration without resolution.',
          trigger: analysis.escalationTrigger || 'Repeated negative sentiment',
          recommendedAction: 'Human agent review & dispatch resolution',
          handoffSummary: {
            customer: updatedConv.customer,
            issue: `${analysis.intent} - ${updatedConv.product}`,
            sentiment: `${analysis.sentiment.toUpperCase()} (${Math.round(analysis.confidence * 100)}%)`,
            trend: 'Increasingly negative across conversation',
            reason: analysis.escalationReason || 'Customer frustration threshold exceeded',
            recommendedAction: 'Priority tier-2 human agent intervention',
            carrierStatus: updatedConv.orderStatus,
            estimatedValue: updatedConv.orderAmount || '$150.00'
          }
        }
        : null;

      const finalizedConv = {
        ...updatedConv,
        messages: [...updatedMessages, aiMessage],
        sentiment: analysis.sentiment,
        confidence: analysis.confidence,
        emotion: analysis.emotion,
        intent: analysis.intent,
        aspect: analysis.aspect,
        aspectBreakdown: analysis.aspectBreakdown || updatedConv.aspectBreakdown,
        priority: analysis.priority,
        escalate: analysis.escalate,
        escalationDetails: newEscalationDetails,
        strategy: {
          ...updatedConv.strategy,
          action: analysis.strategyAction,
        },
        trajectory: newTrajectory,
      };

      setSelectedConversation(finalizedConv);
      setConversations((prev) =>
        prev.map((c) => (c.id === finalizedConv.id ? finalizedConv : c))
      );

      // If escalated, increment escalations count
      if (analysis.escalate && !selectedConversation.escalate) {
        setStats((s) => ({ ...s, escalationsToday: s.escalationsToday + 1 }));
      }

      setIsAnalyzing(false);
    });
  };

  // Run one of the 7 predefined PRD Hackathon Demo Scenarios
  const handleRunScenario = (scenario) => {
    setActiveTab('conversation');
    handleSendMessage(scenario.inputPrompt);
  };

  return (
    <div className="min-h-screen bg-background text-ink flex flex-col">
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Main Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              Customer Support
            </h1>
            <p className="text-sm text-ink-secondary mt-1">
              Understand customer sentiment, respond with empathy, and escalate when needed.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <AIStatus isAnalyzing={isAnalyzing} />
          </div>
        </div>

        {/* Top Summary Cards (Only 3 compact cards per prompt spec) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard
            label="Active Conversations"
            value={stats.activeConversations}
            trend="+2 from last hour"
            icon={MessageSquare}
            badgeColor="neutral"
          />
          <StatCard
            label="Negative Conversations"
            value={stats.negativeConversations}
            trend="Monitored by AI"
            icon={AlertOctagon}
            badgeColor="warning"
          />
          <StatCard
            label="Escalations Today"
            value={stats.escalationsToday}
            trend="Human action required"
            icon={PhoneCall}
            badgeColor="danger"
          />
        </div>

        {/* Hackathon Evaluation Mode Quick Scenario Bar */}
        <DemoScenariosBar onSelectScenario={handleRunScenario} />

        {/* Dynamic Content Views */}
        {activeTab === 'conversation' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* LEFT COLUMN: Customer / Conversation List (3 cols on lg) */}
            <div className="lg:col-span-3">
              <ConversationList
                conversations={conversations}
                selectedConversation={selectedConversation}
                onSelectConversation={handleSelectConversation}
              />
            </div>

            {/* CENTER COLUMN: Main Chatbot Conversation (5 cols on lg) */}
            <div className="lg:col-span-5">
              <ChatWindow
                conversation={selectedConversation}
                messages={selectedConversation.messages}
                isAnalyzing={isAnalyzing}
                onSendMessage={handleSendMessage}
              />
            </div>

            {/* RIGHT COLUMN: AI Sentiment + Escalation Analysis (4 cols on lg) */}
            <div className="lg:col-span-4 space-y-4">

              {/* Header Title */}
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-ink">
                    Conversation Intelligence
                  </h2>
                </div>
                <span className="text-[11px] text-ink-secondary font-mono">
                  v1.2 Real-time
                </span>
              </div>

              {/* 1. Current Sentiment Card */}
              <SentimentCard
                sentiment={selectedConversation.sentiment}
                confidence={selectedConversation.confidence}
              />

              {/* 2. Detected Emotion Card */}
              <EmotionCard emotion={selectedConversation.emotion} />

              {/* 3. Customer Intent & Aspect Card */}
              <IntentCard
                intent={selectedConversation.intent}
                aspect={selectedConversation.aspect}
                aspectBreakdown={selectedConversation.aspectBreakdown}
                priority={selectedConversation.priority}
              />

              {/* 4. Sentiment Trajectory Line Chart */}
              <SentimentTrajectory
                trajectory={selectedConversation.trajectory}
              />

              {/* 5. Escalation Card */}
              <EscalationCard
                escalation={
                  selectedConversation.escalate
                    ? selectedConversation.escalationDetails
                    : null
                }
                onOpenHandoff={() => setIsHandoffModalOpen(true)}
                onMarkReviewed={() => {
                  // User marked reviewed
                }}
              />

              {/* 6. AI Response Strategy */}
              <ResponseStrategyCard
                sentiment={selectedConversation.sentiment}
                customAction={selectedConversation.strategy?.action}
              />

            </div>

          </div>
        )}

        {/* Insights Tab View */}
        {activeTab === 'insights' && <InsightsView />}

        {/* Knowledge Tab View */}
        {activeTab === 'knowledge' && <KnowledgeView />}

        {/* Overview Tab View */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-surface rounded-card border border-border p-6 shadow-subtle">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-ink">EmpathIQ Executive Overview</h3>
              </div>
              <p className="text-sm text-ink-secondary max-w-3xl leading-relaxed">
                EmpathIQ is an empathetic AI co-pilot designed specifically for modern digital retail. It continuously monitors customer emotion, categorizes retail complaints into granular aspects (Product, Delivery, Price, Service), and detects friction early to execute seamless human handoffs before customer churn occurs.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
                <div className="p-4 rounded-xl bg-background border border-border">
                  <span className="text-xs text-ink-secondary">Total Customers Analyzed</span>
                  <p className="text-2xl font-bold text-ink mt-1">14,892</p>
                  <span className="text-[11px] text-success font-medium">99.2% uptime</span>
                </div>
                <div className="p-4 rounded-xl bg-background border border-border">
                  <span className="text-xs text-ink-secondary">Average Sentiment Score</span>
                  <p className="text-2xl font-bold text-ink mt-1">+0.74</p>
                  <span className="text-[11px] text-success font-medium">▲ +0.08 this month</span>
                </div>
                <div className="p-4 rounded-xl bg-background border border-border">
                  <span className="text-xs text-ink-secondary">Human Handoff Resolution Time</span>
                  <p className="text-2xl font-bold text-ink mt-1">3.4 min</p>
                  <span className="text-[11px] text-ink-secondary font-medium">Reduced by 64% with AI briefing</span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('conversation')}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-medium shadow-subtle transition-smooth"
                >
                  Return to Live Chatbot
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Handoff Summary Modal */}
      <HandoffModal
        isOpen={isHandoffModalOpen}
        onClose={() => setIsHandoffModalOpen(false)}
        customerName={selectedConversation.customer}
        handoffData={
          selectedConversation.escalationDetails?.handoffSummary || {
            customer: selectedConversation.customer,
            issue: selectedConversation.intent,
            sentiment: selectedConversation.sentiment,
            trend: 'Increasingly negative',
            reason: selectedConversation.escalationDetails?.reason || 'Customer expressed repeated frustration.',
            recommendedAction: 'Priority human agent review'
          }
        }
      />
    </div>
  );
}
