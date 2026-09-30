import React from 'react';
import { Compass, ArrowRight } from 'lucide-react';

export default function ResponseStrategyCard({ sentiment = 'negative', customAction = null }) {
  const getStrategy = (sent) => {
    const s = (sent || '').toLowerCase();
    if (s === 'negative') {
      return {
        strategy: 'ACKNOWLEDGE → ACT',
        action: customAction || 'Reflect and apologize',
        guidance: 'Acknowledge frustration, validate customer experience, and offer direct resolution or escalation path.'
      };
    }
    if (s === 'positive') {
      return {
        strategy: 'AFFIRM',
        action: customAction || 'Affirm',
        guidance: 'Validate satisfaction warmly, provide complimentary care details or warranty registration.'
      };
    }
    if (s === 'mixed') {
      return {
        strategy: 'ACKNOWLEDGE → ACT',
        action: customAction || 'Segment & Address',
        guidance: 'Validate the positive aspect while taking immediate accountability for the service defect.'
      };
    }
    return {
      strategy: 'INFORM',
      action: customAction || 'Inform',
      guidance: 'Provide clear, concise policy guidelines and self-service return steps without friction.'
    };
  };

  const current = getStrategy(sentiment);

  return (
    <div className="bg-surface rounded-card border border-border p-4 shadow-subtle space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-secondary">
            Response Strategy
          </h3>
        </div>
        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-primary-subtle text-primary-dark border border-primary/20">
          PRD Policy Engine
        </span>
      </div>

      <div className="bg-background rounded-lg border border-border p-3 space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-ink">
          <span>Current strategy:</span>
          <span className="px-1.5 py-0.5 rounded bg-surface border border-border text-primary font-mono text-[11px]">
            {current.strategy}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs text-ink-secondary pt-1">
          <ArrowRight className="w-3 h-3 text-primary flex-shrink-0" />
          <span className="font-medium text-ink">Action: "{current.action}"</span>
        </div>

        <p className="text-[11px] text-ink-secondary leading-relaxed pt-1">
          {current.guidance}
        </p>
      </div>
    </div>
  );
}
