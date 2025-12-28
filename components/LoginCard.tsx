
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Home } from 'lucide-react';
import SSOButtons from './SSOButtons';
import Input from './ui/Input';
import Button from './ui/Button';

const LoginCard: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setIsLoading(true);
    
    // Simulate API call for authentication
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Successfully "authenticated"
      navigate('/dashboard', { state: { email } });
    } catch (err) {
      setError('An error occurred during sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSSOLogin = async (provider: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Login with ${provider} triggered`);
      navigate('/dashboard', { state: { email: `${provider}-user@example.com` } });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-[420px] p-6 sm:p-8 bg-surface rounded-card shadow-soft border border-slate-100"
    >
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 ring-4 ring-primary/5">
          <Home className="w-8 h-8 text-primary" strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Sign in to SafeStep
        </h1>
        <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-[280px]">
          Monitor your loved ones with peace of mind and precision.
        </p>
      </div>

      <SSOButtons onLogin={handleSSOLogin} isLoading={isLoading} />

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest">
          <span className="bg-surface px-4 text-slate-400">Or continue with</span>
        </div>
      </div>

      <form onSubmit={handleEmailSubmit} className="space-y-2">
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          autoComplete="email"
          disabled={isLoading}
        />
        <div className="flex flex-col gap-4">
          <Button 
            type="submit" 
            variant="primary" 
            className="w-full"
            isLoading={isLoading}
          >
            Continue
          </Button>
          
          <div className="text-center">
            <a 
              href="#" 
              className="text-sm font-semibold text-primary hover:underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded px-1"
            >
              Forgot password?
            </a>
          </div>
        </div>
      </form>

      <div className="mt-8 text-center">
        <p className="text-slate-600 text-sm">
          New to SafeStep?{' '}
          <a 
            href="#" 
            className="font-bold text-primary hover:underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded px-1"
          >
            Create account
          </a>
        </p>
      </div>

      <div className="mt-8 pt-8 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-400 font-bold flex items-center justify-center gap-1.5 tracking-wide">
          <Shield className="w-3.5 h-3.5" /> POWERED BY SAFESTEP GUARDIAN
        </p>
      </div>
    </motion.div>
  );
};

export default LoginCard;
