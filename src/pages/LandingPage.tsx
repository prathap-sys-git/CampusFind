import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  UploadCloud,
  Search,
  ShieldCheck,
  Building2,
  Sparkles,
  ArrowRight,
  Cpu,
  PackageCheck,
  FileCheck2,
} from 'lucide-react';
import { AiMatchShowcase } from '../components/landing/AiMatchShowcase';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleReportAction = (target: 'lost' | 'found') => {
    if (isAuthenticated) {
      navigate(target === 'lost' ? '/report-lost' : '/report-found');
    } else {
      // Direct unauthenticated users to login/register to file report
      navigate('/login', { state: { redirectTo: target === 'lost' ? '/report-lost' : '/report-found' } });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/80 dark:border-slate-800">
        {/* Subtle decorative grid backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Top trust badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200/80 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-semibold mb-6 shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400" />
            <span>Official Campus Lost & Found Neural Network</span>
          </div>

          {/* Prompt exact headlines */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Lost Something on Campus?
          </h1>
          <p className="text-2xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight mt-2 mb-6">
            Let AI help you find it.
          </p>

          {/* Short explanation of AI-powered visual matching */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            Upload a photo of your lost item and discover visually similar items reported by students across campus using computer vision matching.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto mb-16">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => handleReportAction('lost')}
              leftIcon={<Camera className="w-5 h-5" />}
            >
              Report Lost Item
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => handleReportAction('found')}
              leftIcon={<UploadCloud className="w-5 h-5" />}
            >
              Report Found Item
            </Button>
          </div>

          {/* Centerpiece AI Matching Visual */}
          <div className="scroll-mt-24">
            <AiMatchShowcase />
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section id="how-it-works" className="py-20 lg:py-28 border-b border-slate-200/80 dark:border-slate-800 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider mb-3">
            Simple 3-Step Process
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto mt-2 mb-16">
            Connecting lost belongings to campus discovery desks in three simple steps.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Step 1: Report an Item */}
            <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-7 shadow-sm hover:border-blue-500/40 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold text-lg mb-5">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Step 1: Report an Item
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Take a quick photo or write a short description of what you lost or found. Add campus location hints such as library floor or lecture hall number.
              </p>
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 text-xs font-medium text-slate-500">
                <FileCheck2 className="w-4 h-4 text-blue-500" />
                <span>Instant submission in under 60 seconds</span>
              </div>
            </div>

            {/* Step 2: AI Finds Similar Items */}
            <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-7 shadow-sm hover:border-blue-500/40 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold text-lg mb-5">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Step 2: AI Finds Similar Items
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Our vision embedding models automatically compare image geometry, color signatures, and unique distinguishing stickers against recent reports.
              </p>
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 text-xs font-medium text-slate-500">
                <Cpu className="w-4 h-4 text-blue-500" />
                <span>Multi-modal CLIP visual matching</span>
              </div>
            </div>

            {/* Step 3: Verify & Recover */}
            <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-7 shadow-sm hover:border-blue-500/40 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold text-lg mb-5">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Step 3: Verify & Recover
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Confirm your rightful ownership with a secure verification question. Receive campus pickup directions at the library desk or student center.
              </p>
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 text-xs font-medium text-slate-500">
                <PackageCheck className="w-4 h-4 text-blue-500" />
                <span>Zero-fraud student verification</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHY CAMPUSFIND */}
      <section id="why-campusfind" className="py-20 lg:py-28 bg-slate-50 dark:bg-slate-900/30 border-b border-slate-200/80 dark:border-slate-800 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Why CampusFind
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2">
              Engineered specifically for university dorms, lecture halls, and active recreation facilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {/* 1. AI Image Matching */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs hover:-translate-y-1 transition-transform">
              <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                AI Image Matching
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                Recognizes stickers, scratches, models, and color palettes even when photographed in dim lecture halls or uneven lighting.
              </p>
            </div>

            {/* 2. Smart Search */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs hover:-translate-y-1 transition-transform">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Smart Search
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                Filter by campus zone (Library, Engineering, Gym, Dorms), date intervals, item category, and custom keywords instantly.
              </p>
            </div>

            {/* 3. Secure Claim Verification */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs hover:-translate-y-1 transition-transform">
              <div className="h-10 w-10 rounded-xl bg-teal-50 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Secure Claim Verification
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                Prevents false claims by hiding private serial numbers, lock screens, and engravings until the claimant passes verification.
              </p>
            </div>

            {/* 4. Campus-wide Recovery */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs hover:-translate-y-1 transition-transform">
              <div className="h-10 w-10 rounded-xl bg-cyan-50 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Campus-wide Recovery
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                A unified network connected with Central Library circulation, Student Union, and campus security dispatch desks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SIMPLE FINAL CTA */}
      <section className="py-20 lg:py-24 bg-gradient-to-b from-transparent to-blue-50/50 dark:to-blue-950/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-blue-600 dark:bg-blue-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl shadow-blue-500/20">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to find what you lost?
            </h2>
            <p className="text-blue-100 text-sm sm:text-base mt-3 mb-8 max-w-xl mx-auto leading-relaxed">
              Join thousands of students and campus staff recovering lost devices, wallets, notebooks, and gear every day.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => navigate('/register')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Create Free Student Account
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-white border-white/40 hover:bg-white/10"
                onClick={() => navigate('/login')}
              >
                Sign In to CampusFind
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
