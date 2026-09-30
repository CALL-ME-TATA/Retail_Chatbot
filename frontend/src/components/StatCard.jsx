import React from 'react';

export default function StatCard({ label, value, subtext, icon: Icon, badgeColor = 'neutral', trend }) {
  const badgeClasses = {
    neutral: 'bg-primary-subtle text-primary-dark border-border',
    danger: 'bg-danger-light text-danger border-danger-border',
    warning: 'bg-warning-light text-warning border-warning-border',
    success: 'bg-success-light text-success border-success-border',
  };

  return (
    <div className="bg-surface rounded-card border border-border p-4 shadow-subtle flex items-center justify-between transition-smooth hover:border-border-dark">
      <div>
        <p className="text-xs font-medium text-ink-secondary">{label}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl font-semibold text-ink tracking-tight">{value}</span>
          {trend && (
            <span className="text-[11px] font-medium text-ink-secondary">
              {trend}
            </span>
          )}
        </div>
        {subtext && (
          <p className="text-[11px] text-ink-secondary mt-1">{subtext}</p>
        )}
      </div>
      {Icon && (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${badgeClasses[badgeColor] || badgeClasses.neutral}`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}
