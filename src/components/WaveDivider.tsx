import React from 'react';

interface WaveDividerProps {
  fillColor?: string;
  gradientId?: string;
  gradientFrom?: string;
  gradientTo?: string;
  glowColor?: string;
  flip?: boolean;
  className?: string;
  height?: number;
  variant?: 
    | 'forest-glow' 
    | 'ocean-teal' 
    | 'emerald-gold' 
    | 'midnight-gold'
    | 'dark-to-white'
    | 'white-to-forest'
    | 'forest-to-white'
    | 'forest-to-dark'
    | 'custom';
}

export const WaveDivider: React.FC<WaveDividerProps> = ({
  fillColor,
  gradientId,
  gradientFrom,
  gradientTo,
  glowColor,
  flip = false,
  className = '',
  height = 95,
  variant = 'white-to-forest'
}) => {
  const id = gradientId || `wave-${Math.random().toString(36).substring(2, 9)}`;

  // Presets for vibrant, clearly visible, luxurious gradients & wave crests
  const variantConfig = {
    'dark-to-white': {
      from: '#050a14',
      to: '#ffffff',
      glow: '#10b981', // emerald glow
      accent: '#0e2b20',
      backFill: '#064e3b'
    },
    'white-to-forest': {
      from: '#ffffff',
      to: '#072d20',
      glow: '#059669', // rich emerald crest
      accent: '#10b981',
      backFill: '#d1fae5'
    },
    'forest-to-white': {
      from: '#072d20',
      to: '#ffffff',
      glow: '#34d399', // bright mint crest
      accent: '#064e3b',
      backFill: '#04271c'
    },
    'forest-to-dark': {
      from: '#052419',
      to: '#03150f',
      glow: '#10b981',
      accent: '#064e3b',
      backFill: '#02100b'
    },
    'forest-glow': {
      from: '#064e3b',
      to: '#022c22',
      glow: '#34d399',
      accent: '#10b981',
      backFill: '#047857'
    },
    'ocean-teal': {
      from: '#064e3b',
      to: '#042f2e',
      glow: '#2dd4bf',
      accent: '#14b8a6',
      backFill: '#0f766e'
    },
    'emerald-gold': {
      from: '#064e3b',
      to: '#072d20',
      glow: '#fbbf24',
      accent: '#d97706',
      backFill: '#04271c'
    },
    'midnight-gold': {
      from: '#1c1917',
      to: '#062017',
      glow: '#fbbf24',
      accent: '#f59e0b',
      backFill: '#292524'
    },
    'custom': {
      from: gradientFrom || '#064e3b',
      to: gradientTo || '#022c22',
      glow: glowColor || '#34d399',
      accent: '#10b981',
      backFill: '#047857'
    }
  };

  const current = variantConfig[variant] || variantConfig['white-to-forest'];
  const fromColor = gradientFrom || current.from;
  const toColor = gradientTo || current.to;
  const crestGlow = glowColor || current.glow;

  return (
    <div 
      className={`w-full overflow-hidden leading-none select-none relative z-20 ${flip ? 'rotate-180 -mt-1' : '-mb-1'} ${className}`}
      style={{ minHeight: `${height}px` }}
    >
      <svg
        viewBox="0 0 1440 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-auto block"
        style={{ height: `${height}px` }}
      >
        <defs>
          {/* Main Primary Wave Gradient */}
          <linearGradient id={`${id}-grad`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={fromColor} stopOpacity="1" />
            <stop offset="70%" stopColor={toColor} stopOpacity="1" />
            <stop offset="100%" stopColor={toColor} stopOpacity="1" />
          </linearGradient>

          {/* Secondary Depth Layer Gradient */}
          <linearGradient id={`${id}-back-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={current.backFill} stopOpacity="0.7" />
            <stop offset="100%" stopColor={toColor} stopOpacity="0.4" />
          </linearGradient>

          {/* Tertiary Subtle Ambient Gradient */}
          <linearGradient id={`${id}-ambient-grad`} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={current.accent} stopOpacity="0.35" />
            <stop offset="100%" stopColor={toColor} stopOpacity="0.0" />
          </linearGradient>

          {/* Crest Glow Filter */}
          <filter id={`${id}-crest-glow`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="-2" stdDeviation="4" floodColor={crestGlow} floodOpacity="0.75" />
          </filter>
        </defs>

        {/* 
          Layer 1: Background Atmospheric Under-Wave (Deepest Layer) 
          Adds organic, deep multi-layered oceanic / dune motion
        */}
        <path
          d="M0,80 C240,140 480,20 720,70 C960,120 1200,30 1440,65 L1440,160 L0,160 Z"
          fill={`url(#${id}-ambient-grad)`}
        />

        {/* 
          Layer 2: Mid-tier Soft Ambient Wave 
        */}
        <path
          d="M0,60 C320,130 520,30 840,90 C1160,150 1320,50 1440,85 L1440,160 L0,160 Z"
          fill={`url(#${id}-back-grad)`}
        />

        {/* 
          Layer 3: The Dominant Foreground Curving Wave (Main Transition)
          Ultra smooth, flowing organic curves
        */}
        <path
          d="M0,45 C220,115 460,5 720,65 C980,125 1220,25 1440,55 L1440,160 L0,160 Z"
          fill={fillColor || `url(#${id}-grad)`}
        />

        {/* 
          Layer 4: Vibrant Crest Light Wave (Glow Highlight Line)
          Seamless silky crest line with no dashed pattern
        */}
        <path
          d="M0,45 C220,115 460,5 720,65 C980,125 1220,25 1440,55"
          stroke={crestGlow}
          strokeWidth="2.5"
          strokeLinecap="round"
          filter={`url(#${id}-crest-glow)`}
          fill="none"
          opacity="0.85"
        />
      </svg>
    </div>
  );
};
