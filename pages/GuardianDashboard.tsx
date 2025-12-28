import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Settings,
  ChevronDown,
  Shield,
  Wifi,
  WifiOff
} from 'lucide-react';

// Import all dashboard components
import ProximityRadar from '../components/dashboard/ProximityRadar';
import AIMoodDetector from '../components/dashboard/AIMoodDetector';
import VitalsPanel, { VitalsData } from '../components/dashboard/VitalsPanel';
import QuickActions from '../components/dashboard/QuickActions';
import BottomNav, { TabType } from '../components/dashboard/BottomNav';
import EmergencySOS from '../components/dashboard/EmergencySOS';
import NotificationToast, { useNotifications } from '../components/dashboard/NotificationToast';

// Mock data for demonstration
const MOCK_VITALS: VitalsData = {
  heartRate: {
    value: 72,
    history: [68, 70, 72, 71, 73, 72, 74, 73, 72, 71, 70, 72, 73, 74, 72, 71, 70, 69, 70, 71, 72, 73, 72, 72],
    status: 'normal'
  },
  steps: {
    value: 3848,
    dailyGoal: 8000,
    history: [500, 800, 1200, 1800, 2200, 2500, 2800, 3000, 3200, 3400, 3500, 3600, 3650, 3700, 3750, 3780, 3800, 3810, 3820, 3830, 3835, 3840, 3845, 3848],
    status: 'normal'
  },
  battery: {
    value: 87,
    isCharging: false,
    history: [100, 98, 96, 95, 94, 93, 92, 91, 90, 90, 89, 89, 88, 88, 88, 87, 87, 87, 87, 87, 87, 87, 87, 87],
    status: 'normal'
  },
  signal: {
    value: 4,
    connectionQuality: 'excellent',
    history: [4, 4, 3, 4, 4, 4, 4, 4, 3, 4, 4, 4, 4, 4, 4, 4, 4, 3, 4, 4, 4, 4, 4, 4],
    status: 'normal'
  }
};

const MONITORED_PERSON = {
  name: 'Martha',
  fullName: 'Martha Stewart',
  emoji: '👵',
  status: 'online' as const,
  distance: 128,
  location: 'Lincoln Elementary',
  mood: {
    current: 'Happy',
    emoji: '😊',
    confidence: 87,
    updatedAt: new Date(Date.now() - 5 * 60000),
    trend: 'stable' as const
  }
};

const GuardianDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const {
    notifications,
    dismissNotification,
    success,
    warning,
    error: showError,
    info
  } = useNotifications();

  // Badge counts for bottom nav
  const badges = {
    activity: 3,
    messages: 2
  };

  const handleQuickAction = useCallback((action: string) => {
    switch (action) {
      case 'call':
        info('Calling...', `Initiating call to ${MONITORED_PERSON.fullName}`);
        break;
      case 'message':
        info('Messages', 'Opening message center...');
        break;
      case 'locate':
        success('Location Found', `${MONITORED_PERSON.fullName} is at ${MONITORED_PERSON.location}`);
        break;
      case 'ring':
        success('Ring Sent', 'Device will ring for 30 seconds');
        break;
    }
  }, [info, success]);

  const handleSOSTriggered = useCallback(() => {
    showError('EMERGENCY ALERT SENT', 'Emergency contacts have been notified. Help is on the way.');
    setShowSOSModal(false);
  }, [showError]);

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'settings') {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pb-24">
      {/* Notifications */}
      <NotificationToast
        notifications={notifications}
        onDismiss={dismissNotification}
        position="top-center"
      />

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-slate-200/50"
      >
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-lg tracking-tight">SafeStep</h1>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500">Monitoring</span>
                <span className="text-xs font-semibold text-primary">{MONITORED_PERSON.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Connection Status */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOnline(!isOnline)}
              className={`p-2 rounded-full ${isOnline ? 'bg-emerald-100' : 'bg-red-100'}`}
            >
              {isOnline ? (
                <Wifi className="w-5 h-5 text-emerald-600" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-600" />
              )}
            </motion.button>

            {/* Notifications */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                3
              </span>
            </motion.button>

            {/* Settings */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Settings className="w-5 h-5 text-slate-600" />
            </motion.button>
          </div>
        </div>

        {/* Last Updated Bar */}
        <div className="px-4 py-1.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
            <span className="text-xs text-slate-500">
              {isOnline ? 'Live' : 'Offline'} • Updated just now
            </span>
          </div>
          <span className="text-xs font-medium text-primary">View History →</span>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="px-4 py-6 space-y-6">
        {/* Profile Card with Proximity Radar */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ProximityRadar
            distance={MONITORED_PERSON.distance}
            location={MONITORED_PERSON.location}
            personName={MONITORED_PERSON.fullName}
            status={MONITORED_PERSON.status}
            avatarEmoji={MONITORED_PERSON.emoji}
          />
        </motion.section>

        {/* AI Mood Detection */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            AI-Detected Mood
          </h2>
          <AIMoodDetector
            mood={MONITORED_PERSON.mood.current}
            emoji={MONITORED_PERSON.mood.emoji}
            confidence={MONITORED_PERSON.mood.confidence}
            updatedAt={MONITORED_PERSON.mood.updatedAt}
            trend={MONITORED_PERSON.mood.trend}
          />
        </motion.section>

        {/* Vitals Panel */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Vitals
          </h2>
          <VitalsPanel vitals={MOCK_VITALS} />
        </motion.section>

        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Quick Actions
          </h2>
          <QuickActions onAction={handleQuickAction} />
        </motion.section>

        {/* Emergency SOS */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="pt-4"
        >
          <EmergencySOS onSOSTriggered={handleSOSTriggered} />
        </motion.section>

        {/* Recent Activity Preview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
        >
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Recent Activity
            </span>
            <button className="text-primary text-xs font-semibold">View All →</button>
          </h2>

          <div className="space-y-3">
            {[
              { time: '8:15 AM', text: 'Arrived at Lincoln Elementary', icon: '📍' },
              { time: '8:00 AM', text: 'Heart rate normal (72 BPM)', icon: '❤️' },
              { time: '7:45 AM', text: 'Device fully charged', icon: '🔋' },
            ].map((activity, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0"
              >
                <span className="text-lg">{activity.icon}</span>
                <div className="flex-1">
                  <p className="text-sm text-slate-700">{activity.text}</p>
                  <p className="text-xs text-slate-400">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        badges={badges}
      />
    </div>
  );
};

export default GuardianDashboard;
