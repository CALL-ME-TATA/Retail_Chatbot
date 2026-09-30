import React from 'react';
import { Bot } from 'lucide-react';

export default function AIStatus({ isAnalyzing = false }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border shadow-subtle text-xs font-medium text-ink">
      <span className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isAnalyzing ? 'bg-warning' : 'bg-success'}`}></span>
        <span className={`relative inline-flex rounded-full h-2 w-2 ${isAnalyzing ? 'bg-warning' : 'bg-success'}`}></span>
      </span>
      <span className="text-ink">
        {isAnalyzing ? 'AI Analyzing Sentiment...' : 'AI Assistant Active'}
      </span>
      <Bot className="w-3.5 h-3.5 text-primary ml-0.5" />
    </div>
  );
}
