import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Sparkles, Layers, ArrowRight, LayoutDashboard, PlusCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import type { ItemType } from '../../types';

export interface SuccessStateProps {
  type: ItemType;
  itemName: string;
  onReset: () => void;
}

export const SuccessState: React.FC<SuccessStateProps> = ({
  type,
  itemName,
  onReset,
}) => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'success' | 'searching' | 'ready'>('success');

  useEffect(() => {
    // Stage 1 -> Stage 2 ("Searching for matches...")
    const timer1 = setTimeout(() => {
      setPhase('searching');
    }, 1200);

    // Stage 2 -> Stage 3 (Matches ready / view actions)
    const timer2 = setTimeout(() => {
      setPhase('ready');
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const isLost = type === 'lost';

  return (
    <div className="max-w-2xl mx-auto p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-blue-500/5 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Dynamic Animated Status Icon */}
      <div className="relative flex items-center justify-center mx-auto">
        {phase === 'searching' ? (
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-xl shadow-blue-500/30">
              <Layers className="h-8 w-8 animate-spin" />
            </div>
          </div>
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xl shadow-emerald-600/30 animate-in zoom-in-75 duration-300">
            <CheckCircle2 className="h-9 w-9" />
          </div>
        )}
      </div>

      {/* Main Headline & Supporting Text */}
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {isLost
            ? 'Lost item reported successfully!'
            : 'Found item reported successfully!'}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
          {isLost
            ? `Your item "${itemName}" has been added to CampusFind. We'll look for visually similar found items.`
            : `Your found report for "${itemName}" has been added to the campus recovery network.`}
        </p>
      </div>

      {/* Dynamic AI Status Card */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 max-w-md mx-auto text-left flex items-start gap-3">
        <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {phase === 'searching' ? 'AI Search Running...' : 'Neural Vectors Indexed'}
            </span>
            {phase === 'searching' && (
              <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping" />
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {phase === 'searching'
              ? 'Searching for matches across university libraries, labs, and recreation logs...'
              : isLost
              ? 'Found 2 potential visually matching items! Review similarity comparisons.'
              : 'Registered in active campus catalog. Claimant notifications dispatched.'}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        {isLost && (
          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => navigate('/matches')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            View AI Matches
          </Button>
        )}
        <Button
          variant={isLost ? 'outline' : 'primary'}
          size="lg"
          className="w-full sm:w-auto"
          onClick={() => navigate('/dashboard')}
          leftIcon={<LayoutDashboard className="w-4 h-4" />}
        >
          Return to Dashboard
        </Button>
        <Button
          variant="ghost"
          size="lg"
          className="w-full sm:w-auto text-slate-500"
          onClick={onReset}
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          Report Another Item
        </Button>
      </div>
    </div>
  );
};
