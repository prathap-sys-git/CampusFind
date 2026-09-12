import React from 'react';
import { Sparkles, ShieldCheck, MapPin, PhoneCall, ExternalLink } from 'lucide-react';
import { CAMPUS_HUBS } from '../../data/mockData';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                Campus<span className="text-blue-600 dark:text-blue-400">Find</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              University AI-assisted lost and found ecosystem. Powered by multi-modal visual embeddings to reunite students with their belongings with high confidence.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Campus Neural Index: Operational & Synced (100% Uptime)
            </div>
          </div>

          {/* Quick Hub Locations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Physical Hubs
            </h4>
            <ul className="space-y-2 text-xs">
              {CAMPUS_HUBS.map((hub, i) => (
                <li key={i} className="flex flex-col">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-blue-500 shrink-0" />
                    {hub.name}
                  </span>
                  <span className="text-slate-400 text-[11px] pl-4.5">{hub.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Security & Verification */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Trust & Security
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                Verified Student ID Auth
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                Anti-Theft Proof Questions
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                Zero Sensitive Data Leaks
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                Campus Safety Log Integration
              </li>
            </ul>
          </div>

          {/* Emergency / Dispatch */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Urgent Assistance
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              For lost passports, critical medical devices, or official university master keys:
            </p>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Emergency Dispatch
              </span>
              <a
                href="tel:5554911"
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <PhoneCall className="w-3 h-3" /> (555) 019-4911
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-500">
          <p>© 2026 CampusFind University Network. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors">
              Terms of Service
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-900 dark:hover:text-slate-300 flex items-center gap-1 transition-colors"
            >
              System Docs <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
