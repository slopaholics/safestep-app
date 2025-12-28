import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform, animate } from 'framer-motion';
import { Heart, Footprints, Battery, Signal, BatteryCharging, Zap } from 'lucide-react';

// Types for vital statistics
export type VitalStatus = 'normal' | 'warning' | 'critical';

export interface VitalData {
  value: number;
  history: number[];
  status: VitalStatus;
}

export interface HeartRateData extends VitalData {
  unit?: 'bpm';
}

export interface StepsData extends VitalData {
  dailyGoal: number;
}

export interface BatteryData extends VitalData {
  isCharging?: boolean;
}

export interface SignalData extends VitalData {
  connectionQuality: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface VitalsData {
  heartRate: HeartRateData;
  steps: StepsData;
  battery: BatteryData;
  signal: SignalData;
}

interface VitalsPanelProps {
  vitals: VitalsData;
  className?: string;
}

// Status color mapping
const statusColors = {
  normal: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-600',
    dot: 'bg-emerald-500',
    glow: 'shadow-emerald-500/20',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-600',
    dot: 'bg-amber-500',
    glow: 'shadow-amber-500/20',
  },
  critical: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-600',
    dot: 'bg-red-500',
    glow: 'shadow-red-500/20',
  },
};

// Sparkline Component
const Sparkline: React.FC<{
  data: number[];
  status: VitalStatus;
  width?: number;
  height?: number;
}> = ({ data, status, width = 80, height = 32 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnimated, setIsAnimated] = useState(false);

  const strokeColors = {
    normal: '#10b981', // emerald-500
    warning: '#f59e0b', // amber-500
    critical: '#ef4444', // red-500
  };

  const gradientColors = {
    normal: ['rgba(16, 185, 129, 0.3)', 'rgba(16, 185, 129, 0)'],
    warning: ['rgba(245, 158, 11, 0.3)', 'rgba(245, 158, 11, 0)'],
    critical: ['rgba(239, 68, 68, 0.3)', 'rgba(239, 68, 68, 0)'],
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Normalize data
    const normalizedData = data.slice(-24);
    const min = Math.min(...normalizedData);
    const max = Math.max(...normalizedData);
    const range = max - min || 1;

    const padding = 2;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const points = normalizedData.map((value, index) => ({
      x: padding + (index / (normalizedData.length - 1)) * chartWidth,
      y: padding + chartHeight - ((value - min) / range) * chartHeight,
    }));

    // Animation
    let animationProgress = isAnimated ? 1 : 0;
    const animationDuration = 800;
    const startTime = Date.now();

    const draw = () => {
      if (!isAnimated) {
        const elapsed = Date.now() - startTime;
        animationProgress = Math.min(elapsed / animationDuration, 1);
        // Easing function
        animationProgress = 1 - Math.pow(1 - animationProgress, 3);
      }

      ctx.clearRect(0, 0, width, height);

      if (points.length < 2) return;

      // Calculate visible points based on animation
      const visibleCount = Math.floor(points.length * animationProgress);
      const visiblePoints = points.slice(0, Math.max(2, visibleCount));

      // Create gradient fill
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, gradientColors[status][0]);
      gradient.addColorStop(1, gradientColors[status][1]);

      // Draw filled area
      ctx.beginPath();
      ctx.moveTo(visiblePoints[0].x, height);
      visiblePoints.forEach((point) => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.lineTo(visiblePoints[visiblePoints.length - 1].x, height);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw line
      ctx.beginPath();
      ctx.moveTo(visiblePoints[0].x, visiblePoints[0].y);

      // Smooth curve using bezier
      for (let i = 1; i < visiblePoints.length; i++) {
        const prev = visiblePoints[i - 1];
        const curr = visiblePoints[i];
        const cpx = (prev.x + curr.x) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, cpx, (prev.y + curr.y) / 2);
      }
      ctx.lineTo(visiblePoints[visiblePoints.length - 1].x, visiblePoints[visiblePoints.length - 1].y);

      ctx.strokeStyle = strokeColors[status];
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Draw end point dot
      if (visiblePoints.length > 0 && animationProgress > 0.9) {
        const lastPoint = visiblePoints[visiblePoints.length - 1];
        ctx.beginPath();
        ctx.arc(lastPoint.x, lastPoint.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = strokeColors[status];
        ctx.fill();
      }

      if (animationProgress < 1) {
        requestAnimationFrame(draw);
      } else {
        setIsAnimated(true);
      }
    };

    draw();
  }, [data, status, width, height, isAnimated]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
      className="opacity-90"
    />
  );
};

