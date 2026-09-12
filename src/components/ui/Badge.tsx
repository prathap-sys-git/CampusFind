import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'lost' | 'found' | 'matched' | 'pending' | 'success' | 'neutral';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  const variantClasses = {
    lost: 'bg-rose-500/10 text-rose-700 border border-rose-500/20 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30',
    found: 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30',
    matched: 'bg-blue-500/10 text-blue-700 border border-blue-500/25 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/35',
    pending: 'bg-amber-500/10 text-amber-800 border border-amber-500/25 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30',
    success: 'bg-teal-500/10 text-teal-700 border border-teal-500/25 dark:bg-teal-500/15 dark:text-teal-300 dark:border-teal-500/30',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700',
  };

  const dotClasses = {
    lost: 'bg-rose-500',
    found: 'bg-emerald-500',
    matched: 'bg-blue-500',
    pending: 'bg-amber-500',
    success: 'bg-teal-500',
    neutral: 'bg-slate-400',
  };

  return (
    <span
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full shrink-0 ${dotClasses[variant]}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};
