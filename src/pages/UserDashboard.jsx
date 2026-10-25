import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUserFromToken } from '../utils/auth';

const quickActions = [
  { icon: '🤖', label: 'Ask Nexa AI', path: '/ai-chat', color: '#6366f1' },
  { icon: '🎯', label: 'Create Marketing Strategy', path: '/marketing-strategy', color: '#8b5cf6' },
  { icon: '✍️', label: 'Generate Content', path: '/content-generator', color: '#06b6d4' },
  { icon: '🖼️', label: 'Generate Image', path: '/image-generator', color: '#10b981' },
  { icon: '🔍', label: 'Analyze SEO', path: '/seo-assistant', color: '#f59e0b' },
];

const defaultActivity = [
  { icon: '🎯', text: 'Start by creating a Marketing Strategy', time: 'Get started', color: '#6366f1' },
  { icon: '🤖', text: 'Chat with Nexa AI for business advice', time: 'Try now', color: '#8b5cf6' },
  { icon: '✍️', text: 'Generate your first content piece', time: 'Quick & easy', color: '#06b6d4' },
  { icon: '🔍', text: 'Run your first SEO analysis', time: 'Boost ranking', color: '#f59e0b' },
];

const UserDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('User');
  const [business, setBusiness] = useState(null);
  const [scores, setScores] = useState({ aiScore: 0, marketingScore: 0, businessHealth: 0, profileScore: 20 });
  const [recentActivity, setRecentActivity] = useState(defaultActivity);
  const [statsLoading, setStatsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await axios.get('http://localhost:5000/api/user/stats', {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });
      if (res.data?.status === 1 && res.data?.data) {
        const { scores: s, recentActivity: ra } = res.data.data;
        if (s) setScores(s);
        if (Array.isArray(ra) && ra.length > 0) setRecentActivity(ra);
      }
    } catch (err) {
      console.log('Stats fetch error:', err.message);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchActiveBusiness = useCallback(async (overrideBiz) => {
    if (overrideBiz) { setBusiness(overrideBiz); return; }
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const response = await axios.get('http://localhost:5000/api/get-my-businesses', {
        headers: { Authorization: 'Bearer ' + token },
      });
      if (response.data.status === 1 && response.data.data) {
        const list = response.data.data;
        if (response.data.user?.name) setUserName(response.data.user.name);
        if (list.length > 0) {
          const activeId = response.data.activeBusinessId;
          const activeBiz = list.find((b) => b._id === activeId) || list[0];
          setBusiness(activeBiz);
        } else {
          setBusiness(null);
        }
      }
    } catch (err) {
      console.log('Error fetching active business:', err.message);
    }
  }, []);

  useEffect(() => {
    const user = getUserFromToken();
    if (user?.name) setUserName(user.name);
    fetchActiveBusiness();
    fetchStats();

    const handleBizChange = (e) => {
      if (e?.detail) setBusiness(e.detail);
      else fetchActiveBusiness();
      fetchStats();
    };
    window.addEventListener('businessChanged', handleBizChange);
    return () => window.removeEventListener('businessChanged', handleBizChange);
  }, [fetchActiveBusiness, fetchStats]);

  const scoreCards = [
    { label: 'AI Score', value: scores.aiScore, icon: '⚡', color: '#6366f1', suffix: '/100', tip: 'Grows with every AI action' },
    { label: 'Marketing Score', value: scores.marketingScore, icon: '🎯', color: '#8b5cf6', suffix: '/100', tip: 'Based on campaigns & content' },
    { label: 'Business Health', value: scores.businessHealth, icon: '💚', color: '#10b981', suffix: '/100', tip: 'Overall business vitality' },
    { label: 'Profile Completion', value: scores.profileScore, icon: '✅', color: '#06b6d4', suffix: '%', tip: 'Fill in all business details' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Welcome Banner */}
      <div className="rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 banner-welcome">
        <div>
          <h1 className="text-2xl font-black text-white mb-1">Welcome back, {userName}! 👋</h1>
          <p className="text-sm text-gray-400">Here's your live business overview</p>
          {business ? (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="text-xs font-medium text-slate-500">Active Business:</span>
              <span className="badge-business-active">🏢 {business.businessName}</span>
              {business.businessCategory && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">
                  {business.businessCategory}
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 mt-3">
              <span className="text-xs text-slate-400">No active business yet.</span>
              <button onClick={() => navigate('/add-business')} className="text-xs px-3 py-1 rounded-lg btn-outline-purple font-medium">
                + Add Business
              </button>
            </div>
          )}
        </div>
        <button onClick={() => navigate('/add-business')} className="text-xs font-semibold px-4 py-2 rounded-xl transition-all btn-outline-purple">
          + Add Business
        </button>
      </div>

      {/* Profile Completion Action Banner if < 100% */}
      {scores.profileScore < 100 && (
        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-sm font-bold border border-indigo-500/30">
              {scores.profileScore}%
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Profile Details Incomplete</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-medium">
                  {scores.profileScore < 40 ? 'Action Recommended' : 'Almost Complete'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Fill in your missing personal & business details in Settings to boost your profile score to 100%.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all whitespace-nowrap"
          >
            Complete Profile →
          </button>
        </div>
      )}

      {/* Performance Overview & Live Score */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Live AI Performance Score</h2>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
              REAL-TIME LIVE
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                fetchStats();
                fetchActiveBusiness();
              }}
              disabled={statsLoading}
              className="text-xs px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-indigo-300 border border-white/10 flex items-center gap-1.5 transition-all"
            >
              <span className={statsLoading ? 'animate-spin' : ''}>↻</span>
              <span>{statsLoading ? 'Recalculating...' : 'Recalculate Live Score'}</span>
            </button>
          </div>
        </div>

        {/* Live Score Highlight Banner */}
        <div className="mb-4 p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-950/80 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center font-mono font-black text-2xl text-white shadow-lg shadow-indigo-500/20">
              {statsLoading ? '...' : Math.round((scores.aiScore * 0.35) + (scores.marketingScore * 0.35) + (scores.businessHealth * 0.2) + (scores.profileScore * 0.1))}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Live Business Health Index</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 uppercase">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Composite metric calculated from AI queries, campaign strategies, and SEO audit results.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Score Status:</span>
            <span className="font-bold text-indigo-300 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
              {(scores.aiScore > 70) ? '⚡ High Growth Velocity' : '📈 Warming Up (Execute AI Strategies)'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {scoreCards.map((card, i) => (
            <div key={i} className="rounded-2xl p-5 card-hover card-glass-subtle" title={card.tip}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl">{card.icon}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: `${card.color}20`, color: card.color }}>
                  {statsLoading ? '...' : 'Live'}
                </span>
              </div>
              <div className="text-3xl font-black mb-1" style={{ color: card.color }}>
                {statsLoading ? (
                  <span className="inline-block w-12 h-8 rounded-lg bg-white/5 animate-pulse" />
                ) : (
                  <>{card.value}<span className="text-base font-semibold text-slate-600">{card.suffix}</span></>
                )}
              </div>
              <p className="text-xs font-medium mb-3 text-slate-500">{card.label}</p>
              <div className="w-full h-1.5 rounded-full bg-white/5">
                <div
                  className="h-1.5 rounded-full transition-all duration-1000"
                  style={{
                    width: statsLoading ? '0%' : `${card.value}%`,
                    background: `linear-gradient(90deg, ${card.color}, ${card.color}aa)`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-4 text-slate-500">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {quickActions.map((action, i) => (
            <button key={i} onClick={() => navigate(action.path)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl text-center transition-all card-hover card-glass-subtle">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: `${action.color}20`, border: `1px solid ${action.color}30` }}>
                {action.icon}
              </div>
              <span className="text-xs font-medium text-gray-400">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* AI Insights + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl p-6 card-purple-border">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-lg ai-pulse">✨</span>
            <h2 className="text-base font-bold text-white">AI Growth Insights</h2>
            <span className="ml-auto badge-nexa">Nexa AI</span>
          </div>
          <div className="space-y-3">
            {[
              { icon: '📈', text: 'Use Nexa AI daily — your AI Score grows with every interaction.' },
              { icon: '📸', text: 'Consistent Instagram content can increase customer engagement by up to 40%.' },
              { icon: '🎁', text: 'Create a weekend promotional campaign — high impact, low cost.' },
              { icon: '🔍', text: 'Run an SEO analysis now — location-based keywords drive local traffic.' },
            ].map((insight, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-xl insight-box">
                <span className="text-base mt-0.5 shrink-0">{insight.icon}</span>
                <p className="text-sm leading-relaxed text-gray-400">{insight.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-6 card-glass-subtle">
          <h2 className="text-base font-bold text-white mb-5">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-white/5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
                  style={{ background: `${item.color}20`, border: `1px solid ${item.color}30` }}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{item.text}</p>
                  <p className="text-xs mt-0.5 text-slate-600">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Business Profile */}
      {business && (
        <div className="rounded-2xl p-6 card-glass-subtle">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-white">Business Profile</h2>
            <button onClick={() => navigate('/settings')}
              className="text-xs px-3 py-1.5 rounded-lg transition-all hover:bg-white/5 border border-indigo-500/30 text-indigo-400">
              Edit Profile
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Category', value: business.businessCategory },
              { label: 'Goal', value: business.businessGoal },
              { label: 'Location', value: business.location || 'Not set' },
              { label: 'Audience', value: business.targetAudience },
            ].map((item, i) => (
              <div key={i} className="text-sm">
                <p className="text-xs mb-1 text-slate-600">{item.label}</p>
                <p className="font-semibold text-slate-200">{item.value || 'N/A'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
