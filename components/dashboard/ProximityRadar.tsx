import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ProximityStatus = 'close' | 'medium' | 'far';

interface ProximityRadarProps {
  distance: number;
  location: string;
  personName: string;
  status: 'online' | 'offline';
  avatarEmoji: string;
}

const ProximityRadar: React.FC<ProximityRadarProps> = ({
  distance,
  location,
  personName,
  status,
  avatarEmoji,
}) => {
  // Determine proximity status based on distance
  const proximityStatus: ProximityStatus = useMemo(() => {
    if (distance <= 100) return 'close';
    if (distance <= 500) return 'medium';
    return 'far';
  }, [distance]);

  // Status configuration for styling
  const statusConfig = useMemo(() => {
    const configs = {
      close: {
        label: 'Close',
        primaryColor: 'rgb(34, 197, 94)', // green-500
        secondaryColor: 'rgba(34, 197, 94, 0.15)',
        ringColor: 'rgba(34, 197, 94, 0.4)',
        glowColor: 'rgba(34, 197, 94, 0.3)',
        bgGradient: 'from-green-500/10 via-green-500/5 to-transparent',
        textColor: 'text-green-500',
        badgeBg: 'bg-green-500/10',
        badgeBorder: 'border-green-500/30',
      },
      medium: {
        label: 'Medium',
        primaryColor: 'rgb(234, 179, 8)', // yellow-500
        secondaryColor: 'rgba(234, 179, 8, 0.15)',
        ringColor: 'rgba(234, 179, 8, 0.4)',
        glowColor: 'rgba(234, 179, 8, 0.3)',
        bgGradient: 'from-yellow-500/10 via-yellow-500/5 to-transparent',
        textColor: 'text-yellow-500',
        badgeBg: 'bg-yellow-500/10',
        badgeBorder: 'border-yellow-500/30',
      },
      far: {
        label: 'Far',
        primaryColor: 'rgb(59, 130, 246)', // blue-500
        secondaryColor: 'rgba(59, 130, 246, 0.15)',
        ringColor: 'rgba(59, 130, 246, 0.4)',
        glowColor: 'rgba(59, 130, 246, 0.3)',
        bgGradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
        textColor: 'text-blue-500',
        badgeBg: 'bg-blue-500/10',
        badgeBorder: 'border-blue-500/30',
      },
    };
    return configs[proximityStatus];
  }, [proximityStatus]);

  // Format distance for display
  const formattedDistance = useMemo(() => {
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(1)}km`;
    }
    return `${Math.round(distance)}m`;
  }, [distance]);

  // Ring animation configurations with staggered delays for smooth pulsing
  const ringConfigs = [
    { size: 100, delay: 0 },
    { size: 150, delay: 0.5 },
    { size: 200, delay: 1 },
  ];

  return (
    <div className="relative flex flex-col items-center justify-center p-6">
      {/* Outer container with subtle background gradient */}
      <div
        className={`relative w-64 h-64 rounded-full bg-gradient-radial ${statusConfig.bgGradient}`}
        style={{
          background: `radial-gradient(circle, ${statusConfig.secondaryColor} 0%, transparent 70%)`,
        }}
      >
        {/* Animated radar rings */}
        {ringConfigs.map((ring, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full border-2"
            style={{
              width: `${ring.size}%`,
              height: `${ring.size}%`,
              left: `${(100 - ring.size) / 2}%`,
              top: `${(100 - ring.size) / 2}%`,
              borderColor: statusConfig.ringColor,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              scale: [0.95, 1.02, 0.95],
            }}
            transition={{
              duration: 3,
              delay: ring.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Scanning sweep effect */}
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{ opacity: 0.3 }}
        >
          <motion.div
            className="absolute w-1/2 h-full origin-right"
            style={{
              right: '50%',
              background: `linear-gradient(90deg, transparent 0%, ${statusConfig.primaryColor} 100%)`,
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>

        {/* Center glow effect */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '40%',
            height: '40%',
            left: '30%',
            top: '30%',
            background: `radial-gradient(circle, ${statusConfig.glowColor} 0%, transparent 70%)`,
            filter: 'blur(8px)',
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Center avatar container */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          {/* Avatar background with pulsing border */}
          <motion.div
            className="relative w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${statusConfig.secondaryColor}, rgba(255,255,255,0.9))`,
              boxShadow: `0 4px 20px ${statusConfig.glowColor}, 0 0 40px ${statusConfig.glowColor}`,
            }}
            animate={{
              boxShadow: [
                `0 4px 20px ${statusConfig.glowColor}, 0 0 40px ${statusConfig.glowColor}`,
                `0 4px 30px ${statusConfig.glowColor}, 0 0 60px ${statusConfig.glowColor}`,
                `0 4px 20px ${statusConfig.glowColor}, 0 0 40px ${statusConfig.glowColor}`,
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* Inner circle with avatar */}
            <div
              className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg"
              style={{
                border: `3px solid ${statusConfig.primaryColor}`,
              }}
            >
              <span className="text-3xl" role="img" aria-label={personName}>
                {avatarEmoji}
              </span>
            </div>

            {/* Online/Offline indicator */}
            <motion.div
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-white shadow-md flex items-center justify-center"
              style={{
                backgroundColor: status === 'online' ? 'rgb(34, 197, 94)' : 'rgb(156, 163, 175)',
              }}
              animate={status === 'online' ? {
                scale: [1, 1.15, 1],
              } : {}}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <AnimatePresence>
                {status === 'online' && (
                  <motion.div
                    className="w-2 h-2 rounded-full bg-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Particle effects */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: statusConfig.primaryColor,
              left: '50%',
              top: '50%',
            }}
            animate={{
              x: [0, Math.cos(i * 60 * (Math.PI / 180)) * 80],
              y: [0, Math.sin(i * 60 * (Math.PI / 180)) * 80],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              delay: i * 0.5,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Distance display */}
      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          className="text-5xl font-bold text-slate-800 tracking-tight"
          key={formattedDistance}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          {formattedDistance}
        </motion.div>
        <p className="text-slate-500 font-medium mt-1">away from you</p>
      </motion.div>

      {/* Location display */}
      <motion.div
        className="mt-3 flex items-center gap-2 text-slate-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span className="font-medium">{location}</span>
      </motion.div>

      {/* Status badge */}
      <motion.div
        className={`mt-4 px-4 py-2 rounded-full border ${statusConfig.badgeBg} ${statusConfig.badgeBorder}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 25 }}
      >
        <div className="flex items-center gap-2">
          <motion.span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: statusConfig.primaryColor }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [1, 0.7, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <span className={`font-semibold text-sm uppercase tracking-wide ${statusConfig.textColor}`}>
            {statusConfig.label} Range
          </span>
        </div>
      </motion.div>

      {/* Person name */}
      <motion.p
        className="mt-4 text-lg font-bold text-slate-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {personName}
      </motion.p>

      {/* Status subtitle */}
      <motion.p
        className="text-sm text-slate-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        {status === 'online' ? 'Location updating live' : 'Last known location'}
      </motion.p>
    </div>
  );
};

export default ProximityRadar;
