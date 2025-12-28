import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, MapPin, Bell } from 'lucide-react';

export type QuickActionType = 'call' | 'message' | 'locate' | 'ring';

interface QuickActionsProps {
  onAction: (action: QuickActionType) => void;
}

interface ActionButton {
  id: QuickActionType;
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  hoverBg: string;
  hapticPattern: number[];
}

const actionButtons: ActionButton[] = [
  {
    id: 'call',
    label: 'Call',
    icon: Phone,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    hoverBg: 'hover:bg-emerald-100',
    hapticPattern: [50, 30, 50],
  },
  {
    id: 'message',
    label: 'Message',
    icon: MessageCircle,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    hoverBg: 'hover:bg-blue-100',
    hapticPattern: [30, 20, 30],
  },
  {
    id: 'locate',
    label: 'Locate',
    icon: MapPin,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    hoverBg: 'hover:bg-amber-100',
    hapticPattern: [100],
  },
  {
    id: 'ring',
    label: 'Ring',
    icon: Bell,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    hoverBg: 'hover:bg-rose-100',
    hapticPattern: [50, 50, 50, 50, 50],
  },
];

const QuickActions: React.FC<QuickActionsProps> = ({ onAction }) => {
  const triggerHaptic = (pattern: number[]) => {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  const handleAction = (action: ActionButton) => {
    triggerHaptic(action.hapticPattern);
    onAction(action.id);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-4 gap-3">
        {actionButtons.map((action) => {
          const IconComponent = action.icon;
          return (
            <motion.button
              key={action.id}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                y: -2,
              }}
              whileTap={{
                scale: 0.92,
                y: 0,
              }}
              onClick={() => handleAction(action)}
              className={`
                flex flex-col items-center justify-center
                p-4 rounded-2xl
                ${action.bgColor} ${action.hoverBg}
                border border-transparent
                transition-all duration-200
                focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                shadow-sm hover:shadow-md
                active:shadow-inner
                cursor-pointer
              `}
              aria-label={action.label}
            >
              <motion.div
                className={`
                  w-12 h-12 rounded-xl
                  flex items-center justify-center
                  ${action.bgColor}
                  mb-2
                `}
                whileTap={{
                  rotate: [0, -10, 10, -10, 0],
                  transition: { duration: 0.4 },
                }}
              >
                <IconComponent
                  className={`w-6 h-6 ${action.color}`}
                  strokeWidth={2.25}
                />
              </motion.div>
              <span className={`text-sm font-semibold ${action.color}`}>
                {action.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default QuickActions;
