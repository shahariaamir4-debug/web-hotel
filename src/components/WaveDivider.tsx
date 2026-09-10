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
  height = 115,
  variant = 'white-to-forest'
}) => {
  const id = gradientId || `figma-wave-${Math.random().toString(36).substring(2, 9)}`;

  // Multi-layered color palettes tailored for high-end Figma vector art aesthetics
  const variantConfig = {
    'dark-to-white': {
      base: '#ffffff',
      layer1: 'rgba(16, 185, 129, 0.20)', // ambient mint mist
      layer2: 'rgba(5, 150, 105, 0.45)', // emerald vector wave
      layer3: 'rgba(255, 255, 255, 0.85)', // translucent ivory crest
      layer4: '#ffffff', // solid foreground white
      crestGlow: '#10b981', // glowing emerald vector stroke
      crestGlow2: '#34d399'
    },
    'white-to-forest': {
      base: '#072d20',
      layer1: 'rgba(16, 185, 129, 0.22)', // emerald ambient
      layer2: 'rgba(10, 60, 42, 0.55)', // deep forest middle
      layer3: 'rgba(6, 40, 28, 0.88)', // dark pine wave
      layer4: '#072d20', // solid luxury forest green
      crestGlow: '#34d399', // mint crest stroke
      crestGlow2: '#6ee7b7'
    },
    'forest-to-white': {
      base: '#ffffff',
      layer1: 'rgba(52, 211, 153, 0.20)', // light mint
      layer2: 'rgba(16, 185, 129, 0.40)', // rich emerald
      layer3: 'rgba(255, 255, 255, 0.85)', // soft white blend
      layer4: '#ffffff', // solid crisp white
      crestGlow: '#059669', // rich forest stroke
      crestGlow2: '#10b981'
    },
    'forest-to-dark': {
      base: '#041912',
      layer1: 'rgba(16, 185, 129, 0.18)',
      layer2: 'rgba(6, 50, 35, 0.50)',
      layer3: 'rgba(3, 25, 17, 0.85)',
      layer4: '#041912',
      crestGlow: '#10b981',
      crestGlow2: '#059669'
    },
    'forest-glow': {
      base: '#022c22',
      layer1: 'rgba(52, 211, 153, 0.25)',
      layer2: 'rgba(16, 185, 129, 0.50)',
      layer3: 'rgba(4, 120, 87, 0.80)',
      layer4: '#022c22',
      crestGlow: '#34d399',
      crestGlow2: '#6ee7b7'
    },
    'ocean-teal': {
      base: '#042f2e',
      layer1: 'rgba(45, 212, 191, 0.25)',
      layer2: 'rgba(20, 184, 166, 0.50)',
      layer3: 'rgba(15, 118, 110, 0.80)',
      layer4: '#042f2e',
      crestGlow: '#2dd4bf',
      crestGlow2: '#5eead4'
    },
    'emerald-gold': {
      base: '#072d20',
      layer1: 'rgba(251, 191, 36, 0.20)',
      layer2: 'rgba(16, 185, 129, 0.50)',
      layer3: 'rgba(7, 45, 32, 0.85)',
      layer4: '#072d20',
      crestGlow: '#fbbf24',
      crestGlow2: '#f59e0b'
    },
    'midnight-gold': {
      base: '#062017',
      layer1: 'rgba(245, 158, 11, 0.20)',
      layer2: 'rgba(41, 37, 36, 0.60)',
      layer3: 'rgba(10, 40, 30, 0.85)',
      layer4: '#062017',
      crestGlow: '#fbbf24',
      crestGlow2: '#f59e0b'
    },
    'custom': {
      base: gradientTo || '#ffffff',
      layer1: 'rgba(16, 185, 129, 0.20)',
      layer2: 'rgba(5, 150, 105, 0.45)',
      layer3: 'rgba(255, 255, 255, 0.85)',
      layer4: gradientTo || '#ffffff',
      crestGlow: glowColor || '#10b981',
      crestGlow2: '#34d399'
    }
  };

  const current = variantConfig[variant] || variantConfig['white-to-forest'];
  const strokeGlow1 = glowColor || current.crestGlow;
  const strokeGlow2 = current.crestGlow2;

  return (
    <div 
      className={`w-full overflow-hidden leading-none select-none relative z-20 pointer-events-none ${
        flip ? 'rotate-180 -mt-1' : '-mb-1'
      } ${className}`}
      style={{ minHeight: `${height}px` }}
    >
      <svg
        viewBox="0 0 1440 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-auto block"
        style={{ height: `${height}px` }}
      >
        <defs>
          {/* Subtle drop shadow filter for vector crest strokes */}
          <filter id={`${id}-crest-glow`} x="-20%" y="-30%" width="140%" height="160%">
            <feDropShadow dx="0" dy="-2" stdDeviation="3" floodColor={strokeGlow1} floodOpacity="0.8" />
          </filter>
        </defs>

        {/* 
          ========================================================================
          LAYER 1: Soft Ambient Background Wave (Farthest depth)
          Gentle rolling undulating curve with multiple harmonic peaks
          ========================================================================
        */}
        <path
          d="M0,120 C180,175 360,65 540,110 C720,155 900,45 1080,105 C1240,160 1350,75 1440,115 L1440,200 L0,200 Z"
          fill={current.layer1}
        />

        {/* 
          ========================================================================
          LAYER 2: Mid-Back Counter-Curving Wave (Figma Vector Style)
          Phase-shifted curve intersecting beautifully with layer 1
          ========================================================================
        */}
        <path
          d="M0,95 C220,35 440,165 680,95 C920,25 1160,150 1440,75 L1440,200 L0,200 Z"
          fill={current.layer2}
        />

        {/* Secondary delicate vector crest line for Layer 2 */}
        <path
          d="M0,95 C220,35 440,165 680,95 C920,25 1160,150 1440,75"
          stroke={strokeGlow2}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="none"
          opacity="0.45"
          fill="none"
        />

        {/* 
          ========================================================================
          LAYER 3: Intermediate Flowing Organic Wave
          Adds richness, depth and rhythm
          ========================================================================
        */}
        <path
          d="M0,75 C160,135 380,30 600,85 C820,140 1040,35 1260,95 C1360,125 1410,65 1440,55 L1440,200 L0,200 Z"
          fill={current.layer3}
        />

        {/* 
          ========================================================================
          LAYER 4: Dominant Foreground Solid Wave
          The main transition boundary with signature Figma bezier curvature
          ========================================================================
        */}
        <path
          d="M0,55 C200,120 420,10 680,70 C940,130 1180,25 1440,50 L1440,200 L0,200 Z"
          fill={fillColor || current.layer4}
        />

        {/* 
          ========================================================================
          LAYER 5: Figma Vector Art Accent Crest Stroke (Crisp glowing crest)
          Traced directly on top of the foreground wave curve
          ========================================================================
        */}
        <path
          d="M0,55 C200,120 420,10 680,70 C940,130 1180,25 1440,50"
          stroke={strokeGlow1}
          strokeWidth="2.5"
          strokeLinecap="round"
          filter={`url(#${id}-crest-glow)`}
          fill="none"
          opacity="0.9"
        />
      </svg>
    </div>
  );
};

