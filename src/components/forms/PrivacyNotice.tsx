import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

export interface PrivacyNoticeProps {
  className?: string;
  variant?: 'banner' | 'inline';
}

export const PrivacyNotice: React.FC<PrivacyNoticeProps> = ({
  className = '',
  variant = 'banner',
}) => {
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 ${className}`}>
        <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span>Some identifying details are kept private and are used only for ownership verification.</span>
      </div>
    );
  }

  return (
    <div
      className={`p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300 text-left ${className}`}
    >
      <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 shrink-0 mt-0.5">
        <ShieldCheck className="w-4 h-4" />
      </div>
      <div className="space-y-0.5">
        <span className="font-bold text-slate-800 dark:text-slate-200 block">
          Verification Privacy Shield
        </span>
        <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          Some identifying details are kept private and are used only for ownership verification. These will not be visible on public search logs.
        </p>
      </div>
    </div>
  );
};
