import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Phone } from 'lucide-react';

interface EmergencySOSProps {
  onSOSTriggered: () => void;
  holdDuration?: number;
  countdownDuration?: number;
  shakeThreshold?: number;
}

const EmergencySOS: React.FC<EmergencySOSProps> = ({
  onSOSTriggered,
  holdDuration = 3000,
  countdownDuration = 5,
  shakeThreshold = 25,
}) => {
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(countdownDuration);
  const [triggerSource, setTriggerSource] = useState<'hold' | 'shake' | null>(null);

  const holdStartTime = useRef<number | null>(null);
  const holdAnimationFrame = useRef<number | null>(null);
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);
  const lastShakeTime = useRef<number>(0);
  const shakeCount = useRef<number>(0);

  // Cleanup function for hold animation
  const cleanupHoldAnimation = useCallback(() => {
    if (holdAnimationFrame.current) {
      cancelAnimationFrame(holdAnimationFrame.current);
      holdAnimationFrame.current = null;
    }
    holdStartTime.current = null;
    setHoldProgress(0);
    setIsHolding(false);
  }, []);

  // Start countdown sequence
  const startCountdown = useCallback((source: 'hold' | 'shake') => {
    setTriggerSource(source);
    setIsCountingDown(true);
    setCountdown(countdownDuration);
    cleanupHoldAnimation();
  }, [countdownDuration, cleanupHoldAnimation]);

  // Cancel the SOS
  const cancelSOS = useCallback(() => {
    setIsCountingDown(false);
    setCountdown(countdownDuration);
    setTriggerSource(null);
    if (countdownInterval.current) {
      clearInterval(countdownInterval.current);
      countdownInterval.current = null;
    }
  }, [countdownDuration]);

  // Handle countdown timer
  useEffect(() => {
    if (isCountingDown) {
      countdownInterval.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (countdownInterval.current) {
              clearInterval(countdownInterval.current);
            }
            setIsCountingDown(false);
            onSOSTriggered();
            return countdownDuration;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (countdownInterval.current) {
          clearInterval(countdownInterval.current);
        }
      };
    }
  }, [isCountingDown, countdownDuration, onSOSTriggered]);

  // Handle hold progress animation
  const updateHoldProgress = useCallback(() => {
    if (holdStartTime.current === null) return;

    const elapsed = Date.now() - holdStartTime.current;
    const progress = Math.min(elapsed / holdDuration, 1);
    setHoldProgress(progress);

    if (progress >= 1) {
      startCountdown('hold');
    } else {
      holdAnimationFrame.current = requestAnimationFrame(updateHoldProgress);
    }
  }, [holdDuration, startCountdown]);

  // Handle mouse/touch down
  const handlePointerDown = useCallback(() => {
    if (isCountingDown) return;

    setIsHolding(true);
    holdStartTime.current = Date.now();
    holdAnimationFrame.current = requestAnimationFrame(updateHoldProgress);
  }, [isCountingDown, updateHoldProgress]);

  // Handle mouse/touch up
  const handlePointerUp = useCallback(() => {
    cleanupHoldAnimation();
  }, [cleanupHoldAnimation]);

  // Handle pointer leave (when user drags away)
  const handlePointerLeave = useCallback(() => {
    if (isHolding) {
      cleanupHoldAnimation();
    }
  }, [isHolding, cleanupHoldAnimation]);

  // Shake detection using devicemotion API
  useEffect(() => {
    const handleMotion = (event: DeviceMotionEvent) => {
      if (isCountingDown) return;

      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration) return;

      const { x, y, z } = acceleration;
      if (x === null || y === null || z === null) return;

      const totalAcceleration = Math.sqrt(x * x + y * y + z * z);
      const now = Date.now();

      // Detect shake if acceleration exceeds threshold
      if (totalAcceleration > shakeThreshold) {
        // Reset shake count if too much time has passed
        if (now - lastShakeTime.current > 500) {
          shakeCount.current = 0;
        }

        // Only count as a shake if enough time has passed since last shake
        if (now - lastShakeTime.current > 100) {
          shakeCount.current += 1;
          lastShakeTime.current = now;

          // Trigger after 3 consecutive shakes
          if (shakeCount.current >= 3) {
            shakeCount.current = 0;
            startCountdown('shake');
          }
        }
      }
    };

    // Request permission for iOS 13+
    if (typeof DeviceMotionEvent !== 'undefined' &&
        typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      // Permission will be requested on first interaction
    }

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [isCountingDown, shakeThreshold, startCountdown]);

  // Request motion permission on first touch (for iOS)
  const requestMotionPermission = async () => {
    if (typeof DeviceMotionEvent !== 'undefined' &&
        typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        if (permission === 'granted') {
          console.log('Motion permission granted');
        }
      } catch (error) {
        console.error('Motion permission denied:', error);
      }
    }
  };

  // Calculate SVG circle properties for progress ring
  const circleRadius = 70;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference * (1 - holdProgress);

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Main SOS Button Container */}
      <div className="relative">
        {/* Outer pulsing ring - only when idle */}
        <AnimatePresence>
          {!isHolding && !isCountingDown && (
            <motion.div
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.5, 0.2, 0.5],
              }}
              exit={{ scale: 1, opacity: 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 rounded-full bg-red-500"
              style={{ transform: 'scale(1.1)' }}
            />
          )}
        </AnimatePresence>

        {/* Progress ring SVG */}
        <svg
          className="absolute inset-0 -rotate-90"
          width="180"
          height="180"
          viewBox="0 0 180 180"
        >
          {/* Background circle */}
          <circle
            cx="90"
            cy="90"
            r={circleRadius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <motion.circle
            cx="90"
            cy="90"
            r={circleRadius}
            fill="none"
            stroke="white"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.05 }}
          />
        </svg>

        {/* SOS Button */}
        <motion.button
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          onPointerCancel={handlePointerUp}
          onClick={requestMotionPermission}
          whileTap={{ scale: 0.95 }}
          className={`
            relative w-[180px] h-[180px] rounded-full
            flex flex-col items-center justify-center
            font-bold text-white select-none touch-none
            transition-colors duration-200
            shadow-[0_8px_32px_rgba(220,38,38,0.4)]
            focus:outline-none focus-visible:ring-4 focus-visible:ring-red-300 focus-visible:ring-offset-2
            ${isHolding ? 'bg-red-700' : 'bg-red-600 hover:bg-red-700'}
          `}
          style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }}
          aria-label="Emergency SOS - Hold for 3 seconds to activate"
        >
          <Phone className="w-10 h-10 mb-2" strokeWidth={2.5} />
          <span className="text-3xl font-black tracking-wider">SOS</span>
          <span className="text-xs font-medium opacity-80 mt-1">
            {isHolding ? 'Keep holding...' : 'Hold to activate'}
          </span>
        </motion.button>
      </div>

      {/* Shake instruction */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 text-sm text-slate-500 text-center max-w-[200px]"
      >
        Or shake your device rapidly to trigger emergency alert
      </motion.p>

      {/* Countdown Overlay */}
      <AnimatePresence>
        {isCountingDown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-red-600/95 backdrop-blur-sm"
          >
            {/* Warning Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="mb-6"
            >
              <AlertTriangle className="w-20 h-20 text-white" strokeWidth={2} />
            </motion.div>

            {/* Countdown number */}
            <motion.div
              key={countdown}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="relative"
            >
              <span className="text-[120px] font-black text-white leading-none">
                {countdown}
              </span>
              {/* Pulsing ring around countdown */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 rounded-full border-4 border-white"
              />
            </motion.div>

            {/* Status text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-xl font-semibold text-white/90 text-center"
            >
              {triggerSource === 'shake'
                ? 'Shake detected!'
                : 'Sending emergency alert...'}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-2 text-white/70 text-center"
            >
              Cancel if triggered by mistake
            </motion.p>

            {/* Cancel Button */}
            <motion.button
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={cancelSOS}
              className="
                mt-8 px-8 py-4 rounded-full
                bg-white text-red-600 font-bold text-lg
                shadow-lg hover:shadow-xl
                flex items-center gap-2
                focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50
                transition-shadow duration-200
              "
            >
              <X className="w-5 h-5" strokeWidth={3} />
              Cancel
            </motion.button>

            {/* Progress bar at bottom */}
            <motion.div
              className="absolute bottom-0 left-0 h-2 bg-white/30"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: countdownDuration, ease: 'linear' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmergencySOS;
