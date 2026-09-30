import React from 'react';
import { Frown, Smile, Meh, AlertTriangle, ShieldAlert, Sparkles } from 'lucide-react';

export default function EmotionCard({ emotion = 'Frustrated' }) {
  const getEmotionDetails = (emo) => {
    const e = (emo || '').toLowerCase();
    if (e.includes('delight') || e.includes('happy') || e.includes('pleased')) {
      return {
        icon: Smile,
        style: 'text-success bg-success-light border-success-border',
        label: emotion || 'Delighted'
      };
    }
    if (e.includes('frustrat') || e.includes('annoy') || e.includes('angry')) {
      return {
        icon: Frown,
        style: 'text-danger bg-danger-light border-danger-border',
        label: emotion || 'Frustrated'
      };
    }
    if (e.includes('alarm') || e.includes('fear') || e.includes('fraud')) {
      return {
        icon: ShieldAlert,
        style: 'text-danger bg-danger-light border-danger-border',
        label: emotion || 'Alarmed'
      };
    }
    if (e.includes('demand') || e.includes('urgent')) {
      return {
        icon: AlertTriangle,
        style: 'text-warning bg-warning-light border-warning-border',
        label: emotion || 'Demanding'
      };
    }
    if (e.includes('conflict')) {
      return {
        icon: Meh,
        style: 'text-warning bg-warning-light border-warning-border',
        label: emotion || 'Conflicted'
      };
    }
    return {
      icon: Meh,
      style: 'text-info bg-info-light border-info-border',
      label: emotion || 'Inquiring'
    };
  };

  const details = getEmotionDetails(emotion);
  const IconComponent = details.icon;

  return (
    <div className="bg-surface rounded-card border border-border p-4 shadow-subtle flex items-center justify-between">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-secondary">
          Detected Emotion
        </h3>
        <p className="text-sm font-semibold text-ink mt-1">
          {details.label}
        </p>
      </div>

      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${details.style}`}>
        <IconComponent className="w-5 h-5" />
      </div>
    </div>
  );
}
