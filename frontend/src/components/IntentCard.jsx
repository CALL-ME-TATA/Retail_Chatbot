import React from 'react';
import { Target, Layers, AlertCircle } from 'lucide-react';

export default function IntentCard({
  intent = 'Delivery Complaint',
  aspect = 'Delivery',
  aspectBreakdown = null,
  priority = 'high'
}) {
  const priorityStyles = {
    high: {
      label: 'HIGH',
      badge: 'bg-danger-light text-danger border-danger-border',
      dot: 'bg-danger'
    },
    medium: {
      label: 'MEDIUM',
      badge: 'bg-warning-light text-warning border-warning-border',
      dot: 'bg-warning'
    },
    low: {
      label: 'LOW',
      badge: 'bg-success-light text-success border-success-border',
      dot: 'bg-success'
    }
  };

  const pStyle = priorityStyles[priority.toLowerCase()] || priorityStyles.medium;

  const aspectStyles = {
    Delivery: 'bg-primary-subtle text-primary-dark border-border',
    Product: 'bg-[#F2F4F7] text-[#344054] border-border',
    Price: 'bg-warning-light text-warning border-warning-border',
    Service: 'bg-info-light text-info border-info-border'
  };

  return (
    <div className="bg-surface rounded-card border border-border p-4 shadow-subtle space-y-3.5">

      {/* Intent & Priority Row */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-ink-secondary">
            <Target className="w-3.5 h-3.5 text-primary" />
            <span className="font-semibold uppercase tracking-wider text-[11px]">Customer Intent</span>
          </div>
          <p className="text-sm font-semibold text-ink mt-1">
            {intent}
          </p>
        </div>

        {/* Priority Badge */}
        <div className="text-right">
          <span className="text-[10px] uppercase font-semibold text-ink-secondary block mb-0.5">Priority</span>
          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md border ${pStyle.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${pStyle.dot}`}></span>
            {pStyle.label}
          </span>
        </div>
      </div>

      {/* Primary Aspect Tag */}
      <div className="pt-2 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-ink-secondary">
          <Layers className="w-3.5 h-3.5 text-ink-secondary" />
          <span>Aspect Category:</span>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-md border ${aspectStyles[aspect] || aspectStyles.Delivery}`}>
          {aspect}
        </span>
      </div>

      {/* Aspect Breakdown for Multi-Aspect / Mixed Sentiment (Scenario 5 requirement) */}
      {aspectBreakdown && aspectBreakdown.length > 0 && (
        <div className="p-2.5 rounded-lg bg-background border border-border space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-ink-secondary">
            <span>Aspect Granularity</span>
            <span>Sentiment</span>
          </div>
          {aspectBreakdown.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <span className="font-medium text-ink flex items-center gap-1">
                • {item.aspect}: <span className="font-normal text-ink-secondary text-[11px]">{item.note}</span>
              </span>
              <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${item.sentiment === 'positive'
                  ? 'bg-success-light text-success border-success-border'
                  : item.sentiment === 'negative'
                    ? 'bg-danger-light text-danger border-danger-border'
                    : 'bg-info-light text-info border-info-border'
                }`}>
                {item.sentiment}
              </span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
