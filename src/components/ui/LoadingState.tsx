import React from 'react';
import { Sparkles } from 'lucide-react';

export interface LoadingStateProps {
  message?: string;
  isAiScanning?: boolean;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  isAiScanning = false,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-10 text-center ${className}`}
    >
      {isAiScanning ? (
        <div className="relative mb-4 flex items-center justify-center">
          <div className="absolute h-14 w-14 rounded-full bg-blue-500/20 animate-ping" />
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30">
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>
        </div>
      ) : (
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-3 border-blue-600 border-t-transparent dark:border-blue-400" />
      )}
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
        {message}
      </p>
      {isAiScanning && (
        <p className="text-xs text-slate-400 mt-1 max-w-xs">
          Running multi-modal CLIP visual vector comparisons across active campus logs...
        </p>
      )}
    </div>
  );
};
