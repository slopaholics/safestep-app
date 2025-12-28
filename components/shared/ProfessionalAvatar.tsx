import React from 'react';
import { motion } from 'framer-motion';

interface ProfessionalAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline';
  variant?: 'elderly-woman' | 'elderly-man' | 'adult-woman' | 'adult-man';
  className?: string;
}

// Professional avatar illustration using SVG - no childish emojis
const avatarVariants = {
  'elderly-woman': {
    skinTone: '#E8D4C4',
    hairColor: '#D1D5DB',
    shirtColor: '#818CF8',
    accent: '#C4B5FD',
  },
  'elderly-man': {
    skinTone: '#D4B896',
    hairColor: '#9CA3AF',
    shirtColor: '#60A5FA',
    accent: '#93C5FD',
  },
  'adult-woman': {
    skinTone: '#E8D4C4',
    hairColor: '#78350F',
    shirtColor: '#F472B6',
    accent: '#FBCFE8',
  },
  'adult-man': {
    skinTone: '#D4B896',
    hairColor: '#1C1917',
    shirtColor: '#34D399',
    accent: '#A7F3D0',
  },
};

const sizeClasses = {
  sm: { container: 'w-10 h-10', svg: 40 },
  md: { container: 'w-16 h-16', svg: 64 },
  lg: { container: 'w-20 h-20', svg: 80 },
  xl: { container: 'w-28 h-28', svg: 112 },
};

const ProfessionalAvatar: React.FC<ProfessionalAvatarProps> = ({
  name,
  size = 'md',
  status,
  variant = 'elderly-woman',
  className = '',
}) => {
  const colors = avatarVariants[variant];
  const sizeConfig = sizeClasses[size];

  // Generate initials as fallback
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`relative ${sizeConfig.container} ${className}`}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 shadow-lg"
      >
        <svg
          width={sizeConfig.svg}
          height={sizeConfig.svg}
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Background Circle */}
          <circle cx="60" cy="60" r="60" fill="url(#avatarGradient)" />

          {/* Body/Shoulders */}
          <ellipse
            cx="60"
            cy="115"
            rx="45"
            ry="35"
            fill={colors.shirtColor}
          />

          {/* Neck */}
          <rect
            x="50"
            y="72"
            width="20"
            height="18"
            rx="4"
            fill={colors.skinTone}
          />

          {/* Face */}
          <ellipse
            cx="60"
            cy="50"
            rx="28"
            ry="32"
            fill={colors.skinTone}
          />

          {/* Hair for elderly woman - wavy gray hair */}
          {variant === 'elderly-woman' && (
            <>
              <path
                d="M32 45C32 28 44 16 60 16C76 16 88 28 88 45C88 48 87 50 86 52C78 45 70 42 60 42C50 42 42 45 34 52C33 50 32 48 32 45Z"
                fill={colors.hairColor}
              />
              <ellipse cx="35" cy="48" rx="6" ry="8" fill={colors.hairColor} />
              <ellipse cx="85" cy="48" rx="6" ry="8" fill={colors.hairColor} />
            </>
          )}

          {/* Hair for elderly man - short gray hair */}
          {variant === 'elderly-man' && (
            <path
              d="M35 40C35 26 46 18 60 18C74 18 85 26 85 40C85 42 84 44 83 46C77 42 69 40 60 40C51 40 43 42 37 46C36 44 35 42 35 40Z"
              fill={colors.hairColor}
            />
          )}

          {/* Hair for adult woman - longer dark hair */}
          {variant === 'adult-woman' && (
            <>
              <path
                d="M28 50C28 28 42 14 60 14C78 14 92 28 92 50C92 55 90 58 88 60C82 48 72 40 60 40C48 40 38 48 32 60C30 58 28 55 28 50Z"
                fill={colors.hairColor}
              />
              <ellipse cx="30" cy="55" rx="8" ry="14" fill={colors.hairColor} />
              <ellipse cx="90" cy="55" rx="8" ry="14" fill={colors.hairColor} />
            </>
          )}

          {/* Hair for adult man - short dark hair */}
          {variant === 'adult-man' && (
            <path
              d="M34 38C34 24 45 16 60 16C75 16 86 24 86 38C86 40 85 42 84 44C78 40 70 38 60 38C50 38 42 40 36 44C35 42 34 40 34 38Z"
              fill={colors.hairColor}
            />
          )}

          {/* Eyes */}
          <ellipse cx="48" cy="48" rx="4" ry="5" fill="#374151" />
          <ellipse cx="72" cy="48" rx="4" ry="5" fill="#374151" />
          <circle cx="49" cy="47" r="1.5" fill="white" />
          <circle cx="73" cy="47" r="1.5" fill="white" />

          {/* Eyebrows */}
          <path
            d="M42 40C44 38 48 38 52 40"
            stroke="#6B7280"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M68 40C70 38 74 38 78 40"
            stroke="#6B7280"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Nose */}
          <path
            d="M58 52C58 56 60 60 60 60C60 60 62 56 62 52"
            stroke="#D1B896"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Smile */}
          <path
            d="M50 66C54 70 66 70 70 66"
            stroke="#9CA3AF"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Glasses for elderly variants */}
          {(variant === 'elderly-woman' || variant === 'elderly-man') && (
            <>
              <circle
                cx="48"
                cy="48"
                r="10"
                stroke="#64748B"
                strokeWidth="2"
                fill="none"
              />
              <circle
                cx="72"
                cy="48"
                r="10"
                stroke="#64748B"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M58 48H62"
                stroke="#64748B"
                strokeWidth="2"
              />
              <path
                d="M38 48H30"
                stroke="#64748B"
                strokeWidth="2"
              />
              <path
                d="M82 48H90"
                stroke="#64748B"
                strokeWidth="2"
              />
            </>
          )}

          {/* Collar detail */}
          <path
            d="M45 90C50 95 55 97 60 97C65 97 70 95 75 90"
            stroke={colors.accent}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />

          <defs>
            <linearGradient id="avatarGradient" x1="0" y1="0" x2="120" y2="120">
              <stop offset="0%" stopColor="#F1F5F9" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Status Indicator */}
      {status && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`
            absolute -bottom-0.5 -right-0.5
            rounded-full border-2 border-white shadow-sm
            ${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'}
            ${status === 'online' ? 'bg-emerald-500' : 'bg-slate-400'}
          `}
        >
          {status === 'online' && (
            <motion.div
              className="absolute inset-0 rounded-full bg-emerald-500"
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ProfessionalAvatar;
