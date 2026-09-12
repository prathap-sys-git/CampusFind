import React from 'react';

export interface FormSectionProps {
  number: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  number,
  title,
  subtitle,
  children,
  className = '',
}) => {
  return (
    <div
      className={`p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5 transition-all text-left ${className}`}
    >
      <div className="flex items-start gap-3.5 pb-2 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold text-xs shrink-0 mt-0.5">
          {number}
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">{children}</div>
    </div>
  );
};
