import React from 'react';
import { BookOpen, FileCheck, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';

export default function KnowledgeView() {
  const policies = [
    {
      title: "Retail 30-Day Return & Exchange Policy",
      category: "Returns & Exchanges",
      summary: "Customers may initiate a return within 30 days of confirmed delivery in original packaging. AI can automatically issue prepaid labels.",
      rule: "Refunds post within 2-3 business days after warehouse arrival inspection. AI must NEVER imply immediate ledger credit before warehouse scan."
    },
    {
      title: "Delayed Shipment Escalation Threshold",
      category: "Logistics & Delivery",
      summary: "Shipments delayed beyond 72 hours from promised delivery date qualify for courtesy expedited tracing and shipping fee waivers.",
      rule: "Trigger Tier-2 agent handoff if customer contacts support more than once regarding identical tracking number."
    },
    {
      title: "Fraud & Unauthorized Transaction Protocol",
      category: "Trust & Safety",
      summary: "Any claim containing unauthorized charge allegations, stolen payment cards, or identity disputes triggers immediate safety hold.",
      rule: "Immediately freeze order fulfillment and transfer conversation package to Senior Fraud Investigation unit."
    },
    {
      title: "Empathetic Response Strategy Matrix",
      category: "PRD AI Engine",
      summary: "Negative: Acknowledge & reflect frustration before taking action. Neutral: Inform with transparent steps. Positive: Affirm and delight.",
      rule: "Tone must remain respectful, professional, and devoid of generic robotic deflections."
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-card border border-border p-5 shadow-subtle">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-4 h-4 text-primary" />
          <h3 className="text-base font-semibold text-ink">Retail Policy & AI Knowledge Base</h3>
        </div>
        <p className="text-xs text-ink-secondary">
          Guardrail policies and empathetic conversational guidelines ingested by EmpathIQ AI.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          {policies.map((p, idx) => (
            <div key={idx} className="p-4 bg-background rounded-xl border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-primary-subtle text-primary-dark border border-primary/20">
                  {p.category}
                </span>
                <FileCheck className="w-3.5 h-3.5 text-ink-secondary" />
              </div>

              <h4 className="text-sm font-semibold text-ink">{p.title}</h4>
              <p className="text-xs text-ink-secondary leading-relaxed">{p.summary}</p>
              
              <div className="pt-2 border-t border-border/80">
                <span className="text-[11px] font-semibold text-ink block">AI Guardrail Rule:</span>
                <p className="text-[11px] text-ink-secondary italic mt-0.5">"{p.rule}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
