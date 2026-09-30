import React from 'react';
import { BarChart3, TrendingUp, AlertTriangle, ShieldCheck, HeartHandshake, Smile, Frown, Sparkles } from 'lucide-react';

export default function InsightsView() {
  const aspectStats = [
    { aspect: 'Delivery', positive: 62, neutral: 14, negative: 24, total: '1,420 tickets', trend: '-3.2% vs last week' },
    { aspect: 'Product Quality', positive: 88, neutral: 7, negative: 5, total: '2,890 tickets', trend: '+4.1% vs last week' },
    { aspect: 'Price & Billing', positive: 45, neutral: 32, negative: 23, total: '810 tickets', trend: 'Stable' },
    { aspect: 'Customer Service', positive: 79, neutral: 12, negative: 9, total: '1,150 tickets', trend: '+1.8% vs last week' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-card border border-border p-5 shadow-subtle">
        <h3 className="text-base font-semibold text-ink">Retail Sentiment Analytics & Insights</h3>
        <p className="text-xs text-ink-secondary mt-1">
          Aggregated customer sentiment signals detected across active digital retail touchpoints.
        </p>

        {/* Aspect Sentiment Distribution Breakdown */}
        <div className="mt-5 space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-secondary">
            Sentiment by Aspect Category (PRD Requirement FR9)
          </h4>

          <div className="space-y-3">
            {aspectStats.map((item, idx) => (
              <div key={idx} className="p-3 bg-background rounded-xl border border-border">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-ink">{item.aspect}</span>
                    <span className="text-[11px] text-ink-secondary font-mono">({item.total})</span>
                  </div>
                  <span className="text-[11px] text-ink-secondary">{item.trend}</span>
                </div>

                {/* Stacked Sentiment Bar */}
                <div className="h-2.5 rounded-full overflow-hidden flex bg-border/40">
                  <div style={{ width: `${item.positive}%` }} className="bg-success" title={`Positive: ${item.positive}%`} />
                  <div style={{ width: `${item.neutral}%` }} className="bg-info" title={`Neutral: ${item.neutral}%`} />
                  <div style={{ width: `${item.negative}%` }} className="bg-danger" title={`Negative: ${item.negative}%`} />
                </div>

                <div className="flex items-center justify-between text-[10px] text-ink-secondary mt-1.5">
                  <span className="text-success font-medium">Positive: {item.positive}%</span>
                  <span className="text-info font-medium">Neutral: {item.neutral}%</span>
                  <span className="text-danger font-medium">Negative: {item.negative}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Performance & Escalation Efficiency */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface rounded-card border border-border p-4 shadow-subtle">
          <div className="flex items-center gap-2 text-primary mb-2">
            <HeartHandshake className="w-4 h-4" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink">Empathy Response Rate</h4>
          </div>
          <p className="text-2xl font-bold text-ink">92.4%</p>
          <p className="text-[11px] text-ink-secondary mt-1">Autonomous empathetic de-escalation success</p>
        </div>

        <div className="bg-surface rounded-card border border-border p-4 shadow-subtle">
          <div className="flex items-center gap-2 text-warning mb-2">
            <AlertTriangle className="w-4 h-4" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink">Escalation Accuracy</h4>
          </div>
          <p className="text-2xl font-bold text-ink">96.8%</p>
          <p className="text-[11px] text-ink-secondary mt-1">Human handoff trigger precision</p>
        </div>

        <div className="bg-surface rounded-card border border-border p-4 shadow-subtle">
          <div className="flex items-center gap-2 text-success mb-2">
            <ShieldCheck className="w-4 h-4" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink">Safety & Policy Guard</h4>
          </div>
          <p className="text-2xl font-bold text-ink">100%</p>
          <p className="text-[11px] text-ink-secondary mt-1">Zero unverified financial refund commitments</p>
        </div>
      </div>
    </div>
  );
}
