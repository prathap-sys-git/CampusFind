import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Camera,
  UploadCloud,
  FileQuestion,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Bell,
  MapPin,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_ITEMS, MOCK_AI_MATCHES } from '../../data/mockData';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Lost Reports',
      count: '3',
      subtitle: '1 matched with candidate',
      icon: <FileQuestion className="w-5 h-5 text-rose-600" />,
      color: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600',
      path: '/lost-items',
    },
    {
      title: 'Found Reports',
      count: '8',
      subtitle: 'Logged across campus',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600',
      path: '/found-items',
    },
    {
      title: 'Possible Matches',
      count: '5',
      subtitle: '2 high similarity (>85%)',
      icon: <Sparkles className="w-5 h-5 text-blue-600" />,
      color: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600',
      path: '/matches',
    },
    {
      title: 'Active Claims',
      count: '2',
      subtitle: '1 ready for library pickup',
      icon: <ShieldCheck className="w-5 h-5 text-amber-600" />,
      color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600',
      path: '/claims',
    },
  ];

  const recentNotifications = [
    {
      id: 'notif_1',
      title: '92% match found for your lost water bottle',
      time: '12 mins ago',
      unread: true,
      icon: <Sparkles className="w-4 h-4 text-blue-500" />,
      path: '/matches',
    },
    {
      id: 'notif_2',
      title: 'Someone reported a found item near Central Library',
      time: '1 hour ago',
      unread: true,
      icon: <MapPin className="w-4 h-4 text-emerald-500" />,
      path: '/found-items',
    },
    {
      id: 'notif_3',
      title: 'Your claim request #CLM-4819 was verified by staff',
      time: 'Yesterday',
      unread: false,
      icon: <CheckCircle2 className="w-4 h-4 text-teal-500" />,
      path: '/claims',
    },
  ];

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto">
      {/* 1. WELCOME HERO & QUICK ACTIONS */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-500/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-semibold text-blue-100">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>AI Neural Index Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.fullName || 'Alex'}!
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed">
            Our vision embedding engine detected <span className="font-bold underline decoration-cyan-300">2 high-confidence matches</span> for items you reported missing on campus.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Button
            variant="secondary"
            size="md"
            className="w-full sm:w-auto"
            onClick={() => navigate('/report-lost')}
            leftIcon={<Camera className="w-4 h-4 text-rose-500" />}
          >
            Report Lost Item
          </Button>
          <Button
            variant="outline"
            size="md"
            className="w-full sm:w-auto text-white border-white/30 hover:bg-white/10"
            onClick={() => navigate('/report-found')}
            leftIcon={<UploadCloud className="w-4 h-4 text-emerald-400" />}
          >
            Report Found Item
          </Button>
        </div>
      </div>

      {/* 2. FOUR METRIC STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <Link
            key={i}
            to={stat.path}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {stat.title}
              </span>
              <div className={`p-2 rounded-xl ${stat.color} group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
            </div>
            <div>
              <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {stat.count}
              </span>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                {stat.subtitle}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* 3. TWO-COLUMN MAIN DASHBOARD SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 cols: Recent Reports & AI Matches */}
        <div className="lg:col-span-8 space-y-8">
          {/* AI MATCHES CALLOUT */}
          <Card bordered>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <CardTitle>High Confidence AI Matches</CardTitle>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Computer vision matches between your lost items and turned-in campus items.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/matches')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                View All Matches
              </Button>
            </CardHeader>
            <CardContent className="space-y-3.5">
              {MOCK_AI_MATCHES.slice(0, 2).map((match) => (
                <div
                  key={match.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 hover:border-blue-500/40 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                      <img
                        src={match.matchItem.imageUrl}
                        alt={match.matchItem.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-0.5 right-0.5 bg-emerald-600 text-white text-[9px] font-bold px-1 rounded">
                        {match.similarityScore}%
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {match.matchItem.title}
                        </span>
                        <Badge variant="success" size="sm">
                          {match.similarityScore}% Match
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {match.matchItem.location} • Found {match.matchItem.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/matches')}
                    >
                      Compare
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate('/claims')}
                    >
                      Claim
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* RECENT REPORTS */}
          <Card bordered>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Campus Reports</CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Active items logged in your campus zones.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/lost-items')}
                >
                  Browse Lost
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/found-items')}
                >
                  Browse Found
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {MOCK_ITEMS.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {item.title}
                          </span>
                          <Badge
                            variant={item.type === 'lost' ? 'lost' : 'found'}
                            size="sm"
                            dot
                          >
                            {item.type === 'lost' ? 'Lost' : 'Found'}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {item.location} • {item.date}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(item.type === 'lost' ? '/lost-items' : '/found-items')
                      }
                    >
                      Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 4 cols: Notifications & Quick Links */}
        <div className="lg:col-span-4 space-y-6">
          {/* Recent Notifications Feed */}
          <Card bordered>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-600" />
                <CardTitle className="text-base">Recent Alerts</CardTitle>
              </div>
              <Link
                to="/notifications"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                View all
              </Link>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {recentNotifications.map((notif) => (
                <Link
                  key={notif.id}
                  to={notif.path}
                  className={`p-3 rounded-xl border flex items-start gap-3 transition-colors block ${
                    notif.unread
                      ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/80 dark:border-blue-900/40'
                      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-xs shrink-0 mt-0.5">
                    {notif.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white leading-snug">
                      {notif.title}
                    </p>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                      <Clock className="w-2.5 h-2.5" />
                      {notif.time}
                    </span>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Campus Hubs Quick Reference */}
          <Card bordered>
            <CardHeader>
              <CardTitle className="text-base">Physical Hub Drop-offs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 pt-0">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Library Circulation Desk
                </span>
                <span className="text-[11px] text-slate-500">Central Library 1st Floor • Open until Midnight</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Student Union Info Booth
                </span>
                <span className="text-[11px] text-slate-500">Main Atrium • 8:00 AM - 10:00 PM</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
