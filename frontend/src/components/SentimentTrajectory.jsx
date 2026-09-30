import React from 'react';
import { Activity } from 'lucide-react';

export default function SentimentTrajectory({ trajectory = [] }) {
  if (!trajectory || trajectory.length === 0) {
    return (
      <div className="bg-surface rounded-card border border-border p-4 shadow-subtle text-xs text-ink-secondary">
        No trajectory data yet.
      </div>
    );
  }

  // SVG dimensions
  const width = 280;
  const height = 90;
  const paddingX = 24;
  const paddingY = 16;

  // Map scores (-1.0 to 1.0) to SVG coordinates (height - paddingY down to paddingY)
  // score = 1.0 -> y = paddingY (top)
  // score = 0.0 -> y = height / 2 (middle)
  // score = -1.0 -> y = height - paddingY (bottom)
  const getY = (score) => {
    const clamped = Math.max(-1, Math.min(1, score));
    // Invert because SVG y increases downwards
    const normalized = (1 - clamped) / 2; // 0 (top) to 1 (bottom)
    return paddingY + normalized * (height - 2 * paddingY);
  };

  const getX = (index) => {
    if (trajectory.length <= 1) return width / 2;
    return paddingX + (index / (trajectory.length - 1)) * (width - 2 * paddingX);
  };

  // Generate SVG path string
  const points = trajectory.map((t, idx) => ({
    x: getX(idx),
    y: getY(t.score),
    data: t
  }));

  const pathD = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const isTrendingDown =
    trajectory.length > 1 &&
    trajectory[trajectory.length - 1].score < trajectory[0].score;

  const lineColor = isTrendingDown ? '#B65F5F' : '#5F8A70';

  return (
    <div className="bg-surface rounded-card border border-border p-4 shadow-subtle">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-secondary">
            Sentiment Trajectory
          </h3>
        </div>
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${isTrendingDown
            ? 'bg-danger-light text-danger border-danger-border'
            : 'bg-success-light text-success border-success-border'
          }`}>
          {isTrendingDown ? 'Drifting Downward' : 'Stable / Improving'}
        </span>
      </div>

      {/* SVG Line Graph */}
      <div className="bg-background rounded-lg border border-border p-2 my-2">
        <div className="relative w-full h-[95px] flex items-center justify-center">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            {/* Guide lines: Neutral 0.0 line */}
            <line
              x1={paddingX}
              y1={height / 2}
              x2={width - paddingX}
              y2={height / 2}
              stroke="#E6E0D8"
              strokeDasharray="3 3"
              strokeWidth="1"
            />

            {/* Labels for Pos / Neu / Neg */}
            <text x={4} y={paddingY + 3} fill="#9E988E" fontSize="9" fontFamily="sans-serif">
              +
            </text>
            <text x={4} y={height / 2 + 3} fill="#9E988E" fontSize="9" fontFamily="sans-serif">
              0
            </text>
            <text x={4} y={height - paddingY + 3} fill="#9E988E" fontSize="9" fontFamily="sans-serif">
              -
            </text>

            {/* Trajectory Path Line */}
            <path
              d={pathD}
              fill="none"
              stroke={lineColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Dots with sentiment color */}
            {points.map((pt, idx) => {
              const dotColor =
                pt.data.score > 0.2
                  ? '#5F8A70'
                  : pt.data.score < -0.2
                    ? '#B65F5F'
                    : '#66839A';

              return (
                <g key={idx}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4.5"
                    fill="#FFFFFF"
                    stroke={dotColor}
                    strokeWidth="2.5"
                  />
                  <text
                    x={pt.x}
                    y={height - 2}
                    textAnchor="middle"
                    fill="#716C64"
                    fontSize="9"
                    fontWeight="500"
                  >
                    {pt.data.label || `T${idx + 1}`}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Trajectory Breakdown List */}
      <div className="space-y-1.5 pt-1">
        {trajectory.map((t, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs py-0.5 border-b border-border/40 last:border-0">
            <span className="text-ink-secondary font-medium text-[11px]">{t.turn}</span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${t.sentiment.toLowerCase().includes('negative')
                ? 'text-danger bg-danger-light'
                : t.sentiment.toLowerCase().includes('positive')
                  ? 'text-success bg-success-light'
                  : 'text-info bg-info-light'
              }`}>
              {t.sentiment}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
