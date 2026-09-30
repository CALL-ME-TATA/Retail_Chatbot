import React from 'react';
import { Compass, ArrowRight } from 'lucide-react';

// strategy comes from the backend (the same rule-selected prompt the LLM receives)
export default function ResponseStrategyCard({ strategy }) {
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
          From pipeline
        </span>
      </div>

      {strategy ? (
        <div className="bg-background rounded-lg border border-border p-3 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-ink">
            <span>Current strategy:</span>
            <span className="px-1.5 py-0.5 rounded bg-surface border border-border text-primary font-mono text-[11px]">
              {strategy.type}
            </span>
          </div>
          <div className="flex items-start gap-1 text-xs text-ink-secondary pt-1">
            <ArrowRight className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-ink">{strategy.guidance}</span>
          </div>
        </div>
      ) : (
        <p className="text-[11px] text-ink-secondary">Send a message to see the strategy the model selects.</p>
      )}
    </div>
  );
}
