import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Heart,
  MapPin,
  Bell,
  Smartphone,
  ChevronRight,
  ChevronLeft,
  Check,
  Activity,
  Users,
  Lock,
  Wifi,
} from 'lucide-react';

interface OnboardingStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  illustration: React.ReactNode;
  features: string[];
  gradient: string;
  accentColor: string;
}

// Professional SVG illustrations for each step
const illustrations = {
  welcome: (
    <svg viewBox="0 0 280 200" fill="none" className="w-full h-full">
      {/* Abstract protection shield with person silhouette */}
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Background glow */}
      <ellipse cx="140" cy="100" rx="100" ry="80" fill="url(#glowGrad)" />
      {/* Shield */}
      <path
        d="M140 20C140 20 180 30 200 40C200 90 200 120 140 170C80 120 80 90 80 40C100 30 140 20 140 20Z"
        fill="url(#shieldGrad)"
        opacity="0.9"
      />
      {/* Inner shield glow */}
      <path
        d="M140 35C140 35 170 43 185 50C185 90 185 115 140 155C95 115 95 90 95 50C110 43 140 35 140 35Z"
        fill="white"
        opacity="0.2"
      />
      {/* Person silhouette */}
      <circle cx="140" cy="70" r="18" fill="white" opacity="0.9" />
      <path
        d="M115 120C115 100 125 90 140 90C155 90 165 100 165 120"
        stroke="white"
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      {/* Signal rings */}
      <circle cx="140" cy="95" r="50" stroke="#60A5FA" strokeWidth="1" fill="none" opacity="0.4" />
      <circle cx="140" cy="95" r="65" stroke="#60A5FA" strokeWidth="1" fill="none" opacity="0.3" />
      <circle cx="140" cy="95" r="80" stroke="#60A5FA" strokeWidth="1" fill="none" opacity="0.2" />
    </svg>
  ),
  tracking: (
    <svg viewBox="0 0 280 200" fill="none" className="w-full h-full">
      <defs>
        <linearGradient id="mapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      {/* Map background */}
      <rect x="40" y="30" width="200" height="140" rx="16" fill="#F1F5F9" />
      {/* Grid lines */}
      <line x1="40" y1="70" x2="240" y2="70" stroke="#E2E8F0" strokeWidth="1" />
      <line x1="40" y1="110" x2="240" y2="110" stroke="#E2E8F0" strokeWidth="1" />
      <line x1="100" y1="30" x2="100" y2="170" stroke="#E2E8F0" strokeWidth="1" />
      <line x1="160" y1="30" x2="160" y2="170" stroke="#E2E8F0" strokeWidth="1" />
      {/* Path line */}
      <path
        d="M70 150 Q90 120 120 100 T170 80 T220 60"
        stroke="url(#mapGrad)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="8 4"
      />
      {/* Location pins */}
      <circle cx="70" cy="150" r="8" fill="#10B981" />
      <circle cx="70" cy="150" r="4" fill="white" />
      <circle cx="220" cy="60" r="12" fill="#10B981" />
      <circle cx="220" cy="60" r="6" fill="white" />
      {/* Pulse animation circle */}
      <circle cx="220" cy="60" r="20" stroke="#10B981" strokeWidth="2" fill="none" opacity="0.4" />
      <circle cx="220" cy="60" r="30" stroke="#10B981" strokeWidth="1" fill="none" opacity="0.2" />
    </svg>
  ),
  health: (
    <svg viewBox="0 0 280 200" fill="none" className="w-full h-full">
      <defs>
        <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F43F5E" />
          <stop offset="100%" stopColor="#E11D48" />
        </linearGradient>
      </defs>
      {/* Heart shape */}
      <path
        d="M140 160C140 160 60 110 60 70C60 45 80 30 105 30C125 30 140 50 140 50C140 50 155 30 175 30C200 30 220 45 220 70C220 110 140 160 140 160Z"
        fill="url(#heartGrad)"
      />
      {/* ECG line */}
      <path
        d="M30 100 L90 100 L105 100 L115 60 L125 140 L135 80 L145 120 L155 100 L165 100 L250 100"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Stats boxes */}
      <rect x="50" y="170" width="60" height="25" rx="6" fill="#FEE2E2" />
      <text x="80" y="187" textAnchor="middle" fill="#DC2626" fontSize="12" fontWeight="600">72 BPM</text>
      <rect x="170" y="170" width="60" height="25" rx="6" fill="#DCFCE7" />
      <text x="200" y="187" textAnchor="middle" fill="#16A34A" fontSize="12" fontWeight="600">Normal</text>
    </svg>
  ),
  alerts: (
    <svg viewBox="0 0 280 200" fill="none" className="w-full h-full">
      <defs>
        <linearGradient id="bellGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>
      {/* Bell shape */}
      <path
        d="M140 30C140 30 140 25 140 25C140 20 135 15 130 15C125 15 120 20 120 25C120 25 120 30 120 30"
        stroke="#F59E0B"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M95 130C95 80 110 45 140 45C170 45 185 80 185 130L195 145C195 150 192 155 187 155L93 155C88 155 85 150 85 145L95 130Z"
        fill="url(#bellGrad)"
      />
      <ellipse cx="140" cy="165" rx="15" ry="10" fill="#F59E0B" />
      {/* Notification badge */}
      <circle cx="180" cy="50" r="20" fill="#EF4444" />
      <text x="180" y="56" textAnchor="middle" fill="white" fontSize="16" fontWeight="700">3</text>
      {/* Wave lines */}
      <path d="M60 90C50 90 45 100 45 100" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M60 110C45 110 38 125 38 125" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <path d="M220 90C230 90 235 100 235 100" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M220 110C235 110 242 125 242 125" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
    </svg>
  ),
  ready: (
    <svg viewBox="0 0 280 200" fill="none" className="w-full h-full">
      <defs>
        <linearGradient id="checkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      {/* Success circle */}
      <circle cx="140" cy="90" r="60" fill="url(#checkGrad)" />
      <circle cx="140" cy="90" r="70" stroke="#8B5CF6" strokeWidth="2" fill="none" opacity="0.3" />
      <circle cx="140" cy="90" r="80" stroke="#8B5CF6" strokeWidth="1" fill="none" opacity="0.2" />
      {/* Checkmark */}
      <path
        d="M110 90L130 110L170 70"
        stroke="white"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Sparkles */}
      <circle cx="60" cy="50" r="4" fill="#F59E0B" />
      <circle cx="220" cy="60" r="3" fill="#10B981" />
      <circle cx="50" cy="130" r="3" fill="#3B82F6" />
      <circle cx="230" cy="120" r="4" fill="#F43F5E" />
      <circle cx="100" cy="170" r="2" fill="#8B5CF6" />
      <circle cx="180" cy="165" r="3" fill="#F59E0B" />
    </svg>
  ),
};

