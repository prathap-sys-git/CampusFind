import React, { useState } from 'react';
import { Bell, Sparkles, MapPin, CheckCircle2, Check } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';

interface NotificationItemData {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  unread: boolean;
  type: 'match' | 'report' | 'claim' | 'system';
}

export const NotificationsPage: React.FC = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<NotificationItemData[]>([
    {
      id: 'notif_1',
      title: '92% match found for your lost water bottle',
      description: 'A blue insulated drink flask turned into Central Library circulation desk has a 92% visual similarity score.',
      timestamp: '12 minutes ago',
      unread: true,
      type: 'match',
    },
    {
      id: 'notif_2',
      title: 'Someone reported a found item near Central Library',
      description: 'A new found item matching category "Bottles & Mugs" was logged on the 3rd floor quiet study area.',
      timestamp: '1 hour ago',
      unread: true,
      type: 'report',
    },
    {
      id: 'notif_3',
      title: 'Your claim request #CLM-4819 was approved',
      description: 'Circulation desk verified your sticker proof. You can pick up your Hydro Flask at window #2.',
      timestamp: 'Yesterday at 4:15 PM',
      unread: false,
      type: 'claim',
    },
    {
      id: 'notif_4',
      title: 'Campus safety audit sync completed',
      description: 'Campus police overnight logs have been indexed into the FAISS neural search cluster.',
      timestamp: '2 days ago',
      unread: false,
      type: 'system',
    },
  ]);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    toast({
      title: 'All Caught Up',
      description: 'All campus notifications marked as read.',
      type: 'success',
    });
  };

  const getIcon = (type: NotificationItemData['type']) => {
    switch (type) {
      case 'match':
        return <Sparkles className="w-4 h-4 text-blue-500" />;
      case 'claim':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'report':
        return <MapPin className="w-4 h-4 text-indigo-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Notification Center
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time updates regarding AI matches, claim approvals, and campus reports.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            leftIcon={<Check className="w-4 h-4" />}
          >
            Mark all as read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
              notif.unread
                ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/80 dark:border-blue-900/40 shadow-xs'
                : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                  notif.unread
                    ? 'bg-white dark:bg-slate-800 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800'
                }`}
              >
                {getIcon(notif.type)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {notif.title}
                  </h4>
                  {notif.unread && (
                    <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {notif.description}
                </p>
                <span className="text-[11px] text-slate-400 block pt-1">
                  {notif.timestamp}
                </span>
              </div>
            </div>

            {notif.unread && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMarkAsRead(notif.id)}
                className="shrink-0 text-xs"
              >
                Mark read
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
