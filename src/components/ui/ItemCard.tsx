import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import type { CampusItem } from '../../types';
import { Badge } from './Badge';
import { Button } from './Button';

export interface ItemCardProps {
  item: CampusItem;
  onViewDetails?: (item: CampusItem) => void;
  onRequestClaim?: (item: CampusItem) => void;
  className?: string;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onViewDetails,
  onRequestClaim,
  className = '',
}) => {
  const navigate = useNavigate();
  const isLost = item.type === 'lost';

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(item);
    } else {
      navigate(`/items/${item.id}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-1 transition-all duration-200 text-left cursor-pointer ${className}`}
    >
      {/* Image container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={item.imageUrl}
          alt={item.name || item.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Status Badge */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <Badge variant={isLost ? 'lost' : 'found'} size="sm" dot>
            {isLost ? 'LOST' : 'FOUND'}
          </Badge>
          {item.aiSimilarity && (
            <Badge variant="matched" size="sm">
              {item.aiSimilarity}% AI Match
            </Badge>
          )}
        </div>

        {/* Category Pill */}
        <div className="absolute bottom-2.5 right-2.5">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-950/75 text-white backdrop-blur-xs">
            {item.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col">
        <div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {item.name || item.title}
          </h4>
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold block mt-0.5">
            {item.category}
          </span>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Location and Relative Date */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{item.relativeDate || `${item.date}`}</span>
          </div>
        </div>

        {/* Actions */}
        <div
          className="mt-4 pt-3 flex items-center justify-between gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleCardClick}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            View Details
          </Button>
          {!isLost && onRequestClaim && (
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => onRequestClaim(item)}
            >
              Claim
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