const onboardingSteps: OnboardingStep[] = [
  {
    id: 0,
    title: 'Welcome to SafeStep',
    subtitle: 'Peace of mind for families',
    description: 'Monitor your loved ones with confidence using advanced AI-powered health and location tracking.',
    icon: <Shield className="w-6 h-6" />,
    illustration: illustrations.welcome,
    features: ['Real-time monitoring', '24/7 protection', 'HIPAA compliant'],
    gradient: 'from-blue-500 to-blue-600',
    accentColor: 'text-blue-600',
  },
  {
    id: 1,
    title: 'Location Tracking',
    subtitle: 'Always know where they are',
    description: 'Get real-time GPS updates and proximity alerts. Set up safe zones and receive notifications when boundaries are crossed.',
    icon: <MapPin className="w-6 h-6" />,
    illustration: illustrations.tracking,
    features: ['GPS tracking', 'Safe zones', 'Route history'],
    gradient: 'from-emerald-500 to-emerald-600',
    accentColor: 'text-emerald-600',
  },
  {
    id: 2,
    title: 'Health Monitoring',
    subtitle: 'Vitals at a glance',
    description: 'Track heart rate, activity levels, and sleep patterns. Our AI detects anomalies and alerts you to potential concerns.',
    icon: <Heart className="w-6 h-6" />,
    illustration: illustrations.health,
    features: ['Heart rate', 'Activity tracking', 'AI analysis'],
    gradient: 'from-rose-500 to-rose-600',
    accentColor: 'text-rose-600',
  },
  {
    id: 3,
    title: 'Smart Alerts',
    subtitle: 'Stay informed, not overwhelmed',
    description: 'Intelligent notifications that matter. Customize alert preferences and never miss an important update.',
    icon: <Bell className="w-6 h-6" />,
    illustration: illustrations.alerts,
    features: ['Custom alerts', 'Emergency SOS', 'Family sharing'],
    gradient: 'from-amber-500 to-amber-600',
    accentColor: 'text-amber-600',
  },
  {
    id: 4,
    title: 'You\'re All Set',
    subtitle: 'Let\'s get started',
    description: 'Your SafeStep guardian dashboard is ready. Start monitoring your loved ones with confidence.',
    icon: <Check className="w-6 h-6" />,
    illustration: illustrations.ready,
    features: ['Dashboard ready', 'Sync complete', 'Support 24/7'],
    gradient: 'from-violet-500 to-violet-600',
    accentColor: 'text-violet-600',
  },
];

