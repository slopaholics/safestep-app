import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Clock } from 'lucide-react';

export interface AIMoodDetectorProps {
  mood: string;
  emoji: string;
  confidence: number;
  updatedAt: Date;
  trend: 'improving' | 'stable' | 'declining';
}

// Mood-based gradient configurations
const moodGradients: Record<string, { bg: string; ring: string; accent: string }> = {
  happy: {
    bg: 'from-amber-50 via-orange-50 to-yellow-50',
    ring: 'stroke-amber-400',
    accent: 'text-amber-600',
  },
  sad: {
    bg: 'from-blue-50 via-indigo-50 to-slate-50',
    ring: 'stroke-blue-400',
    accent: 'text-blue-600',
  },
  tired: {
    bg: 'from-purple-50 via-violet-50 to-indigo-50',
    ring: 'stroke-purple-400',
    accent: 'text-purple-600',
  },
  calm: {
    bg: 'from-teal-50 via-cyan-50 to-sky-50',
    ring: 'stroke-teal-400',
    accent: 'text-teal-600',
  },
  anxious: {
    bg: 'from-rose-50 via-pink-50 to-red-50',
    ring: 'stroke-rose-400',
    accent: 'text-rose-600',
  },
  energetic: {
    bg: 'from-lime-50 via-green-50 to-emerald-50',
    ring: 'stroke-lime-500',
    accent: 'text-lime-600',
  },
  neutral: {
    bg: 'from-slate-50 via-gray-50 to-zinc-50',
    ring: 'stroke-slate-400',
    accent: 'text-slate-600',
  },
};

// Get gradient config with fallback
const getGradientConfig = (mood: string) => {
  const normalizedMood = mood.toLowerCase();
  return moodGradients[normalizedMood] || moodGradients.neutral;
};

// Trend configuration
const trendConfig = {
  improving: {
    icon: TrendingUp,
    label: 'Improving',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  stable: {
    icon: Minus,
    label: 'Stable',
    color: 'text-slate-500',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
  },
  declining: {
    icon: TrendingDown,
    label: 'Declining',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
  },
};

// Circular progress ring component
const ConfidenceRing: React.FC<{ confidence: number; strokeColor: string }> = ({
  confidence,
  strokeColor,
}) => {
  const radius = 72;
  const strokeWidth = 6;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (confidence / 100) * circumference;

  return (
    <svg
      width={radius * 2}
      height={radius * 2}
      className="absolute inset-0 -rotate-90 transform"
      style={{ filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.08))' }}
    >
      {/* Background ring */}
      <circle
        stroke="currentColor"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        className="text-slate-200/60"
      />
      {/* Progress ring with gradient effect */}
      <motion.circle
        stroke="currentColor"
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        className={strokeColor}
        style={{
          strokeDasharray: circumference,
        }}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset }}
        transition={{
          duration: 1.2,
          ease: [0.34, 1.56, 0.64, 1], // Custom spring-like easing
          delay: 0.2,
        }}
      />
      {/* Glow effect ring */}
      <motion.circle
        stroke="currentColor"
        fill="transparent"
        strokeWidth={strokeWidth + 4}
        strokeLinecap="round"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        className={`${strokeColor} opacity-20`}
        style={{
          strokeDasharray: circumference,
          filter: 'blur(4px)',
        }}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset }}
        transition={{
          duration: 1.2,
          ease: [0.34, 1.56, 0.64, 1],
          delay: 0.2,
        }}
      />
    </svg>
  );
};

// Format time ago string
const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins === 1) return '1 min ago';
  if (diffMins < 60) return `${diffMins} mins ago`;
  if (diffHours === 1) return '1 hour ago';
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
};

const AIMoodDetector: React.FC<AIMoodDetectorProps> = ({
  mood,
  emoji,
  confidence,
  updatedAt,
  trend,
}) => {
  const gradientConfig = useMemo(() => getGradientConfig(mood), [mood]);
  const trendInfo = trendConfig[trend];
  const TrendIcon = trendInfo.icon;
  const timeAgo = useMemo(() => formatTimeAgo(updatedAt), [updatedAt]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`
        relative overflow-hidden rounded-2xl p-6 sm:p-8
        bg-gradient-to-br ${gradientConfig.bg}
        border border-white/60 shadow-xl shadow-slate-200/50
        backdrop-blur-sm
      `}
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/40 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10">
        {/* Header with AI Badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-2 h-2 rounded-full bg-emerald-500"
            />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              AI Mood Analysis
            </span>
          </div>

          {/* Trend Indicator */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-full
              ${trendInfo.bg} ${trendInfo.border} border
            `}
          >
            <TrendIcon className={`w-3.5 h-3.5 ${trendInfo.color}`} />
            <span className={`text-xs font-semibold ${trendInfo.color}`}>
              {trendInfo.label}
            </span>
          </motion.div>
        </div>

        {/* Main Content - Emoji with Confidence Ring */}
        <div className="flex flex-col items-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <ConfidenceRing
              confidence={confidence}
              strokeColor={gradientConfig.ring}
            />

            {/* Emoji Container */}
            <AnimatePresence mode="wait">
              <motion.div
                key={emoji}
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0, rotate: 180, opacity: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                }}
                className="relative z-10"
              >
                <span
                  className="text-7xl select-none"
                  role="img"
                  aria-label={`Current mood: ${mood}`}
                  style={{
                    filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15))',
                  }}
                >
                  {emoji}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mood Label & Confidence */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-center"
          >
            <AnimatePresence mode="wait">
              <motion.h3
                key={mood}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className={`text-2xl font-bold capitalize ${gradientConfig.accent}`}
              >
                {mood}
              </motion.h3>
            </AnimatePresence>

            <div className="flex items-center justify-center gap-2 mt-2">
              <motion.div
                className="flex items-baseline gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <motion.span
                  key={confidence}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-3xl font-bold text-slate-800"
                >
                  {confidence}
                </motion.span>
                <span className="text-lg font-semibold text-slate-500">%</span>
              </motion.div>
              <span className="text-sm text-slate-400 font-medium">confidence</span>
            </div>
          </motion.div>

          {/* Timestamp */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 flex items-center gap-1.5 text-slate-400"
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Updated {timeAgo}</span>
          </motion.div>
        </div>

        {/* Confidence Bar (Alternative visual) */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-6 pt-6 border-t border-white/50"
          style={{ transformOrigin: 'left' }}
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
            <span>Detection Confidence</span>
            <span className="font-bold text-slate-700">{confidence}%</span>
          </div>
          <div className="h-2 bg-white/60 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{
                duration: 1,
                delay: 0.6,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              className={`h-full rounded-full bg-gradient-to-r from-slate-600 to-slate-800`}
              style={{
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
              }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AIMoodDetector;
