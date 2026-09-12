import React, { useState } from 'react';
import { Sparkles, RefreshCw, Layers, ShieldCheck } from 'lucide-react';
import { MOCK_AI_MATCHES } from '../../data/mockData';
import { MatchCard } from '../../components/ui/MatchCard';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import type { AiMatch } from '../../types';

export const AiMatchesPage: React.FC = () => {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [selectedMatchForDetails, setSelectedMatchForDetails] = useState<AiMatch | null>(null);

  const handleRescan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      toast({
        title: 'Neural Index Refreshed',
        description: 'Compared user items against latest campus circulation logs. 3 matches confirmed.',
        type: 'success',
      });
    }, 900);
  };

  const handleClaim = (match: AiMatch) => {
    toast({
      title: 'Claim Request Submitted',
      description: `Claim for "${match.matchItem.title}" received. Verification team notified at ${match.matchItem.location}.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CLIP Visual Vector Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Matches Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Visual matches detected by comparing your uploaded items with campus lost & found intake logs.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRescan}
          isLoading={isScanning}
          leftIcon={<RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />}
        >
          {isScanning ? 'Scanning Embeddings...' : 'Re-scan Campus Logs'}
        </Button>
      </div>

      {/* AI Scanner Banner */}
      {isScanning ? (
        <div className="p-8 rounded-3xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-center space-y-3 animate-pulse">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white mx-auto">
            <Layers className="w-6 h-6 animate-spin" />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            Comparing 512-dimensional CLIP vectors...
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Calculating cosine similarities between your item photos and recent student reports across all campus zones.
          </p>
        </div>
      ) : (
        /* Matches Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_AI_MATCHES.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onViewDetails={(m) => setSelectedMatchForDetails(m)}
              onRequestClaim={(m) => handleClaim(m)}
            />
          ))}
        </div>
      )}

      {/* Match Comparison Deep Dive Modal */}
      <Modal
        isOpen={!!selectedMatchForDetails}
        onClose={() => setSelectedMatchForDetails(null)}
        title="AI Visual Alignment Breakdown"
        description={`${selectedMatchForDetails?.similarityScore}% Cosine Match Score • ID #${selectedMatchForDetails?.id}`}
        maxWidth="lg"
      >
        {selectedMatchForDetails && (
          <div className="space-y-4 text-left">
            {/* Side by side comparison */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Your Uploaded Photo
                </span>
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={selectedMatchForDetails.queryImageUrl}
                    alt="Query"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                  Campus Found Candidate
                </span>
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-emerald-500">
                  <img
                    src={selectedMatchForDetails.matchItem.imageUrl}
                    alt="Candidate"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Feature Alignment Matrix */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Visual Alignment Features
              </h5>
              {selectedMatchForDetails.featureMatches.map((feat, i) => (
                <div key={i} className="text-xs space-y-0.5 pt-1">
                  <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                    <span>{feat.name}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                      {feat.score}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    {feat.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Location & Safe Pickup Hub */}
            <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/60 text-xs flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  Turned In Location: {selectedMatchForDetails.matchItem.location}
                </span>
                <span className="text-slate-500 text-[11px]">
                  Physical custody at circulation desk. Present student ID to claim.
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedMatchForDetails(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  handleClaim(selectedMatchForDetails);
                  setSelectedMatchForDetails(null);
                }}
                leftIcon={<ShieldCheck className="w-4 h-4" />}
              >
                Request Claim
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
