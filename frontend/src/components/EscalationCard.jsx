import React, { useState } from 'react';
import { AlertTriangle, UserCheck, FileText, CheckCircle2 } from 'lucide-react';

export default function EscalationCard({
  escalation,
  onOpenHandoff,
  onMarkReviewed
}) {
  const [marked, setMarked] = useState(false);

  if (!escalation) {
    return (
      <div className="bg-surface rounded-card border border-border p-4 shadow-subtle text-xs text-ink-secondary flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-success" />
        <span>No human escalation currently required. AI handling autonomously.</span>
      </div>
    );
  }

  const handleMarkReview = () => {
    setMarked(true);
    if (onMarkReviewed) onMarkReviewed();
  };

  return (
    <div className="bg-[#FAF2F2] rounded-card border border-[#ECCECE] p-4 shadow-subtle space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 text-danger">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        <h3 className="text-xs font-semibold uppercase tracking-wider">
          Human Escalation Recommended
        </h3>
      </div>

      {/* Details */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-ink-secondary">Priority:</span>
          <span className="font-bold text-danger bg-danger-light px-2 py-0.5 rounded border border-danger-border text-[11px]">
            {escalation.priority || 'High'}
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-ink-secondary">Reason:</span>
          <p className="text-ink font-medium leading-relaxed bg-white/60 p-2 rounded border border-danger-border/40">
            "{escalation.reason || 'Customer has expressed repeated frustration and the issue remains unresolved.'}"
          </p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-ink-secondary">Trigger:</span>
          <span className="text-ink font-medium text-[11px] truncate max-w-[200px]">
            {escalation.trigger || 'Repeated negative sentiment'}
          </span>
        </div>
      </div>

      {/* Functional Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={onOpenHandoff}
          className="flex-1 px-3 py-2 bg-surface hover:bg-white text-ink border border-border rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 shadow-subtle transition-smooth"
        >
          <FileText className="w-3.5 h-3.5 text-primary" />
          <span>View Handoff Summary</span>
        </button>

        <button
          type="button"
          onClick={handleMarkReview}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 shadow-subtle transition-smooth ${marked
              ? 'bg-success text-white'
              : 'bg-danger text-white hover:bg-danger/90'
            }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>{marked ? 'Marked for Review ✓' : 'Mark for Human Review'}</span>
        </button>
      </div>

      {marked && (
        <p className="text-[11px] text-success font-medium text-center animate-message">
          ✓ Conversation assigned to Tier-2 supervisor queue.
        </p>
      )}
    </div>
  );
}
