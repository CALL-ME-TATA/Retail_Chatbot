import React, { useEffect } from 'react';
import { X, UserCheck, AlertTriangle, ArrowRight, ShieldCheck, Copy, Check } from 'lucide-react';

export default function HandoffModal({ isOpen, onClose, handoffData, customerName }) {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !handoffData) return null;

  const handleCopy = () => {
    const summaryText = `HANDOFF SUMMARY\nCustomer: ${handoffData.customer || customerName}\nIssue: ${handoffData.issue}\nSentiment: ${handoffData.sentiment}\nConversation trend: ${handoffData.trend}\nReason for escalation: ${handoffData.reason}\nRecommended action: ${handoffData.recommendedAction}`;
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-message"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-surface rounded-card border border-border shadow-dropdown w-full max-w-lg overflow-hidden animate-message"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-background">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-danger-light border border-danger-border flex items-center justify-center text-danger">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 id="modal-title" className="text-sm font-semibold text-ink leading-tight">
                HANDOFF SUMMARY
              </h3>
              <p className="text-[11px] text-ink-secondary">
                Customer Escalation Package for Human Agent
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-secondary hover:text-ink hover:bg-black/5 transition-smooth"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-3.5 text-xs">

          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-background border border-border">
            <div>
              <span className="text-[11px] text-ink-secondary block">Customer:</span>
              <span className="font-semibold text-ink text-sm">
                {handoffData.customer || customerName}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-ink-secondary block">Current Sentiment:</span>
              <span className="font-semibold text-danger">
                {handoffData.sentiment || 'Negative'}
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-start justify-between gap-3 pb-2 border-b border-border">
              <span className="text-ink-secondary font-medium min-w-[130px]">Issue:</span>
              <span className="text-ink font-semibold text-right">
                {handoffData.issue}
              </span>
            </div>

            <div className="flex items-start justify-between gap-3 pb-2 border-b border-border">
              <span className="text-ink-secondary font-medium min-w-[130px]">Conversation trend:</span>
              <span className="text-ink font-medium text-right text-danger">
                {handoffData.trend || 'Increasingly negative'}
              </span>
            </div>

            <div className="flex flex-col gap-1 pb-2 border-b border-border">
              <span className="text-ink-secondary font-medium">Reason for escalation:</span>
              <p className="text-ink bg-danger-light/50 p-2 rounded-lg border border-danger-border/60 leading-relaxed font-medium">
                {handoffData.reason}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-ink-secondary font-medium">Recommended action:</span>
              <div className="flex items-center gap-1.5 text-ink font-medium bg-primary-subtle p-2 rounded-lg border border-primary/20">
                <ArrowRight className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span>{handoffData.recommendedAction}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-border bg-background">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg border border-border bg-surface text-ink-secondary hover:text-ink hover:bg-black/5 text-xs font-medium flex items-center gap-1.5 transition-smooth"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Summary' : 'Copy Summary'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-black/5 text-ink text-xs font-medium transition-smooth"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                alert(`Ticket assigned to current Support Agent. Human live takeover activated.`);
                onClose();
              }}
              className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-dark text-white text-xs font-medium flex items-center gap-1.5 shadow-subtle transition-smooth"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Accept & Take Over</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
