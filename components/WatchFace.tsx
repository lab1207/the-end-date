
import React, { useMemo } from 'react';
import { arc } from 'd3';
import { TimeRemaining, DateConfig } from '../types';
import { getRingPercentages } from '../utils/timeCalculations';

interface WatchFaceProps {
  remaining: TimeRemaining;
  config: DateConfig;
}

const WatchFace: React.FC<WatchFaceProps> = ({ remaining, config }) => {
  const size = 420;
  const center = size / 2;
  const ringWidth = 24; 
  const gap = 12;

  const percentages = useMemo(() => getRingPercentages(remaining), [remaining]);

  // Outer Rings: A=Year, B=Days, C=Hours
  const outerRings = [
    { id: 'A', value: percentages.years, color: '#F43F5E', label: 'YEARS ', count: remaining.years },
    { id: 'B', value: percentages.days, color: '#10B981', label: 'DAYS', count: remaining.days },
    { id: 'C', value: percentages.hours, color: '#3B82F6', label: 'HOURS', count: remaining.hours },
  ];

  const outerArcGenerator = arc<any>()
    .innerRadius((d, i) => center - (i + 1) * (ringWidth + gap))
    .outerRadius((d, i) => center - i * (ringWidth + gap) - gap)
    .startAngle(0)
    .endAngle(d => Math.max(0.01, (d.value / 100) * 2 * Math.PI))
    .cornerRadius(12);

  const backgroundArc = arc<any>()
    .innerRadius((d, i) => center - (i + 1) * (ringWidth + gap))
    .outerRadius((d, i) => center - i * (ringWidth + gap) - gap)
    .startAngle(0)
    .endAngle(2 * Math.PI);

  const getTextPath = (i: number) => {
    const r = center - (i * (ringWidth + gap)) - (ringWidth / 2) - gap;
    return `M 0, ${-r} A ${r},${r} 0 1,1 0,${r} A ${r},${r} 0 1,1 0,${-r}`;
  };

  // The "Pancake" Inner Ring (Origin area)
  const pancakeOuterRadius = center - 3 * (ringWidth + gap) - 10; // Area for Minutes (D)
  const pancakeInnerRadius = 15; 

  const pancakeArc = arc<any>()
    .innerRadius(pancakeInnerRadius)
    .outerRadius(pancakeOuterRadius)
    .startAngle(0)
    .endAngle((percentages.minutesInDay / 100) * 2 * Math.PI)
    .cornerRadius(4);

  const pancakeBg = arc<any>()
    .innerRadius(pancakeInnerRadius)
    .outerRadius(pancakeOuterRadius)
    .startAngle(0)
    .endAngle(2 * Math.PI);

  // Central Minute Number (D)
  const minuteCount = remaining.minutesInDay.toString();
  
  // Adjusted scaling to ensure "1440" fits comfortably
  const getFontSize = (text: string) => {
    const len = text.length;
    if (len >= 4) return 60; // For 1000-1440
    if (len === 3) return 80; // For 100-999
    return 100; // For 0-99
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-lg mx-auto aspect-square">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full drop-shadow-[0_0_60px_rgba(0,0,0,0.9)]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {outerRings.map((ring, i) => (
            <path
              key={`text-path-def-${ring.id}`}
              id={`textPath-${ring.id}`}
              d={getTextPath(i)}
            />
          ))}
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="pancakeGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.75" />
            <stop offset="80%" stopColor="#F59E0B" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0.05" />
          </radialGradient>
        </defs>

        <g transform={`translate(${center}, ${center})`}>
          {/* Background tracks */}
          {outerRings.map((ring, i) => (
            <path
              key={`bg-${ring.id}`}
              d={backgroundArc(null, i) || undefined}
              fill="rgba(255,255,255,0.03)"
            />
          ))}

          {/* Progress Arcs A, B, C */}
          {outerRings.map((ring, i) => (
            <g key={`group-${ring.id}`}>
              <path
                d={outerArcGenerator(ring, i) || undefined}
                fill={ring.color}
                filter="url(#glow)"
                className="transition-all duration-1000 ease-out"
                style={{ opacity: 0.9 }}
              />
              
              <text
                dy={6}
                className="select-none pointer-events-none uppercase font-black tracking-[0.25em]"
                fill="white"
                style={{ fontSize: '10px', textShadow: '0 2px 4px rgba(0,0,0,1)' }}
              >
                <textPath
                  href={`#textPath-${ring.id}`}
                  startOffset="1.5%"
                >
                  {ring.label} • {ring.count}
                </textPath>
              </text>
            </g>
          ))}
          
          {/* Pancake Ring (D) */}
          <path
            d={pancakeBg(null) || undefined}
            fill="rgba(245,158,11,0.05)"
          />
          <path
            d={pancakeArc(null) || undefined}
            fill="url(#pancakeGradient)"
            filter="url(#glow)"
            className="transition-all duration-700 ease-in-out"
          />
          
          {/* Edge line for pancake */}
          <circle 
            r={pancakeOuterRadius} 
            fill="none" 
            stroke="rgba(245,158,11,0.2)" 
            strokeWidth="1"
          />

          {/* Minute Display (D) - Scaled within SVG */}
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            className="mono font-black select-none pointer-events-none"
            style={{ 
              fontSize: `${getFontSize(minuteCount)}px`, 
              letterSpacing: '-0.04em',
              filter: 'drop-shadow(0 0 10px rgba(245,158,11,0.5))'
            }}
            dy="-6"
          >
            {minuteCount}
          </text>
          
          <text
            textAnchor="middle"
            fill="#F59E0B"
            className="font-black select-none pointer-events-none"
            style={{ 
              fontSize: '11px', 
              letterSpacing: '0.5em',
              textTransform: 'uppercase',
              opacity: 0.8
            }}
            y="42"
          >
            MINUTES
          </text>

          {/* Pulsing indicator */}
          <circle
            cx="0"
            cy="62"
            r="2"
            fill="#F59E0B"
            className="animate-ping"
          />
        </g>
      </svg>
    </div>
  );
};

export default WatchFace;
