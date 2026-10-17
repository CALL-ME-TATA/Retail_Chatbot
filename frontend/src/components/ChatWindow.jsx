import React, { useRef, useEffect } from 'react';
import { Info, Sparkles, AlertCircle } from 'lucide-react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

export default function ChatWindow({
  conversation,
  messages,
  isAnalyzing,
  onSendMessage
}) {
  const scrollRef = useRef(null);

  // Scroll only the message list (scrollIntoView also scrolls the page), and only when the count changes, not on every poll.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages.length, isAnalyzing]);

  if (!conversation) {
    return (
      <div className="bg-surface rounded-card border border-border p-8 shadow-subtle text-center text-ink-secondary">
        Select a conversation from the list to begin.
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-card border border-border p-4 shadow-subtle flex flex-col h-[740px]">

      {/* Header */}
      <div className="pb-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-ink">Conversation</h2>
              <span className="text-xs text-ink-secondary">with</span>
              <span className="text-sm font-semibold text-ink">{conversation.customer}</span>
            </div>

            {/* AI Disclosure requirement from PRD */}
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-ink-secondary">
              <Info className="w-3.5 h-3.5 text-primary" />
              <span>AI-assisted conversation</span>
              <span className="text-ink-secondary/50">•</span>
              <span>Model: EmpathIQ Retail Agent v1.2</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-success-light text-success border border-success-border">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse-subtle"></span>
              Live conversation
            </span>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            customerAvatar={conversation.avatar}
            customerInitials={conversation.initials}
          />
        ))}

        {/* Analyzing / Typing Indicator */}
        {isAnalyzing && (
          <div className="flex items-start gap-3 animate-message">
            <div className="w-8 h-8 rounded-full bg-primary-light border border-primary/20 text-primary-dark flex items-center justify-center shadow-subtle flex-shrink-0">
              <Sparkles className="w-4 h-4 text-primary animate-spin" />
            </div>
            <div className="p-3 bg-[#FAF6F0] border border-[#EBE3D7] rounded-2xl rounded-tl-sm text-xs text-ink-secondary flex items-center gap-2 shadow-subtle">
              <span className="inline-flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.15s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.3s]"></span>
              </span>
              <span>EmpathIQ analyzing sentiment & drafting empathetic reply...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <MessageInput onSendMessage={onSendMessage} isAnalyzing={isAnalyzing} />

    </div>
  );
}
