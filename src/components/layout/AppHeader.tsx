import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, Sparkles } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useAuth } from '../../context/AuthContext';

export interface AppHeaderProps {
  onOpenMobileMenu: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onOpenMobileMenu }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-16 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 transition-colors">
      {/* Mobile Menu Trigger & Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Quick Search */}
        <div className="relative hidden sm:flex items-center w-64 md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search lost & found logs..."
            className="w-full text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 pl-9 pr-3 py-2 border-none focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all placeholder:text-slate-400"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                navigate('/lost-items');
              }
            }}
          />
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Campus Neural Sync indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>FAISS Vector Index Synced</span>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle variant="compact" />

        {/* Notifications Shortcut */}
        <Link
          to="/notifications"
          className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600" />
        </Link>

        {/* User Avatar shortcut */}
        <Link
          to="/settings"
          className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <img
            src={user?.avatarUrl}
            alt={user?.fullName || 'User'}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-600/20"
          />
          <div className="hidden lg:block text-left">
            <span className="text-xs font-bold text-slate-900 dark:text-white block leading-tight">
              {user?.fullName}
            </span>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold leading-tight flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              Student Portal
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
};
