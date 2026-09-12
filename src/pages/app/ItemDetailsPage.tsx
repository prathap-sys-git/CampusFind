import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Tag,
  Shield,
  CheckCircle2,
  Sparkles,
  Camera,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { fetchItemById, mapDbItemToUi } from '../../services/itemService';
import { createClaim } from '../../services/claimService';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { LoadingState } from '../../components/ui/LoadingState';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../context/AuthContext';
import type { CampusItem } from '../../types';

export const ItemDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { supabaseUser } = useAuth();

  const [item, setItem] = useState<CampusItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [claimProof, setClaimProof] = useState('');
  const [isClaimSubmitting, setIsClaimSubmitting] = useState(false);

  // Fetch item from Supabase
  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchItemById(id!);
        if (!cancelled) {
          setItem(data ? (mapDbItemToUi(data) as CampusItem) : null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load item.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id]);

  const isLost = item?.type === 'lost';

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimProof.trim() || !item || !supabaseUser) return;

    setIsClaimSubmitting(true);
    try {
      await createClaim(item.id, supabaseUser.id, claimProof);
      setIsClaimModalOpen(false);
      setClaimProof('');
      toast({
        title: 'Claim Submitted Successfully',
        description: `Your ownership verification for "${item.name}" has been forwarded to campus staff.`,
        type: 'success',
      });
      navigate('/claims');
    } catch (err) {
      toast({
        title: 'Claim Failed',
        description: err instanceof Error ? err.message : 'Failed to submit claim.',
        type: 'error',
      });
    } finally {
      setIsClaimSubmitting(false);
    }
  };

  const handleFoundAction = () => {
    toast({
      title: 'Opening Found Report',
      description: `Pre-filling report form linked to "${item?.name}"…`,
      type: 'info',
    });
    navigate('/report-found');
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (isLoading) {
    return <LoadingState message="Loading item details…" />;
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4 text-left">
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>
            <h4 className="font-bold">Failed to Load Item</h4>
            <p className="text-xs mt-0.5">{error}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate(-1)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Go Back
          </Button>
          <Button variant="primary" onClick={() => window.location.reload()} leftIcon={<RefreshCw className="w-4 h-4" />}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // ── Not Found ────────────────────────────────────────────────────────────────
  if (!item) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4 text-left">
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>
            <h4 className="font-bold">Item Not Found</h4>
            <p className="text-xs mt-0.5">
              The requested campus record ID "#{id}" does not exist or has been archived.
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-left">
      {/* Back Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(isLost ? '/lost-items' : '/found-items')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to {isLost ? 'Lost Items' : 'Found Items'}
        </Button>
        <span className="text-xs text-slate-400 font-mono">Registry #{item.id.slice(0, 8)}</span>
      </div>

      {/* Main Details Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left: Image */}
        <div className="lg:col-span-7 bg-slate-950 relative flex items-center justify-center overflow-hidden min-h-[320px] lg:min-h-[480px]">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover max-h-[520px]"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-slate-600">
              <Camera className="w-12 h-12 opacity-30" />
              <span className="text-sm opacity-50">No image provided</span>
            </div>
          )}

          {/* Status pills */}
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant={isLost ? 'lost' : 'found'} size="md" dot>
              {isLost ? 'LOST ITEM' : 'FOUND ITEM'}
            </Badge>
          </div>

          <div className="absolute bottom-4 left-4">
            <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-slate-950/80 text-white backdrop-blur-md border border-white/15">
              {item.category}
            </span>
          </div>
        </div>

        {/* Right: Info */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 border-t lg:border-t-0 lg:border-l border-slate-200/80 dark:border-slate-800">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {item.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                {item.name}
              </h1>
              {item.brand && (
                <p className="text-xs text-slate-400 mt-0.5">
                  Brand: <span className="font-semibold text-slate-700 dark:text-slate-300">{item.brand}</span>
                </p>
              )}
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Public Description
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Metadata grid */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs">
              <div>
                <span className="text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" /> Location
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block mt-0.5">
                  {item.location}
                </span>
                {item.locationDetails && (
                  <span className="text-slate-500 text-[11px] block mt-0.5">{item.locationDetails}</span>
                )}
              </div>

              <div>
                <span className="text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" /> Date Logged
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block mt-0.5">
                  {item.date}
                </span>
                <span className="text-slate-500 text-[11px] block mt-0.5">
                  {item.relativeDate || 'Recently'}
                </span>
              </div>

              {item.color && (
                <div>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-blue-500" /> Color
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block mt-0.5">
                    {item.color}
                  </span>
                </div>
              )}

              <div>
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-500" /> Intake Time
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block mt-0.5">
                  {item.time || 'Not specified'}
                </span>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
              <Shield className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                <strong>Privacy Shield:</strong> Distinguishing stickers, serial numbers, and private identifying marks are hidden from this public card to prevent fraudulent claims.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
            {isLost ? (
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleFoundAction}
                leftIcon={<Camera className="w-4 h-4" />}
              >
                Report Found / I Found This
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => setIsClaimModalOpen(true)}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Request Claim
              </Button>
            )}

            <Button
              variant="outline"
              size="md"
              className="w-full"
              onClick={() => navigate('/matches')}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Check Visual AI Matches
            </Button>
          </div>
        </div>
      </div>

      {/* Claim Modal */}
      <Modal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        title={`Request Claim: ${item.name}`}
        description="To prevent fraudulent claims, describe a unique identifying mark not shown in the photo."
        maxWidth="md"
      >
        <form onSubmit={handleClaimSubmit} className="space-y-4 text-left">
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Describe stickers, engravings, serial number hints, or lock-screen patterns only you know.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Proof of Ownership *
            </label>
            <textarea
              rows={4}
              value={claimProof}
              onChange={(e) => setClaimProof(e.target.value)}
              placeholder="e.g. My initials 'AC' are laser engraved on the back; the right corner has a scratch from dropped keys..."
              className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm p-4 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
              required
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsClaimModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isClaimSubmitting}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Submit Claim for Review
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
