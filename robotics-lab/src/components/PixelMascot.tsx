import { ReactNode } from 'react';

export type MascotMood = 'idle' | 'happy' | 'excited' | 'warning' | 'thinking';

interface PixelMascotProps {
  mood?: MascotMood;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_MAP = {
  sm: 24,
  md: 36,
  lg: 48,
};

/**
 * Minimal Isometric Voxel Emblem ("BITTY") — calm 3-tone architectural geometry.
 */
export function PixelMascot({
  mood = 'idle',
  size = 'md',
  className = '',
}: PixelMascotProps) {
  const px = SIZE_MAP[size];

  const accentColor =
    mood === 'warning'
      ? '#E11D48'
      : mood === 'happy' || mood === 'excited'
        ? '#10B981'
        : '#635BFF';

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 64 64"
      aria-label="로봇 가이드 비티"
      className={`shrink-0 ${className}`}
    >
      {/* Torso Voxel */}
      <polygon points="32,34 46,41 32,48 18,41" fill="#E2E8F0" />
      <polygon points="18,41 32,48 32,53 18,46" fill="#CBD5E1" />
      <polygon points="32,48 46,41 46,46 32,53" fill="#94A3B8" />

      {/* Head Voxel Cube */}
      <polygon points="32,12 50,21 32,30 14,21" fill="#F8FAFC" />
      <polygon points="14,21 32,30 32,44 14,35" fill="#E2E8F0" />
      <polygon points="32,30 50,21 50,35 32,44" fill="#CBD5E1" />

      {/* Visor */}
      <polygon points="17,24.5 29,30.5 29,38.5 17,32.5" fill="#0A2540" />
      <polygon points="19.5,28.5 22,29.8 22,32.5 19.5,31.2" fill={accentColor} />
      <polygon points="24.5,31 27,32.3 27,35 24.5,33.7" fill={accentColor} />

      {/* Minimal Antenna */}
      <rect x="31" y="7" width="2" height="9" fill="#94A3B8" />
      <circle cx="32" cy="6.5" r="2.5" fill={accentColor} />
    </svg>
  );
}

interface MascotSpeechBubbleProps {
  mood?: MascotMood;
  label?: string;
  children: ReactNode;
}

/**
 * Clean Stripe/Linear style editorial callout with hairline left accent (no card box soup).
 */
export function MascotSpeechBubble({
  mood = 'idle',
  label = '쉬운 비유',
  children,
}: MascotSpeechBubbleProps) {
  return (
    <div className="flex items-start gap-3 border-l-2 border-[#635BFF] pl-3.5 py-0.5">
      <PixelMascot mood={mood} size="sm" className="mt-0.5" />
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#635BFF]">
          {label}
        </div>
        <div className="mt-1 text-xs leading-relaxed text-[#425466]">
          {children}
        </div>
      </div>
    </div>
  );
}
