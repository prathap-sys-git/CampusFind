import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sun,
  Moon,
  Laptop,
  CheckCircle2,
  Lock,
  Mail,
  GraduationCap,
  Bell,
  LogOut,
  Sparkles,
  ArrowLeft,
  KeyRound,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { CURRENT_USER } from '../data/mockData';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { useToast } from '../components/ui/Toast';
import { Modal } from '../components/ui/Modal';
import type { Theme } from '../types';

export interface SettingsPageProps {
  onBack?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(true);

  // Change password modal state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Edit Profile modal state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [fullName, setFullName] = useState(CURRENT_USER.fullName);
  const [phone, setPhone] = useState(CURRENT_USER.phone || '');

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    toast({
      title: `Theme Updated: ${newTheme.toUpperCase()}`,
      description: `Saved to localStorage. Now rendering in ${newTheme === 'system' ? `system mode (${resolvedTheme})` : newTheme} theme.`,
      type: 'success',
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordError('Please enter your current password');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setPasswordError('');
    setIsPasswordModalOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    toast({
      title: 'Password Updated',
      description: 'Your campus account credentials have been securely updated.',
      type: 'success',
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditProfileOpen(false);
    toast({
      title: 'Profile Saved',
      description: 'Your student contact info has been updated.',
      type: 'success',
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      {/* Back button and page title */}
      <div className="flex items-center gap-3 mb-8">
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back
          </Button>
        )}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Profile & Settings
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage your student identity, appearance preferences, and campus alerts.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* 1. APPEARANCE SECTION (KEY REQUIREMENT) */}
        <Card bordered className="border-blue-500/30 dark:border-blue-500/20 shadow-lg shadow-blue-500/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle>Appearance & Theme</CardTitle>
                  <CardDescription>
                    Select how CampusFind looks to you. Stored locally and synchronizes across all routes.
                  </CardDescription>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Active: {theme.toUpperCase()} ({resolvedTheme.toUpperCase()})
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* The 3 Themes Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Light Mode Card */}
              <button
                type="button"
                onClick={() => handleThemeChange('light')}
                className={`flex flex-col items-start p-4 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                  theme === 'light'
                    ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 ring-2 ring-blue-600/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Visual Preview of Light Mode */}
                <div className="w-full h-24 rounded-xl bg-white border border-slate-200 p-2.5 shadow-inner mb-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="h-2 w-12 rounded bg-slate-200" />
                    <div className="h-3 w-3 rounded-full bg-blue-600" />
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 w-full rounded bg-slate-100" />
                    <div className="h-2 w-3/4 rounded bg-slate-100" />
                  </div>
                  <div className="h-4 w-14 rounded bg-blue-600" />
                </div>

                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      ☀ Light
                    </span>
                  </div>
                  {theme === 'light' && (
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Crisp daylight contrast with slate surfaces.
                </p>
              </button>

              {/* Dark Mode Card */}
              <button
                type="button"
                onClick={() => handleThemeChange('dark')}
                className={`flex flex-col items-start p-4 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                  theme === 'dark'
                    ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 ring-2 ring-blue-600/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Visual Preview of Dark Mode */}
                <div className="w-full h-24 rounded-xl bg-slate-950 border border-slate-800 p-2.5 shadow-inner mb-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="h-2 w-12 rounded bg-slate-800" />
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 w-full rounded bg-slate-900" />
                    <div className="h-2 w-3/4 rounded bg-slate-900" />
                  </div>
                  <div className="h-4 w-14 rounded bg-blue-600" />
                </div>

                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      🌙 Dark
                    </span>
                  </div>
                  {theme === 'dark' && (
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Deep ink backgrounds for late-night study sessions.
                </p>
              </button>

              {/* System Mode Card */}
              <button
                type="button"
                onClick={() => handleThemeChange('system')}
                className={`flex flex-col items-start p-4 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                  theme === 'system'
                    ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 ring-2 ring-blue-600/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Visual Preview of System Split */}
                <div className="w-full h-24 rounded-xl border border-slate-300 dark:border-slate-700 mb-3 flex overflow-hidden shadow-inner">
                  <div className="w-1/2 h-full bg-white p-2 flex flex-col justify-between">
                    <div className="h-2 w-8 rounded bg-slate-200" />
                    <div className="h-2 w-full rounded bg-slate-100" />
                    <div className="h-3 w-8 rounded bg-blue-600" />
                  </div>
                  <div className="w-1/2 h-full bg-slate-950 p-2 flex flex-col justify-between border-l border-slate-700">
                    <div className="h-2 w-8 rounded bg-slate-800" />
                    <div className="h-2 w-full rounded bg-slate-900" />
                    <div className="h-3 w-8 rounded bg-blue-500" />
                  </div>
                </div>

                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-teal-500" />
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      💻 System
                    </span>
                  </div>
                  {theme === 'system' && (
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Automatically mirrors your OS system preference.
                </p>
              </button>
            </div>

            {/* Verification & Flash-prevention info */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  Zero-Flash Pre-render Architecture
                </span>
                Our pre-render inline engine evaluates your preference before DOM painting to prevent light flashes on page refresh.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. PROFILE SECTION */}
        <Card bordered>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Student Profile</CardTitle>
                <CardDescription>
                  Your verified university credentials and recovery statistics.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditProfileOpen(true)}
              >
                Edit Profile
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-slate-100 dark:border-slate-800">
              <img
                src={CURRENT_USER.avatarUrl}
                alt={CURRENT_USER.fullName}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-600/20"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {fullName}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Student
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {CURRENT_USER.campusEmail}
                  </span>
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    {CURRENT_USER.department} ({CURRENT_USER.gradYear})
                  </span>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                <span className="text-xs text-slate-400 block">Student ID</span>
                <span className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">
                  {CURRENT_USER.studentId}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                <span className="text-xs text-slate-400 block">Reports Filed</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {CURRENT_USER.itemsReportedCount} items
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                <span className="text-xs text-slate-400 block">Items Recovered</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {CURRENT_USER.itemsRecoveredCount} returned
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                <span className="text-xs text-slate-400 block">Account Status</span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  Good Standing
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. NOTIFICATIONS & SECURITY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Notifications preferences */}
          <Card bordered>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                <CardTitle>Campus Alerts</CardTitle>
              </div>
              <CardDescription>
                Configure when you receive instant match notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer">
                <div>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
                    AI Match Push Alerts
                  </span>
                  <span className="text-xs text-slate-500">
                    Notify immediately when an item matching &gt;80% is found.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => {
                    setNotificationsEnabled(e.target.checked);
                    toast({
                      title: 'Preferences Updated',
                      description: `Push match alerts ${e.target.checked ? 'enabled' : 'paused'}.`,
                      type: 'info',
                    });
                  }}
                  className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer">
                <div>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
                    Daily Digest Email
                  </span>
                  <span className="text-xs text-slate-500">
                    Summary of items turned into campus library & safety desk.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlertsEnabled}
                  onChange={(e) => {
                    setEmailAlertsEnabled(e.target.checked);
                    toast({
                      title: 'Preferences Updated',
                      description: `Daily digest ${e.target.checked ? 'enabled' : 'paused'}.`,
                      type: 'info',
                    });
                  }}
                  className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                />
              </label>
            </CardContent>
          </Card>

          {/* Account Security */}
          <Card bordered>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-600" />
                <CardTitle>Account & Security</CardTitle>
              </div>
              <CardDescription>
                Credentials, session controls, and login history.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5">
              <Button
                variant="outline"
                size="md"
                className="w-full justify-start text-left"
                onClick={() => setIsPasswordModalOpen(true)}
                leftIcon={<KeyRound className="w-4 h-4" />}
              >
                Change Account Password
              </Button>

              <Button
                variant="ghost"
                size="md"
                className="w-full justify-start text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                onClick={() => {
                  logout();
                  toast({
                    title: 'Logged Out',
                    description: 'You have been safely signed out of CampusFind.',
                    type: 'info',
                  });
                  navigate('/login');
                }}

                leftIcon={<LogOut className="w-4 h-4" />}
              >
                Log Out of CampusFind
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change Campus Account Password"
        description="Must be at least 8 characters with numbers or symbols."
      >
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <Input
            type="password"
            label="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <Input
            type="password"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 8 characters"
            required
          />
          <Input
            type="password"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            error={passwordError}
            required
          />

          <div className="pt-2 flex justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsPasswordModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save New Password
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        title="Edit Contact Information"
        description="Update your display name and campus phone number."
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <Input
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <Input
            label="Campus Email"
            value={CURRENT_USER.campusEmail}
            disabled
            helperText="Campus email is tied to university SSO login and cannot be modified."
          />
          <Input
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(555) 000-0000"
          />

          <div className="pt-2 flex justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditProfileOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
