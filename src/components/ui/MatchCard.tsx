import React from 'react';
import { Sparkles, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import type { AiMatch } from '../../types';
import { Badge } from './Badge';
import { Button } from './Button';

export interface MatchCardProps {
  match: AiMatch;
  onViewDetails?: (match: AiMatch) => void;
  onRequestClaim?: (match: AiMatch) => void;
  className?: string;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  onViewDetails,
  onRequestClaim,
  className = '',
}) => {
  const getConfidenceBadge = (confidence: AiMatch['matchConfidence']) => {
    switch (confidence) {
      case 'very_high':
        return (
          <Badge variant="success" size="sm" dot>
            Very High Confidence
          </Badge>
        );
      case 'high':
        return (
          <Badge variant="matched" size="sm" dot>
            High Confidence
          </Badge>
        );
      default:
        return (
          <Badge variant="pending" size="sm" dot>
            Moderate Match
          </Badge>
        );
    }
  };

  return (
    <div
      className={`relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 dark:hover:shadow-black/50 transition-all duration-200 text-left ${className}`}
    >
      {/* Top Match Header */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Vision Embedding Match
          </span>
        </div>
        {getConfidenceBadge(match.matchConfidence)}
      </div>

      {/* Visual Comparison Strip */}
      <div className="grid grid-cols-2 gap-3 my-4">
        {/* User Query item */}
        <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
          <img
            src={match.queryImageUrl}
            alt={match.queryItemTitle}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-1.5 left-1.5 bg-slate-950/75 backdrop-blur-xs text-[10px] font-medium text-white px-2 py-0.5 rounded">
            Reported Lost
          </div>
        </div>

        {/* Found Candidate item */}
        <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-100 dark:bg-slate-800 border border-blue-500/30">
          <img
            src={match.matchItem.imageUrl}
            alt={match.matchItem.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-1.5 left-1.5 bg-blue-600/90 text-[10px] font-semibold text-white px-2 py-0.5 rounded backdrop-blur-xs">
            Found on Campus
          </div>
          <div className="absolute top-1.5 right-1.5 bg-emerald-600 text-white font-bold text-xs px-2 py-0.5 rounded-full shadow-md">
            {match.similarityScore}%
          </div>
        </div>
      </div>

      {/* Item Title and Details */}
      <div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
          {match.matchItem.title}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
          {match.matchItem.description}
        </p>
      </div>

      {/* Match Feature breakdown */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span>Match Score</span>
          <span className="text-blue-600 dark:text-blue-400 font-bold">{match.similarityScore}%</span>
        </div>
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-teal-500 rounded-full transition-all duration-500"
            style={{ width: `${match.similarityScore}%` }}
          />
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {match.featureMatches.slice(0, 2).map((feat, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              {feat.name}
            </span>
          ))}
        </div>
      </div>

      {/* Meta info */}
      <div className="mt-3.5 pt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5 truncate max-w-[60%]">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{match.matchItem.location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          <span>{match.matchItem.date}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onViewDetails?.(match)}
        >
          View Comparison
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="flex-1"
          onClick={() => onRequestClaim?.(match)}
        >
          Claim Item
        </Button>
      </div>
    </div>
  );
};
