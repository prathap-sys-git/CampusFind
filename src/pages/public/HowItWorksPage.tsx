import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  Cpu,
  ArrowRight,
  Shield,
  Sparkles,
} from 'lucide-react';

import { Button } from '../../components/ui/Button';

export const HowItWorksPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen text-left">
      {/* Hero Header */}
      <section className="pt-14 pb-16 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-modal Neural Visual Matching</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How CampusFind Recovers Your Gear
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-3 max-w-2xl mx-auto leading-relaxed">
            A comprehensive look at how artificial intelligence and campus safety desks work together to reunite students with their belongings.
          </p>
        </div>
      </section>

      {/* Deep Dive Steps */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Deep Dive 1 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-lg">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              1. Multi-Angle Photo Extraction
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              When a student uploads an image, CampusFind crops, normalizes, and extracts salient visual features. Even if your water bottle is resting sideways on a library carpet, the vision pipeline isolates the primary object.
            </p>
          </div>
          <div className="md:col-span-7 bg-slate-100 dark:bg-slate-900/60 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-blue-600 font-bold">Input Preprocessing Pipeline</span>
              <span className="text-emerald-500">224x224 RGB Tensor</span>
            </div>
            <p className="text-slate-500">✓ Auto-rotation & perspective skew compensation</p>
            <p className="text-slate-500">✓ Background noise reduction & illumination leveling</p>
            <p className="text-slate-500">✓ Color temperature correction</p>
          </div>
        </div>

        {/* Deep Dive 2 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 bg-slate-100 dark:bg-slate-900/60 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300 space-y-2 order-2 md:order-1">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-blue-600 font-bold">Vector Similarity Search</span>
              <span className="text-emerald-500">Cosine Distance &lt; 0.12</span>
            </div>
            <p className="text-slate-500">→ Contrastive Language-Image Pretraining (CLIP)</p>
            <p className="text-slate-500">→ High-dimensional embedding projected to FAISS index</p>
            <p className="text-slate-500">→ Sub-millisecond scan across campus-wide active inventory</p>
          </div>
          <div className="md:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 order-1 md:order-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-lg">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              2. Vector Embeddings & Similarity
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Instead of relying only on vague keyword searches, our system converts images and descriptions into semantic vectors. If a student wrote "blue mug" and someone reported "navy insulated thermos", our neural index pairs them automatically.
            </p>
          </div>
        </div>

        {/* Deep Dive 3 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600 text-white font-bold text-lg">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              3. Fraud-Proof Ownership Claim
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              To prevent dishonest claims, key identifying details (e.g. laptop lock screen, engravings, serial digits, internal wallet contents) are hidden from public view. Claimants must answer a challenge question before claiming.
            </p>
          </div>
          <div className="md:col-span-7 bg-slate-100 dark:bg-slate-900/60 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-teal-600 font-bold">Verification Flow</span>
              <span className="text-emerald-500">Verified by Campus Staff</span>
            </div>
            <p className="text-slate-500">✓ Claimant submits private security proof</p>
            <p className="text-slate-500">✓ Circulation desk checks student university photo ID</p>
            <p className="text-slate-500">✓ Safe handoff logged in campus safety audit record</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            Ready to try CampusFind?
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6">
            Log in with your university account or sign up in seconds.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/register')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
