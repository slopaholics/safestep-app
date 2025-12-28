
import React, { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = useId();
  const hasValue = props.value || props.defaultValue;

  return (
    <div className="relative w-full mb-6">
      <div className={`relative flex flex-col rounded-button border-2 transition-all duration-200 
        ${error ? 'border-accent bg-accent/[0.02]' : isFocused ? 'border-primary' : 'border-slate-200'}
        ${isFocused ? 'bg-white shadow-sm' : 'bg-slate-50'}
      `}>
        <label 
          htmlFor={inputId}
          className={`absolute left-3 transition-all duration-200 pointer-events-none
            ${(isFocused || hasValue) 
              ? 'top-1.5 text-[10px] uppercase tracking-wider font-bold text-primary' 
              : 'top-1/2 -translate-y-1/2 text-slate-500 text-base'}
            ${error ? 'text-accent' : ''}
          `}
        >
          {label}
        </label>
        <input
          id={inputId}
          {...props}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={`w-full px-3 pb-2 pt-6 bg-transparent outline-none text-slate-800 font-medium leading-tight
            placeholder-transparent focus:placeholder-slate-400 min-h-[48px]
            ${className}`}
          placeholder={label}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
      </div>
      <div aria-live="polite" className="h-5 mt-1.5 px-1">
        <AnimatePresence>
          {error && (
            <motion.div
              id={`${inputId}-error`}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex items-center gap-1.5 text-sm font-semibold text-accent"
              role="alert"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Input;
