
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, User, Activity, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import Button from '../components/ui/Button';

interface FamilyMember {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
  lastActivity: string;
}

const MOCK_FAMILY: FamilyMember[] = [
  { id: '1', name: 'Martha Stewart', status: 'Active', lastActivity: '2 mins ago' },
  { id: '2', name: 'George Harrison', status: 'Inactive', lastActivity: '4 hours ago' },
];

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userEmail = location.state?.email || 'guardian@safestep.com';

  const handleSignOut = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-4 py-3 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-slate-900 tracking-tight hidden sm:inline">SafeStep Guardian</span>
        </div>
        
        <Button 
          variant="ghost" 
          onClick={handleSignOut}
          className="min-h-[40px] px-3 py-1 text-slate-600 font-medium"
          leftIcon={<LogOut className="w-4 h-4" />}
        >
          Sign Out
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold text-slate-900">Welcome back!</h1>
          <p className="text-slate-500 mt-1 font-medium">{userEmail}</p>
        </motion.div>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Your Loved Ones
            </h2>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {MOCK_FAMILY.length} Members
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {MOCK_FAMILY.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-5 rounded-card shadow-soft border border-slate-100 hover:border-primary/30 transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{member.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`w-2 h-2 rounded-full ${member.status === 'Active' ? 'bg-green-500' : 'bg-slate-300'}`} />
                        <span className={`text-xs font-bold uppercase tracking-wider ${member.status === 'Active' ? 'text-green-600' : 'text-slate-500'}`}>
                          {member.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                </div>

                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-slate-500">
                  <div className="flex items-center gap-1.5 text-sm">
                    <Activity className="w-4 h-4 text-primary" />
                    <span>Real-time tracking</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{member.lastActivity}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* System Health Section */}
        <section className="mt-12 bg-slate-900 rounded-card p-6 text-white shadow-lg overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              System Status: All systems normal
            </h3>
            <p className="text-slate-400 text-sm max-w-md">
              Your wearable devices are synced and providing continuous monitoring. No alerts at this time.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
        </section>
      </main>

      {/* Footer safe area */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </div>
  );
};

export default DashboardPage;
