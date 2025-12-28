
import React from 'react';
import Button from './ui/Button';

interface SSOButtonsProps {
  onLogin: (provider: 'google' | 'microsoft' | 'apple') => void;
  isLoading?: boolean;
}

const SSOButtons: React.FC<SSOButtonsProps> = ({ onLogin, isLoading }) => {
  return (
    <div className="flex flex-col gap-3 w-full">
      <Button
        variant="outline"
        className="w-full text-slate-700 font-bold border-2"
        onClick={() => onLogin('google')}
        disabled={isLoading}
        aria-label="Sign in with Google"
        leftIcon={
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        }
      >
        Sign in with Google
      </Button>
      <Button
        variant="outline"
        className="w-full text-slate-700 font-bold border-2"
        onClick={() => onLogin('microsoft')}
        disabled={isLoading}
        aria-label="Sign in with Microsoft"
        leftIcon={
          <svg className="w-5 h-5" viewBox="0 0 23 23">
            <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
            <path fill="#f35325" d="M1 1h10v10H1z"/>
            <path fill="#81bc06" d="M12 1h10v10H12z"/>
            <path fill="#05a6f0" d="M1 12h10v10H1z"/>
            <path fill="#ffba08" d="M12 12h10v10H12z"/>
          </svg>
        }
      >
        Sign in with Microsoft
      </Button>
      <Button
        variant="outline"
        className="w-full text-slate-700 font-bold border-2"
        onClick={() => onLogin('apple')}
        disabled={isLoading}
        aria-label="Sign in with Apple"
        leftIcon={
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.96.95-2.44 1.78-3.99 1.72-1.58-.05-2.58-.58-3.56-.58-.99 0-2.11.59-3.51.58-1.55-.02-3.13-.91-4.09-1.85-2-1.96-2.31-5.06-.94-7.22.68-1.08 1.83-1.74 3.04-1.74 1.25 0 2.22.63 3.11.63.87 0 2.05-.63 3.19-.63 1.15 0 2.21.57 2.88 1.44-2.33 1.34-1.93 4.67.43 5.64-.47 1.19-1.07 2.45-1.56 3.01zM12.03 5.07c.05-2.12 1.82-3.9 3.86-3.83.25 2.15-1.75 4.07-3.86 3.83z"/>
          </svg>
        }
      >
        Sign in with Apple
      </Button>
    </div>
  );
};

export default SSOButtons;
