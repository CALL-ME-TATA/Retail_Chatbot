import React from 'react';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

export default function SentimentCard({ sentiment = 'negative', confidence = 0.94 }) {
  const sentimentConfig = {
    positive: {
      label: 'POSITIVE',
      color: 'text-success',
      barColor: 'bg-success',
      badgeBg: 'bg-success-light border-success-border text-success',
      icon: TrendingUp,
      indicatorDot: 'bg-success'
    },
    negative: {
      label: 'NEGATIVE',
      color: 'text-danger',
      barColor: 'bg-danger',
      badgeBg: 'bg-danger-light border-danger-border text-danger',
      icon: TrendingDown,
      indicatorDot: 'bg-danger'
    },
    neutral: {
      label: 'NEUTRAL',
      color: 'text-info',
      barColor: 'bg-info',
      badgeBg: 'bg-info-light border-info-border text-info',
      icon: Minus,
      indicatorDot: 'bg-info'
    },
    mixed: {
      label: 'MIXED',
      color: 'text-warning',
      barColor: 'bg-warning',
      badgeBg: 'bg-warning-light border-warning-border text-warning',
      icon: Minus,
      indicatorDot: 'bg-warning'
    }
  };

  const config = sentimentConfig[sentiment.toLowerCase()] || sentimentConfig.negative;
  const percentage = Math.round(confidence * 100);

  return (
    <div className="bg-surface rounded-card border border-border p-4 shadow-subtle">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-secondary">
          Current Sentiment
        </h3>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${config.indicatorDot}`}></span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border tracking-wide ${config.badgeBg}`}>
            {config.label}
          </span>
        </div>
      </div>

      {/* Confidence Score & Horizontal Confidence Bar */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-ink-secondary">Confidence</span>
          <span className="font-semibold text-ink font-mono">{percentage}%</span>
        </div>

        {/* Horizontal confidence bar (strict adherence: NO giant circular gauges) */}
        <div className="w-full h-2 rounded-full bg-background border border-border overflow-hidden p-[1px]">
          <div
            className={`h-full rounded-full ${config.barColor} transition-all duration-500 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-[10px] text-ink-secondary/70 mt-1 text-right">
          Model agreement: {percentage >= 90 ? 'High certainty' : 'Moderate certainty'}
        </p>
      </div>
    </div>
  );
}
