import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle, RefreshCw, Layers, ShieldCheck, MapPin } from 'lucide-react';
import { MOCK_AI_MATCHES } from '../../data/mockData';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const AiMatchShowcase: React.FC = () => {
  const [selectedMatchIndex, setSelectedMatchIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  const currentMatch = MOCK_AI_MATCHES[selectedMatchIndex];

  const handleSwitchItem = (index: number) => {
    if (index === selectedMatchIndex) return;
    setIsScanning(true);
    setTimeout(() => {
      setSelectedMatchIndex(index);
      setIsScanning(false);
    }, 600);
  };

  const handleRescan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 700);
  };

  return (
    <div className="relative w-full rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 lg:p-10 shadow-2xl shadow-blue-500/10 dark:shadow-black/60 overflow-hidden">
      {/* Background ambient glow - restrained and subtle */}
      <div className="pointer-events-none absolute -top-32 -right-32 w-80 h-80 rounded-full bg-blue-500/10 dark:bg-blue-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-teal-500/10 dark:bg-teal-500/10 blur-3xl" />

      {/* Top Header & Sample Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Multi-Modal Vision Matcher</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How CampusFind Spots Matches
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            CLIP vision embeddings compare photo geometry, color distribution, and surface markings.
          </p>
        </div>

        {/* Item Selector Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl overflow-x-auto">
          {MOCK_AI_MATCHES.map((m, idx) => (
            <button
              key={m.id}
              onClick={() => handleSwitchItem(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedMatchIndex === idx
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {idx === 0 ? 'Water Bottle' : idx === 1 ? 'AirPods Pro' : 'TI-84 Calculator'}
            </button>
          ))}
          <button
            onClick={handleRescan}
            title="Re-run neural scan"
            className="p-1.5 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main AI Visual Matching Showcase Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 items-center mt-8">
        {/* Step 1: Lost Item Card (4 cols) */}
        <div className="lg:col-span-4 flex flex-col bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 text-left relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              1. Student Photo (Lost)
            </span>
            <Badge variant="lost" size="sm" dot>
              Reported Lost
            </Badge>
          </div>

          <div className="relative aspect-video sm:aspect-[4/3] rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800">
            <img
              src={currentMatch.queryImageUrl}
              alt={currentMatch.queryItemTitle}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isScanning ? 'opacity-40 filter blur-xs' : 'opacity-100'
              }`}
            />
            {/* Visual bounding box simulation */}
            <div className="absolute inset-4 border-2 border-dashed border-rose-400/80 rounded-lg pointer-events-none flex items-start justify-end p-1.5">
              <span className="bg-rose-500 text-white text-[10px] font-mono px-1.5 py-0.5 rounded shadow">
                Query ROI
              </span>
            </div>

            {/* Scanning line */}
            {isScanning && (
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#38bdf8] animate-ai-scan" />
            )}
          </div>

          <div className="mt-3.5 space-y-1">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {currentMatch.queryItemTitle}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Uploaded by student from mobile device.
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap gap-1">
            {currentMatch.detectedLabels.map((lbl, i) => (
              <span
                key={i}
                className="text-[10px] font-mono bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700"
              >
                #{lbl}
              </span>
            ))}
          </div>
        </div>

        {/* Step 2: AI Visual Matching Engine (3 cols) */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center p-4 text-center">
          {/* Vertical connection lines on mobile, horizontal on desktop */}
          <div className="hidden lg:flex flex-col items-center w-full space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
              <Layers className={`h-6 w-6 ${isScanning ? 'animate-bounce' : ''}`} />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                2. AI Visual Matching
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px]">
                Dense vector projection via CLIP 512-dim embedding
              </p>
            </div>

            {/* Neural alignment meter */}
            <div className="w-full bg-slate-100 dark:bg-slate-800/90 rounded-xl p-3 border border-slate-200/80 dark:border-slate-700/80 space-y-2 text-left">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                <span>Vector Cosine Sim</span>
                <span className="text-blue-600 dark:text-blue-400 font-mono">
                  {isScanning ? '0.00' : (currentMatch.similarityScore / 100).toFixed(2)}
                </span>
              </div>
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-500 transition-all duration-700"
                  style={{ width: isScanning ? '15%' : `${currentMatch.similarityScore}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-400 text-center font-mono">
                {isScanning ? 'Calibrating tensors...' : 'FAISS index indexed < 4ms'}
              </div>
            </div>

            <div className="text-blue-500 dark:text-blue-400">
              <ArrowRight className="w-6 h-6 animate-pulse" />
            </div>
          </div>

          {/* Mobile view of step 2 */}
          <div className="lg:hidden flex items-center gap-3 py-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              ↓ AI Matching Matrix ↓
            </span>
          </div>
        </div>

        {/* Step 3: Found Item & 92% Match Badge (4 cols) */}
        <div className="lg:col-span-4 flex flex-col bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-emerald-500/30 dark:border-emerald-500/40 p-4 text-left relative overflow-hidden shadow-lg shadow-emerald-500/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              3. Campus Found Report
            </span>
            {/* The bold 92% Match badge required */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 animate-in fade-in">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isScanning ? 'Scanning...' : `${currentMatch.similarityScore}% Match`}</span>
            </div>
          </div>

          <div className="relative aspect-video sm:aspect-[4/3] rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800">
            <img
              src={currentMatch.matchItem.imageUrl}
              alt={currentMatch.matchItem.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isScanning ? 'opacity-40 filter blur-xs' : 'opacity-100'
              }`}
            />
            <div className="absolute inset-4 border-2 border-emerald-400/80 rounded-lg pointer-events-none flex items-start justify-end p-1.5">
              <span className="bg-emerald-600 text-white text-[10px] font-mono px-1.5 py-0.5 rounded shadow">
                Candidate ROI
              </span>
            </div>
            <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>{currentMatch.matchItem.location}</span>
            </div>
          </div>

          <div className="mt-3.5 space-y-1">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {currentMatch.matchItem.title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {currentMatch.matchItem.description}
            </p>
          </div>

          {/* Feature Match Breakdown */}
          <div className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-800/80 space-y-1.5">
            {currentMatch.featureMatches.map((feat, i) => (
              <div key={i} className="flex items-center justify-between text-[11px]">
                <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                  {feat.name}
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                  {feat.score}%
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800/80">
            <Button variant="primary" size="sm" className="w-full" rightIcon={<ShieldCheck className="w-4 h-4" />}>
              Verify & Request Claim
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
