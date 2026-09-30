import React, { useEffect, useState } from 'react';
import { AlertTriangle, ShieldCheck, Gauge, Target } from 'lucide-react';
import { getInsights } from '../api';

const pct = (v) => (v == null ? '—' : `${(v * 100).toFixed(1)}%`);

function Metric({ icon: Icon, title, value, note, color }) {
  return (
    <div className="bg-surface rounded-card border border-border p-4 shadow-subtle">
      <div className={`flex items-center gap-2 mb-2 ${color}`}>
        <Icon className="w-4 h-4" />
        <h4 className="text-xs font-semibold uppercase tracking-wider text-ink">{title}</h4>
      </div>
      <p className="text-2xl font-bold text-ink">{value}</p>
      <p className="text-[11px] text-ink-secondary mt-1">{note}</p>
    </div>
  );
}

export default function InsightsView() {
  const [d, setD] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    getInsights().then(setD).catch((e) => setErr(e.message));
  }, []);

  if (err) return <p className="text-sm text-danger">Backend unavailable: {err}</p>;
  if (!d) return <p className="text-sm text-ink-secondary">Loading insights from the backend…</p>;

  const ev = d.model_eval;
  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-card border border-border p-5 shadow-subtle">
        <h3 className="text-base font-semibold text-ink">Sentiment by aspect (live)</h3>
        <p className="text-xs text-ink-secondary mt-1">
          Computed from {d.turns} customer turns across {d.conversations} conversations handled in this session.
        </p>
        <div className="mt-5 space-y-3">
          {d.aspects.length === 0 && (
            <p className="text-xs text-ink-secondary">No messages yet. Chat with the bot to populate this view.</p>
          )}
          {d.aspects.map((a) => {
            const w = (k) => `${(a[k] / a.total) * 100}%`;
            return (
              <div key={a.aspect} className="p-3 bg-background rounded-xl border border-border">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-ink">{a.aspect}</span>
                  <span className="text-[11px] text-ink-secondary font-mono">{a.total} turns</span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden flex bg-border/40">
                  <div style={{ width: w('positive') }} className="bg-success" />
                  <div style={{ width: w('neutral') }} className="bg-info" />
                  <div style={{ width: w('negative') }} className="bg-danger" />
                </div>
                <div className="flex items-center justify-between text-[10px] text-ink-secondary mt-1.5">
                  <span className="text-success font-medium">Positive: {a.positive}</span>
                  <span className="text-info font-medium">Neutral: {a.neutral}</span>
                  <span className="text-danger font-medium">Negative: {a.negative}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Metric icon={Target} title="Model accuracy" color="text-primary"
          value={ev ? pct(ev.accuracy) : '—'}
          note={ev ? `Macro-F1 ${ev.macro_f1.toFixed(3)} on ${ev.n} labeled turns (${ev.model.split('/').pop()})` : 'Run src.sentiment.evaluate'} />
        <Metric icon={AlertTriangle} title="Escalation rate" color="text-warning"
          value={pct(d.escalation_rate)} note="Share of turns handed to a human" />
        <Metric icon={ShieldCheck} title="Guardrail first-pass" color="text-success"
          value={pct(d.guardrail_first_pass)} note="Replies accepted without a retry" />
        <Metric icon={Gauge} title="Avg latency" color="text-info"
          value={d.avg_latency_s == null ? '—' : `${d.avg_latency_s.toFixed(1)} s`} note="Full pipeline per turn" />
      </div>
    </div>
  );
}