const OnboardingFlow: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);

  const step = onboardingSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === onboardingSteps.length - 1;

  const goToNext = useCallback(() => {
    if (!isLastStep) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    } else {
      navigate('/dashboard');
    }
  }, [isLastStep, navigate]);

  const goToPrev = useCallback(() => {
    if (!isFirstStep) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  }, [isFirstStep]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold && !isFirstStep) {
      goToPrev();
    } else if (info.offset.x < -threshold && !isLastStep) {
      goToNext();
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${step.gradient} flex items-center justify-center`}>
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-800">SafeStep</span>
        </div>
        {!isLastStep && (
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
          >
            Skip
          </button>
        )}
      </header>

      {/* Progress Indicators */}
      <div className="px-6 py-4">
        <div className="flex items-center gap-2">
          {onboardingSteps.map((_, index) => (
            <motion.div
              key={index}
              className={`h-1 rounded-full flex-1 ${
                index <= currentStep ? 'bg-gradient-to-r ' + step.gradient : 'bg-slate-200'
              }`}
              initial={false}
              animate={{
                opacity: index <= currentStep ? 1 : 0.5,
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center">
          Step {currentStep + 1} of {onboardingSteps.length}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden px-6">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="flex-1 flex flex-col"
          >
            {/* Illustration */}
            <div className="h-52 mb-6 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="w-full max-w-xs"
              >
                {step.illustration}
              </motion.div>
            </div>

            {/* Icon Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className={`mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg mb-6`}
            >
              <div className="text-white">{step.icon}</div>
            </motion.div>

            {/* Title & Description */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-center mb-6"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{step.title}</h2>
              <p className={`text-sm font-semibold ${step.accentColor} mb-3`}>{step.subtitle}</p>
              <p className="text-slate-600 leading-relaxed max-w-sm mx-auto">{step.description}</p>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-2 mb-8"
            >
              {step.features.map((feature, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-full"
                >
                  {feature}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="px-6 py-6 pb-8 flex items-center justify-between gap-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={goToPrev}
          disabled={isFirstStep}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all
            ${isFirstStep
              ? 'opacity-0 pointer-events-none'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }
          `}
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          onClick={goToNext}
          className={`
            flex-1 max-w-xs flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white
            bg-gradient-to-r ${step.gradient} shadow-lg transition-all
          `}
          style={{
            boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.3)',
          }}
        >
          {isLastStep ? (
            <>
              Get Started
              <Check className="w-5 h-5" />
            </>
          ) : (
            <>
              Continue
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default OnboardingFlow;
