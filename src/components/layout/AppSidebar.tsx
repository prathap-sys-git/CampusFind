import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  UploadCloud,
  Search,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Bell,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/Toast';

export interface AppSidebarProps {
  onCloseMobile?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ onCloseMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged Out',
      description: 'You have been signed out of CampusFind.',
      type: 'info',
    });
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Report Lost', path: '/report-lost', icon: <PlusCircle className="w-4 h-4" />, highlight: 'lost' },
    { label: 'Report Found', path: '/report-found', icon: <UploadCloud className="w-4 h-4" />, highlight: 'found' },
    { label: 'Browse Lost', path: '/lost-items', icon: <Search className="w-4 h-4" /> },
    { label: 'Browse Found', path: '/found-items', icon: <CheckCircle2 className="w-4 h-4" /> },
    { label: 'AI Matches', path: '/matches', icon: <Sparkles className="w-4 h-4 text-blue-500" />, badge: '2 new' },
    { label: 'Claims', path: '/claims', icon: <ShieldCheck className="w-4 h-4" />, badge: '1' },
    { label: 'Notifications', path: '/notifications', icon: <Bell className="w-4 h-4" />, badge: '3' },
    { label: 'Profile & Settings', path: '/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-colors select-none text-left">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/25">
          <Sparkles className="h-4.5 w-4.5" />
          <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900" />
        </div>
        <div>
          <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
            Campus<span className="text-blue-600 dark:text-blue-400">Find</span>
          </span>
          <span className="block text-[10px] text-slate-400 font-medium leading-none">
            Student Portal
          </span>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-5 px-3.5 space-y-1 overflow-y-auto">
        <div className="px-2.5 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Navigation
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-2.5">
                  <span
                    className={
                      isActive
                        ? 'text-white'
                        : item.highlight === 'lost'
                        ? 'text-rose-500'
                        : item.highlight === 'found'
                        ? 'text-emerald-500'
                        : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
                    }
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* User profile card & Logout */}
      <div className="p-3.5 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
        <NavLink
          to="/settings"
          onClick={onCloseMobile}
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
        >
          <img
            src={user?.avatarUrl}
            alt={user?.fullName || 'User'}
            className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
          />
          <div className="flex-1 min-w-0">
            <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {user?.fullName || 'Student'}
            </h5>
            <p className="text-[11px] text-slate-400 truncate">
              {user?.department || 'University Student'}
            </p>
          </div>
        </NavLink>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};
