import React from 'react';
import { Package } from 'lucide-react';

export default function ConversationItem({ conversation, isSelected, onSelect }) {
  const sentimentStyles = {
    positive: {
      badge: 'bg-success-light text-success border-success-border',
      dot: 'bg-success',
      label: 'Positive'
    },
    negative: {
      badge: 'bg-danger-light text-danger border-danger-border',
      dot: 'bg-danger',
      label: 'Negative'
    },
    neutral: {
      badge: 'bg-info-light text-info border-info-border',
      dot: 'bg-info',
      label: 'Neutral'
    },
    mixed: {
      badge: 'bg-warning-light text-warning border-warning-border',
      dot: 'bg-warning',
      label: 'Mixed'
    }
  };

  const style = sentimentStyles[conversation.sentiment] || sentimentStyles.neutral;

  return (
    <button
      type="button"
      onClick={() => onSelect(conversation)}
      className={`w-full text-left p-3.5 rounded-xl border transition-smooth ${
        isSelected
          ? 'bg-primary-subtle/80 border-primary/40 shadow-subtle'
          : 'bg-surface border-border hover:bg-black/[0.02] hover:border-border-dark'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2">
          {conversation.avatar ? (
            <img
              src={conversation.avatar}
              alt={conversation.customer}
              className="w-7 h-7 rounded-full object-cover border border-border"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary-dark font-medium text-xs flex items-center justify-center">
              {conversation.initials}
            </div>
          )}
          <span className="font-semibold text-sm text-ink truncate max-w-[130px]">
            {conversation.customer}
          </span>
        </div>

        <span className="text-[11px] text-ink-secondary whitespace-nowrap">
          {conversation.timestamp}
        </span>
      </div>

      <p className="text-xs text-ink-secondary line-clamp-1 mb-2 font-normal">
        "{conversation.lastMessage}"
      </p>

      <div className="flex items-center justify-between pt-1 border-t border-border/60">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md border ${style.badge}`}>
            {style.label}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-ink-secondary">
          <Package className="w-3 h-3 text-ink-secondary" />
          <span>{conversation.orderId}</span>
        </div>
      </div>
    </button>
  );
}
