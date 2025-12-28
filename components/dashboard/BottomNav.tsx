import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Activity, MessageCircle, Settings } from 'lucide-react';

export type TabType = 'home' | 'activity' | 'messages' | 'settings';

interface BadgeConfig {
  home?: number;
  activity?: number;
  messages?: number;
  settings?: number;
}

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  badges?: BadgeConfig;
}

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'messages', label: 'Messages', icon: MessageCircle },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  badges = {},
}) => {
  const triggerHaptic = () => {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleTabChange = (tab: TabType) => {
    if (tab !== activeTab) {
      triggerHaptic();
      onTabChange(tab);
    }
  };

  const formatBadge = (count: number | undefined): string | null => {
    if (!count || count <= 0) return null;
    if (count > 99) return '99+';
    return count.toString();
  };

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0
        bg-white/95 backdrop-blur-lg
        border-t border-slate-100
        shadow-[0_-4px_20px_rgba(0,0,0,0.06)]
        z-50
      "
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom), 8px)',
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around px-2 pt-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          const badgeCount = formatBadge(badges[item.id]);

          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`
                relative flex flex-col items-center justify-center
                flex-1 py-2 px-1
                transition-colors duration-200
                focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset
                rounded-lg
                ${isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}
              `}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active indicator pill */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute -top-0.5 w-8 h-1 bg-primary rounded-full"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 35,
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Icon container with badge */}
              <div className="relative">
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    y: isActive ? -2 : 0,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 25,
                  }}
                >
                  <IconComponent
                    className={`
                      w-6 h-6
                      transition-all duration-200
                      ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.75px]'}
                    `}
                  />
                </motion.div>

                {/* Badge */}
                <AnimatePresence>
                  {badgeCount && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 25,
                      }}
                      className="
                        absolute -top-1.5 -right-2
                        min-w-[18px] h-[18px]
                        flex items-center justify-center
                        px-1
                        text-[10px] font-bold text-white
                        bg-rose-500
                        rounded-full
                        shadow-sm
                        border-2 border-white
                      "
                    >
                      {badgeCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Label */}
              <motion.span
                className={`
                  mt-1 text-[11px] font-semibold
                  transition-colors duration-200
                  ${isActive ? 'text-primary' : 'text-slate-400'}
                `}
                animate={{
                  fontWeight: isActive ? 700 : 600,
                }}
              >
                {item.label}
              </motion.span>

              {/* Active glow effect */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-primary/5 rounded-xl -z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
