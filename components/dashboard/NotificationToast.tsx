import React, { useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'warning' | 'error' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

interface NotificationToastProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxVisible?: number;
}

interface ToastItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
  index: number;
  total: number;
}

const typeConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    iconColor: 'text-emerald-500',
    titleColor: 'text-emerald-900',
    messageColor: 'text-emerald-700',
    progressColor: 'bg-emerald-500',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    iconColor: 'text-amber-500',
    titleColor: 'text-amber-900',
    messageColor: 'text-amber-700',
    progressColor: 'bg-amber-500',
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconColor: 'text-red-500',
    titleColor: 'text-red-900',
    messageColor: 'text-red-700',
    progressColor: 'bg-red-500',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-500',
    titleColor: 'text-blue-900',
    messageColor: 'text-blue-700',
    progressColor: 'bg-blue-500',
  },
};

const ToastItem: React.FC<ToastItemProps> = ({
  notification,
  onDismiss,
  index,
  total,
}) => {
  const { id, type, title, message, duration = 5000 } = notification;
  const config = typeConfig[type];
  const Icon = config.icon;
  const dismissTimeout = useRef<NodeJS.Timeout | null>(null);
  const isPaused = useRef(false);
  const remainingTime = useRef(duration);
  const startTime = useRef(Date.now());

  // Motion values for swipe gesture
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);
  const scale = useTransform(x, [-200, 0, 200], [0.8, 1, 0.8]);

  // Start auto-dismiss timer
  const startTimer = useCallback(() => {
    if (duration <= 0) return;

    startTime.current = Date.now();
    dismissTimeout.current = setTimeout(() => {
      onDismiss(id);
    }, remainingTime.current);
  }, [duration, id, onDismiss]);

  // Pause timer
  const pauseTimer = useCallback(() => {
    if (dismissTimeout.current) {
      clearTimeout(dismissTimeout.current);
      remainingTime.current -= Date.now() - startTime.current;
      isPaused.current = true;
    }
  }, []);

  // Resume timer
  const resumeTimer = useCallback(() => {
    if (isPaused.current && remainingTime.current > 0) {
      isPaused.current = false;
      startTimer();
    }
  }, [startTimer]);

  useEffect(() => {
    startTimer();
    return () => {
      if (dismissTimeout.current) {
        clearTimeout(dismissTimeout.current);
      }
    };
  }, [startTimer]);

  // Handle drag end
  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 100;
    if (Math.abs(info.offset.x) > threshold) {
      onDismiss(id);
    }
  };

  // Calculate stacked appearance
  const stackOffset = index * 8;
  const stackScale = 1 - index * 0.05;
  const stackOpacity = 1 - index * 0.15;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{
        opacity: stackOpacity,
        y: stackOffset,
        scale: stackScale,
        zIndex: total - index,
      }}
      exit={{
        opacity: 0,
        x: 200,
        scale: 0.8,
        transition: { duration: 0.2 },
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
      onTouchStart={pauseTimer}
      onTouchEnd={resumeTimer}
      style={{ x, opacity, scale, position: index === 0 ? 'relative' : 'absolute', top: 0 }}
      className={`
        w-full max-w-sm cursor-grab active:cursor-grabbing
        ${config.bgColor} ${config.borderColor}
        border rounded-xl shadow-lg
        overflow-hidden
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`flex-shrink-0 ${config.iconColor}`}>
            <Icon className="w-6 h-6" strokeWidth={2} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className={`font-semibold ${config.titleColor}`}>{title}</p>
            {message && (
              <p className={`mt-1 text-sm ${config.messageColor}`}>{message}</p>
            )}
          </div>

          {/* Close button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDismiss(id)}
            className={`
              flex-shrink-0 p-1 rounded-full
              hover:bg-black/5 transition-colors
              focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
              ${config.iconColor}
            `}
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Auto-dismiss progress bar */}
      {duration > 0 && (
        <motion.div
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
          style={{ originX: 0 }}
          className={`h-1 ${config.progressColor}`}
        />
      )}
    </motion.div>
  );
};

const NotificationToast: React.FC<NotificationToastProps> = ({
  notifications,
  onDismiss,
  position = 'top-right',
  maxVisible = 5,
}) => {
  // Position styles
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  // Only show limited number of notifications
  const visibleNotifications = notifications.slice(0, maxVisible);
  const hiddenCount = notifications.length - maxVisible;

  return (
    <div
      className={`
        fixed z-50 pointer-events-none
        ${positionClasses[position]}
      `}
      aria-label="Notifications"
    >
      <div className="relative pointer-events-auto">
        <AnimatePresence mode="popLayout">
          {visibleNotifications.map((notification, index) => (
            <ToastItem
              key={notification.id}
              notification={notification}
              onDismiss={onDismiss}
              index={index}
              total={visibleNotifications.length}
            />
          ))}
        </AnimatePresence>

        {/* Hidden count indicator */}
        <AnimatePresence>
          {hiddenCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="
                mt-2 text-center text-sm text-slate-500
                bg-white/90 backdrop-blur-sm
                px-3 py-1 rounded-full
                shadow-sm border border-slate-200
              "
            >
              +{hiddenCount} more notification{hiddenCount > 1 ? 's' : ''}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Helper hook for managing notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  const addNotification = useCallback(
    (notification: Omit<Notification, 'id'>) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setNotifications((prev) => [{ ...notification, id }, ...prev]);
      return id;
    },
    []
  );

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods for each type
  const success = useCallback(
    (title: string, message?: string, duration?: number) =>
      addNotification({ type: 'success', title, message, duration }),
    [addNotification]
  );

  const warning = useCallback(
    (title: string, message?: string, duration?: number) =>
      addNotification({ type: 'warning', title, message, duration }),
    [addNotification]
  );

  const error = useCallback(
    (title: string, message?: string, duration?: number) =>
      addNotification({ type: 'error', title, message, duration }),
    [addNotification]
  );

  const info = useCallback(
    (title: string, message?: string, duration?: number) =>
      addNotification({ type: 'info', title, message, duration }),
    [addNotification]
  );

  return {
    notifications,
    addNotification,
    dismissNotification,
    clearAll,
    success,
    warning,
    error,
    info,
  };
};

export default NotificationToast;
