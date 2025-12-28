
import React from 'react';
import LoginCard from '../components/LoginCard';
import { motion } from 'framer-motion';

const LoginPage: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-24 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <main className="w-full flex justify-center relative z-10">
        <LoginCard />
      </main>

      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center text-slate-400 text-xs sm:text-sm px-6 max-w-[420px]"
      >
        <p className="mb-4">
          By continuing, you agree to SafeStep's 
          <a href="#" className="mx-1 text-primary hover:underline font-medium focus:outline-none">Terms of Service</a> 
          and 
          <a href="#" className="mx-1 text-primary hover:underline font-medium focus:outline-none">Privacy Policy</a>.
        </p>
        <p>&copy; {new Date().getFullYear()} SafeStep Guardian & Admin System. All rights reserved.</p>
      </motion.footer>

      {/* Mobile Safe Area Padding */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </div>
  );
};

export default LoginPage;
