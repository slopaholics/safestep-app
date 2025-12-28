import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  ChevronRight,
  Eye,
  EyeOff,
  Check,
  Loader2,
  Star,
  Users,
  Heart,
  Lock
} from 'lucide-react';

// Premium Login Page - Nike/Adidas Quality Design
const PremiumLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email');
      return;
    }
    setError('');
    setIsLoading(true);

    // Simulate auth - redirect to onboarding for new users
    await new Promise(resolve => setTimeout(resolve, 1500));
    navigate('/onboarding');
  };

  const handleSSOLogin = async (provider: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    navigate('/onboarding');
  };

  // Staggered animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Ambient Glow Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Left Panel - Hero Section (Hidden on mobile) */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden"
      >
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?w=1200&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">SafeStep</span>
          </motion.div>

          {/* Hero Text */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <h1 className="text-5xl xl:text-6xl font-extrabold text-white leading-tight tracking-tight">
                Protection<br />
                <span className="bg-gradient-to-r from-primary via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Never Stops.
                </span>
              </h1>
              <p className="mt-6 text-xl text-slate-300 max-w-md leading-relaxed">
                Advanced wearable monitoring for the ones who matter most.
                Real-time insights. Peace of mind.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex gap-8"
            >
              {[
                { value: '50K+', label: 'Active Users', icon: Users },
                { value: '99.9%', label: 'Uptime', icon: Shield },
                { value: '4.9', label: 'App Rating', icon: Star },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-start gap-4">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face"
                alt="Sarah M."
                className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/50"
              />
              <div>
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  "SafeStep gives me peace of mind knowing my mother is safe.
                  The real-time alerts have been a lifesaver."
                </p>
                <p className="text-white font-semibold mt-2">Sarah M.</p>
                <p className="text-slate-400 text-sm">Caring for her mother, 78</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-gradient-to-b from-white to-slate-50 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <motion.div variants={itemVariants} className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">SafeStep</span>
          </motion.div>

          {/* Welcome Text */}
          <motion.div variants={itemVariants} className="text-center lg:text-left mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-slate-500">
              Sign in to continue monitoring your loved ones
            </p>
          </motion.div>

          {/* SSO Buttons */}
          <motion.div variants={itemVariants} className="space-y-3 mb-6">
            {[
              { name: 'Google', icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )},
              { name: 'Apple', icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.96.95-2.44 1.78-3.99 1.72-1.58-.05-2.58-.58-3.56-.58-.99 0-2.11.59-3.51.58-1.55-.02-3.13-.91-4.09-1.85-2-1.96-2.31-5.06-.94-7.22.68-1.08 1.83-1.74 3.04-1.74 1.25 0 2.22.63 3.11.63.87 0 2.05-.63 3.19-.63 1.15 0 2.21.57 2.88 1.44-2.33 1.34-1.93 4.67.43 5.64-.47 1.19-1.07 2.45-1.56 3.01zM12.03 5.07c.05-2.12 1.82-3.9 3.86-3.83.25 2.15-1.75 4.07-3.86 3.83z"/>
                </svg>
              )},
            ].map((provider) => (
              <motion.button
                key={provider.name}
                onClick={() => handleSSOLogin(provider.name.toLowerCase())}
                disabled={isLoading}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-slate-200 rounded-2xl font-semibold text-slate-700 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-200 disabled:opacity-50"
              >
                {provider.icon}
                Continue with {provider.name}
              </motion.button>
            ))}
          </motion.div>

          {/* Divider */}
          <motion.div variants={itemVariants} className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-gradient-to-b from-white to-slate-50 text-sm text-slate-400 font-medium">
                or continue with email
              </span>
            </div>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="name@example.com"
                  className={`w-full px-4 py-4 bg-white border-2 rounded-2xl text-slate-900 placeholder-slate-400 transition-all duration-200 outline-none ${
                    focusedField === 'email'
                      ? 'border-primary shadow-lg shadow-primary/10'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                />
                <AnimatePresence>
                  {email && email.includes('@') && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      <Check className="w-5 h-5 text-emerald-500" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants}>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <button type="button" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-4 bg-white border-2 rounded-2xl text-slate-900 placeholder-slate-400 transition-all duration-200 outline-none pr-12 ${
                    focusedField === 'password'
                      ? 'border-primary shadow-lg shadow-primary/10'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-sm font-medium"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-primary via-blue-600 to-primary bg-[length:200%_100%] text-white font-bold text-lg rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Sign in
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Sign Up Link */}
          <motion.p variants={itemVariants} className="text-center mt-8 text-slate-600">
            Don't have an account?{' '}
            <button className="font-bold text-primary hover:text-primary/80 transition-colors">
              Start free trial
            </button>
          </motion.p>

          {/* Trust Badges */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-6 mt-8 pt-8 border-t border-slate-200"
          >
            {[
              { icon: Lock, text: 'Secure' },
              { icon: Shield, text: 'HIPAA' },
              { icon: Heart, text: 'Trusted' },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-400">
                <badge.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{badge.text}</span>
              </div>
            ))}
          </motion.div>

          {/* Footer */}
          <motion.p variants={itemVariants} className="text-center mt-6 text-xs text-slate-400">
            By signing in, you agree to our{' '}
            <a href="#" className="text-primary hover:underline">Terms</a>
            {' '}and{' '}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default PremiumLoginPage;
