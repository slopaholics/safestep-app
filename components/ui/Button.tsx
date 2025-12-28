
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// Use HTMLMotionProps instead of standard ButtonHTMLAttributes to ensure compatibility with motion.button's overridden event handlers
// Omit children from HTMLMotionProps to avoid type conflict with standard ReactNode
interface ButtonProps extends Omit<HTMLMotionProps<"button">, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  leftIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = "relative flex items-center justify-center px-6 py-3 font-semibold transition-all duration-200 rounded-button disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] text-base md:text-sm active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90 hover:shadow-button-hover shadow-sm",
    secondary: "bg-accent text-white hover:bg-accent/90 hover:shadow-md shadow-sm",
    outline: "bg-transparent border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
  };

  // Fixed: Passed props to motion.button ensuring all framer-motion specific types are respected
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || (disabled as any)}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
      ) : (
        <>
          {leftIcon && <span className="mr-2 flex items-center">{leftIcon}</span>}
          {/* Explicitly defined children in ButtonProps as React.ReactNode to fix type error on line 45 */}
          <span>{children}</span>
        </>
      )}
    </motion.button>
  );
};

export default Button;
