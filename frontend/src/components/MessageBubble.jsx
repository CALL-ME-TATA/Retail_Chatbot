import React from 'react';
import { Sparkles, User } from 'lucide-react';

export default function MessageBubble({ message, customerAvatar, customerInitials }) {
  const isAI = message.sender === 'ai';

  return (
    <div className={`flex items-start gap-3 animate-message ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>

      {/* Avatar */}
      <div className="flex-shrink-0 mt-0.5">
        {isAI ? (
          <div className="w-8 h-8 rounded-full bg-primary-light border border-primary/20 text-primary-dark flex items-center justify-center shadow-subtle">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
        ) : customerAvatar ? (
          <img
            src={customerAvatar}
            alt={message.senderName || 'Customer'}
            className="w-8 h-8 rounded-full object-cover border border-border shadow-subtle"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary-dark font-medium text-xs flex items-center justify-center shadow-subtle">
            {customerInitials || 'C'}
          </div>
        )}
      </div>

      {/* Bubble Container */}
      <div className={`max-w-[82%] sm:max-w-[75%] ${isAI ? 'items-start' : 'items-end'} flex flex-col`}>

        {/* Sender Name & Timestamp */}
        <div className={`flex items-center gap-2 mb-1 px-1 text-xs text-ink-secondary ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
          <span className="font-medium text-ink">
            {isAI ? 'EmpathIQ AI' : message.senderName || 'Customer'}
          </span>
          <span className="text-[11px] text-ink-secondary/70">
            {message.time}
          </span>
          {isAI && (
            <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-primary-light/60 text-primary-dark border border-primary/10">
              AI Response
            </span>
          )}
        </div>

        {/* Message Bubble */}
        <div
          className={`p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line border ${isAI
              ? 'bg-[#FAF6F0] text-ink border-[#EBE3D7] rounded-tl-sm shadow-subtle'
              : 'bg-surface text-ink border-border rounded-tr-sm shadow-subtle'
            }`}
        >
          {message.content}
        </div>

      </div>
    </div>
  );
}
