
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import PremiumLoginPage from './pages/PremiumLoginPage';
import DashboardPage from './pages/DashboardPage';
import GuardianDashboard from './pages/GuardianDashboard';
import OnboardingFlow from './pages/OnboardingFlow';
import { AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/login" element={<PremiumLoginPage />} />
            <Route path="/login-simple" element={<LoginPage />} />
            <Route path="/onboarding" element={<OnboardingFlow />} />
            <Route path="/dashboard" element={<GuardianDashboard />} />
            <Route path="/dashboard-old" element={<DashboardPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
};

export default App;
