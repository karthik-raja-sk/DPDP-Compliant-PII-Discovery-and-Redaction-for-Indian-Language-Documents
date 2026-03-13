import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Card = ({ children, className, hover = true, glass = true }) => {
  return (
    <div className={twMerge(
      'rounded-2xl border transition-all duration-300',
      glass ? 'bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-xl' : 'bg-slate-900 border-slate-800',
      hover && 'hover:border-primary-500/50 hover:shadow-primary-500/10 hover:-translate-y-1',
      className
    )}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className }) => (
  <div className={twMerge('p-6 border-b border-white/5', className)}>
    {children}
  </div>
);

const CardContent = ({ children, className }) => (
  <div className={twMerge('p-6', className)}>
    {children}
  </div>
);

const CardFooter = ({ children, className }) => (
  <div className={twMerge('p-6 border-t border-white/5 bg-white/5 rounded-b-2xl', className)}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default React.memo(Card);
