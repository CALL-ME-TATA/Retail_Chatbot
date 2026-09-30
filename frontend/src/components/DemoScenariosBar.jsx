import React, { useEffect, useState } from 'react';
import { PlayCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { getScenarios } from '../api';

export default function DemoScenariosBar({ onSelectScenario }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeScenarioId, setActiveScenarioId] = useState(null);
  const [scenarios, setScenarios] = useState([]);

  useEffect(() => {
    getScenarios().then(setScenarios).catch(() => setScenarios([]));
  }, []);

  const handleRun = (scenario) => {
    setActiveScenarioId(scenario.id);
    onSelectScenario(scenario);
  };

  return (
    <div className="bg-surface border border-border rounded-card p-3 shadow-subtle mb-6 transition-smooth">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary-light flex items-center justify-center text-primary-dark">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-ink">Demo Scenarios</h4>
            <p className="text-[11px] text-ink-secondary">
              Each one sends a real message through the backend pipeline ({scenarios.length} loaded)
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-2.5 py-1 text-xs font-medium text-ink-secondary hover:text-ink rounded-md hover:bg-background border border-border flex items-center gap-1 transition-smooth"
        >
          <span>{isExpanded ? 'Hide Scenarios' : `Explore ${scenarios.length} Scenarios`}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          {scenarios.map((sc) => {
            const isCurrent = activeScenarioId === sc.id;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => handleRun(sc)}
                className={`text-left p-2.5 rounded-lg border text-xs transition-smooth ${
                  isCurrent
                    ? 'bg-primary-subtle border-primary text-primary-dark shadow-subtle font-medium'
                    : 'bg-background hover:bg-surface border-border text-ink hover:border-border-dark'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-semibold text-[11px] truncate">{sc.title}</span>
                  <span className={`text-[9px] px-1 py-0.2 rounded border font-semibold ${
                    sc.badgeColor === 'danger'
                      ? 'bg-danger-light text-danger border-danger-border'
                      : sc.badgeColor === 'success'
                      ? 'bg-success-light text-success border-success-border'
                      : sc.badgeColor === 'warning'
                      ? 'bg-warning-light text-warning border-warning-border'
                      : 'bg-info-light text-info border-info-border'
                  }`}>
                    {sc.badge}
                  </span>
                </div>
                <p className="text-[10px] text-ink-secondary line-clamp-2 italic">"{sc.inputPrompt}"</p>
                <div className="flex items-center gap-1 mt-1.5 text-[10px] text-primary font-medium">
                  <PlayCircle className="w-3 h-3" />
                  <span>Run through pipeline</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