// Animated Counter Component
const AnimatedValue: React.FC<{
  value: number;
  duration?: number;
  decimals?: number;
}> = ({ value, duration = 1000, decimals = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const previousValue = useRef(0);

  useEffect(() => {
    const controls = animate(previousValue.current, value, {
      duration: duration / 1000,
      ease: [0.32, 0.72, 0, 1],
      onUpdate: (latest) => {
        setDisplayValue(latest);
      },
      onComplete: () => {
        previousValue.current = value;
      },
    });

    return () => controls.stop();
  }, [value, duration]);

  return <>{displayValue.toFixed(decimals)}</>;
};

// Pulse Animation for Heart Icon
const PulsingHeart: React.FC<{ status: VitalStatus; bpm: number }> = ({ status, bpm }) => {
  // Calculate animation duration based on BPM (60 BPM = 1 second per beat)
  const beatDuration = 60 / bpm;

  return (
    <motion.div
      className="relative"
      animate={{
        scale: [1, 1.15, 1, 1.05, 1],
      }}
      transition={{
        duration: beatDuration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <Heart
        className={`w-6 h-6 ${
          status === 'normal'
            ? 'text-emerald-500'
            : status === 'warning'
            ? 'text-amber-500'
            : 'text-red-500'
        }`}
        fill="currentColor"
      />
      <motion.div
        className={`absolute inset-0 rounded-full ${
          status === 'critical' ? 'bg-red-500' : 'bg-transparent'
        }`}
        animate={{
          opacity: status === 'critical' ? [0.3, 0, 0.3] : 0,
          scale: status === 'critical' ? [1, 1.5, 1] : 1,
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
        }}
      />
    </motion.div>
  );
};

// Signal Bars Component
const SignalBars: React.FC<{ quality: SignalData['connectionQuality']; status: VitalStatus }> = ({
  quality,
  status,
}) => {
  const barCounts = {
    excellent: 4,
    good: 3,
    fair: 2,
    poor: 1,
  };

  const activeBars = barCounts[quality];
  const colors = statusColors[status];

  return (
    <div className="flex items-end gap-0.5 h-6">
      {[1, 2, 3, 4].map((bar) => (
        <motion.div
          key={bar}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: bar * 0.1, duration: 0.3 }}
          className={`w-1.5 rounded-sm origin-bottom ${
            bar <= activeBars ? colors.dot : 'bg-slate-200'
          }`}
          style={{ height: `${bar * 25}%` }}
        />
      ))}
    </div>
  );
};

// Progress Ring for Steps Goal
const StepsProgressRing: React.FC<{
  progress: number;
  status: VitalStatus;
  size?: number;
}> = ({ progress, status, size = 48 }) => {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const springProgress = useSpring(0, {
    stiffness: 100,
    damping: 20,
  });

  const strokeDashoffset = useTransform(
    springProgress,
    [0, 1],
    [circumference, circumference * (1 - Math.min(progress, 1))]
  );

  useEffect(() => {
    springProgress.set(1);
  }, [progress, springProgress]);

  const strokeColors = {
    normal: '#10b981',
    warning: '#f59e0b',
    critical: '#ef4444',
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColors[status]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <Footprints className={`w-5 h-5 ${statusColors[status].text}`} />
      </div>
    </div>
  );
};

// Battery Icon with Level
const BatteryIndicator: React.FC<{
  percentage: number;
  isCharging?: boolean;
  status: VitalStatus;
}> = ({ percentage, isCharging, status }) => {
  const colors = statusColors[status];

  return (
    <div className="relative">
      {isCharging ? (
        <motion.div
          animate={{ opacity: [1, 0.6, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <BatteryCharging className={`w-6 h-6 ${colors.text}`} />
        </motion.div>
      ) : (
        <div className="relative">
          <Battery className={`w-6 h-6 ${colors.text}`} />
          {/* Battery fill level indicator */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: percentage / 100 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`absolute top-[6px] left-[4px] h-[12px] w-[14px] origin-left rounded-sm ${colors.dot}`}
            style={{ opacity: 0.3 }}
          />
        </div>
      )}
      {isCharging && (
        <motion.div
          className="absolute -top-1 -right-1"
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          <Zap className="w-3 h-3 text-amber-500" fill="currentColor" />
        </motion.div>
      )}
    </div>
  );
};

// Individual Vital Card Component
interface VitalCardProps {
  title: string;
  icon: React.ReactNode;
  value: React.ReactNode;
  unit: string;
  history: number[];
  status: VitalStatus;
  statusLabel: string;
  extra?: React.ReactNode;
  index: number;
}

const VitalCard: React.FC<VitalCardProps> = ({
  title,
  icon,
  value,
  unit,
  history,
  status,
  statusLabel,
  extra,
  index,
}) => {
  const colors = statusColors[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.1,
        duration: 0.4,
        ease: [0.32, 0.72, 0, 1],
      }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`
        relative overflow-hidden
        bg-white rounded-card p-4
        border ${colors.border}
        shadow-soft hover:shadow-md
        transition-shadow duration-300
      `}
    >
      {/* Status indicator bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
        className={`absolute top-0 left-0 right-0 h-1 ${colors.dot} origin-left`}
      />

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${colors.bg}`}>{icon}</div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {title}
            </p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-bold text-slate-900">{value}</span>
              <span className="text-sm font-medium text-slate-400">{unit}</span>
            </div>
          </div>
        </div>
        {extra}
      </div>

      {/* Sparkline */}
      <div className="mt-2 mb-3">
        <Sparkline data={history} status={status} width={120} height={36} />
      </div>

      {/* Status badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <motion.span
            animate={{
              scale: status === 'critical' ? [1, 1.3, 1] : 1,
              opacity: status === 'critical' ? [1, 0.7, 1] : 1,
            }}
            transition={{
              duration: 0.8,
              repeat: status === 'critical' ? Infinity : 0,
            }}
            className={`w-2 h-2 rounded-full ${colors.dot}`}
          />
          <span className={`text-xs font-semibold uppercase tracking-wide ${colors.text}`}>
            {statusLabel}
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-medium">24h trend</span>
      </div>
    </motion.div>
  );
};

// Main VitalsPanel Component
const VitalsPanel: React.FC<VitalsPanelProps> = ({ vitals, className = '' }) => {
  const { heartRate, steps, battery, signal } = vitals;

  const getHeartRateStatusLabel = (status: VitalStatus, bpm: number): string => {
    if (status === 'critical') return bpm > 100 ? 'Too High' : 'Too Low';
    if (status === 'warning') return bpm > 90 ? 'Elevated' : 'Low';
    return 'Normal';
  };

  const getStepsStatusLabel = (current: number, goal: number): string => {
    const progress = current / goal;
    if (progress >= 1) return 'Goal Met!';
    if (progress >= 0.75) return 'Almost There';
    if (progress >= 0.5) return 'On Track';
    return 'Keep Moving';
  };

  const getBatteryStatusLabel = (pct: number, charging?: boolean): string => {
    if (charging) return 'Charging';
    if (pct > 50) return 'Good';
    if (pct > 20) return 'Low';
    return 'Critical';
  };

  const getSignalStatusLabel = (quality: SignalData['connectionQuality']): string => {
    const labels = {
      excellent: 'Excellent',
      good: 'Good',
      fair: 'Fair',
      poor: 'Weak',
    };
    return labels[quality];
  };

  const stepsProgress = steps.value / steps.dailyGoal;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800">Vital Statistics</h3>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Live Data
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Heart Rate Card */}
        <VitalCard
          title="Heart Rate"
          icon={<PulsingHeart status={heartRate.status} bpm={heartRate.value} />}
          value={<AnimatedValue value={heartRate.value} />}
          unit="BPM"
          history={heartRate.history}
          status={heartRate.status}
          statusLabel={getHeartRateStatusLabel(heartRate.status, heartRate.value)}
          index={0}
        />

        {/* Steps Card */}
        <VitalCard
          title="Steps"
          icon={<StepsProgressRing progress={stepsProgress} status={steps.status} size={40} />}
          value={<AnimatedValue value={steps.value} />}
          unit={`/ ${steps.dailyGoal.toLocaleString()}`}
          history={steps.history}
          status={steps.status}
          statusLabel={getStepsStatusLabel(steps.value, steps.dailyGoal)}
          extra={
            <div className="text-right">
              <span className={`text-xs font-bold ${statusColors[steps.status].text}`}>
                {Math.round(stepsProgress * 100)}%
              </span>
            </div>
          }
          index={1}
        />

        {/* Battery Card */}
        <VitalCard
          title="Battery"
          icon={
            <BatteryIndicator
              percentage={battery.value}
              isCharging={battery.isCharging}
              status={battery.status}
            />
          }
          value={<AnimatedValue value={battery.value} />}
          unit="%"
          history={battery.history}
          status={battery.status}
          statusLabel={getBatteryStatusLabel(battery.value, battery.isCharging)}
          index={2}
        />

        {/* Signal Card */}
        <VitalCard
          title="Signal"
          icon={<Signal className={`w-6 h-6 ${statusColors[signal.status].text}`} />}
          value={<SignalBars quality={signal.connectionQuality} status={signal.status} />}
          unit={signal.connectionQuality}
          history={signal.history}
          status={signal.status}
          statusLabel={getSignalStatusLabel(signal.connectionQuality)}
          index={3}
        />
      </div>
    </motion.div>
  );
};

export default VitalsPanel;
