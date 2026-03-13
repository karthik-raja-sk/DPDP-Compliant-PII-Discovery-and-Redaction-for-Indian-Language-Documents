import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  icon: Icon,
  loading,
  ...props 
}) => {
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/20',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700',
    outline: 'bg-transparent border border-primary-500/30 text-primary-400 hover:bg-primary-500/10',
    ghost: 'bg-transparent text-slate-400 hover:text-white hover:bg-slate-800',
    danger: 'bg-danger-600 hover:bg-danger-500 text-white',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm font-semibold',
    lg: 'px-8 py-4 text-base font-bold',
  };

  return (
    <button
      className={twMerge(
        'inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : Icon && <Icon className={twMerge('w-4 h-4', size === 'lg' && 'w-5 h-5')} />}
      {children}
    </button>
  );
};

export default React.memo(Button);
