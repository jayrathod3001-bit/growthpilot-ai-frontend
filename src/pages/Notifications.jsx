import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const NOTIF_STORAGE_KEY = 'gp_notifications_cache';

const demoNotifications = [
  { id: 1, icon: '🎯', title: 'Marketing Strategy Ready', text: 'Your 30-day marketing campaign has been generated. Start implementing today!', time: '2 min ago', color: '#6366f1', unread: true },
  { id: 2, icon: '✅', title: 'Profile 85% Complete', text: 'Add your website URL and social media handles to reach 100% profile completion.', time: '1 hour ago', color: '#10b981', unread: true },
  { id: 3, icon: '📈', title: 'SEO Score Improved', text: 'Your SEO score improved from 65 to 78 this week. Keep adding location-based content!', time: 'Today, 10:30 AM', color: '#f59e0b', unread: true },
  { id: 4, icon: '📸', title: 'Instagram Strategy Tip', text: 'Try creating a new Instagram Reels campaign — businesses using Reels see 3x more engagement.', time: 'Yesterday', color: '#ec4899', unread: false },
  { id: 5, icon: '💡', title: 'AI Insight: Weekend Sales', text: 'Based on your business data, running weekend promotional offers could boost your sales by 25-30%.', time: '2 days ago', color: '#8b5cf6', unread: false },
  { id: 6, icon: '🏆', title: 'Milestone Reached', text: 'Congratulations! You have generated 10+ AI content pieces this month. Keep growing!', time: '3 days ago', color: '#06b6d4', unread: false },
];

const loadCachedNotifs = () => {
  try {
    const saved = sessionStorage.getItem(NOTIF_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
};

const Notifications = ({ onToast }) => {
  const [notifications, setNotifications] = useState(() => loadCachedNotifs() || demoNotifications);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const saveAndSet = useCallback((notifs) => {
    setNotifications(notifs);
    try { sessionStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(notifs)); } catch {}
  }, []);

  const fetchLiveNotifications = useCallback(async (showToast = false) => {
    try {
      setIsRefreshing(true);
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/ai/notifications',
        {},
        {
          headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
          timeout: 60000,
        }
      );

      if (res.data?.status === 1 && Array.isArray(res.data?.data) && res.data.data.length > 0) {
        const fresh = res.data.data.map((n, i) => ({ ...n, unread: true, id: n.id || Date.now() + i }));
        saveAndSet(fresh);

        // Show toast popup when notifications arrive
        if (showToast && onToast) {
          onToast({
            icon: '🔔',
            title: 'Notifications Ready!',
            text: `${fresh.length} new AI notifications for your business.`,
            color: '#6366f1',
          });
        }
      }
    } catch (err) {
      console.warn('AI notifications fetch warning (using cached):', err.message);
    } finally {
      setIsRefreshing(false);
    }
  }, [onToast, saveAndSet]);

  useEffect(() => {
    // On first load: if no cached data, fetch silently; if user clicks refresh, show toast
    if (!loadCachedNotifs()) {
      fetchLiveNotifications(false);
    }
  }, [fetchLiveNotifications]);

  const markAllRead = () => saveAndSet(notifications.map((n) => ({ ...n, unread: false })));
  const markRead = (id) => saveAndSet(notifications.map((n) => (n.id === id ? { ...n, unread: false } : n)));

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 logo-badge text-2xl">🔔</div>
          <div>
            <h1 className="text-2xl font-black text-white">Notifications</h1>
            <p className="text-sm text-slate-500">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fetchLiveNotifications(true)}
            disabled={isRefreshing}
            className="text-xs px-3 py-2 rounded-xl font-medium transition-all btn-outline-purple"
          >
            {isRefreshing ? '⏳ Generating...' : '⚡ AI Refresh'}
          </button>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-xs px-4 py-2 rounded-xl font-medium transition-all btn-outline-purple">
              Mark all read
            </button>
          )}
        </div>
      </div>

      {isRefreshing && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/5">
          <span className="text-indigo-400 animate-pulse">🤖</span>
          <p className="text-xs text-indigo-300">Nexa AI is generating personalized notifications for your business...</p>
        </div>
      )}

      <div className="space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() => markRead(notif.id)}
            className={`flex gap-4 p-4 rounded-2xl cursor-pointer transition-all hover:bg-white/5 ${notif.unread ? 'insight-box' : 'card-glass-subtle'}`}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 mt-0.5"
              style={{ background: `${notif.color}20`, border: `1px solid ${notif.color}30` }}
            >
              {notif.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-white">{notif.title}</p>
                {notif.unread && <span className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: notif.color }} />}
              </div>
              <p className="text-xs mt-1 leading-relaxed text-gray-400">{notif.text}</p>
              <p className="text-xs mt-2 text-slate-600">{notif.time}</p>
            </div>
          </div>
        ))}
      </div>

      {notifications.length === 0 && !isRefreshing && (
        <div className="text-center py-16">
          <span className="text-5xl mb-4 block opacity-20">🔔</span>
          <p className="text-sm font-medium text-white">No notifications yet</p>
          <p className="text-xs mt-2 text-slate-600">Click "AI Refresh" to get personalized business notifications.</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
