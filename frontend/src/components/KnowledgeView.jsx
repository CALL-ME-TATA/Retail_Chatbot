import React, { useEffect, useState } from 'react';
import { BookOpen, FileCheck, Package } from 'lucide-react';
import { getKnowledge } from '../api';

export default function KnowledgeView() {
  const [kb, setKb] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    getKnowledge().then(setKb).catch((e) => setErr(e.message));
  }, []);

  if (err) return <p className="text-sm text-danger">Backend unavailable: {err}</p>;
  if (!kb) return <p className="text-sm text-ink-secondary">Loading knowledge base…</p>;

  const Card = ({ tag, text, Icon }) => (
    <div className="p-4 bg-background rounded-xl border border-border space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-primary-subtle text-primary-dark border border-primary/20">
          {tag}
        </span>
        <Icon className="w-3.5 h-3.5 text-ink-secondary" />
      </div>
      <p className="text-xs text-ink-secondary leading-relaxed">{text}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-card border border-border p-5 shadow-subtle">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-4 h-4 text-primary" />
          <h3 className="text-base font-semibold text-ink">Retail knowledge base (used for RAG)</h3>
        </div>
        <p className="text-xs text-ink-secondary">
          {kb.policies.length} policies, {kb.products.length} products and {kb.orders} orders loaded from data/retail_kb.json.
          The guardrail only allows claims found in these entries.
        </p>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-secondary mt-5">Policies</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {kb.policies.map((p) => <Card key={p.id} tag={p.id} text={p.text} Icon={FileCheck} />)}
        </div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-secondary mt-5">Products</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {kb.products.map((p) => <Card key={p.id} tag={p.name} text={p.text} Icon={Package} />)}
        </div>
      </div>
    </div>
  );
}
