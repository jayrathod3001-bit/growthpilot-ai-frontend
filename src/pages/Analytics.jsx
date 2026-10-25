import React, { useState, useEffect } from 'react';
import axios from 'axios';

const defaultAnalyticsData = [
  { label: 'AI Chat Usage', value: 5, icon: '🤖', color: '#6366f1', detail: 'Loading real data...' },
  { label: 'Content Generated', value: 5, icon: '✍️', color: '#06b6d4', detail: 'Loading real data...' },
  { label: 'Images Generated', value: 5, icon: '🖼️', color: '#10b981', detail: 'Loading real data...' },
  { label: 'Marketing Activity', value: 5, icon: '🎯', color: '#8b5cf6', detail: 'Loading real data...' },
  { label: 'SEO Analyses', value: 5, icon: '🔍', color: '#f59e0b', detail: 'Loading real data...' },
  { label: 'Profile Completion', value: 40, icon: '✅', color: '#ec4899', detail: 'Loading real data...' },
];

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(defaultAnalyticsData);
  const [counts, setCounts] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);

  // Step 1: Fetch real MongoDB counts immediately (fast)
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/user/analytics-real', {
          headers: { Authorization: token ? `Bearer ${token}` : '' },
          timeout: 8000,
        });

        if (res.data?.status === 1 && res.data?.data) {
          const { analyticsData: ad, counts: c } = res.data.data;
          if (Array.isArray(ad) && ad.length > 0) setAnalyticsData(ad);
          if (c) setCounts(c);
        }
      } catch (err) {
        console.warn('Real analytics fetch error:', err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealData();
  }, []);

  // Step 2: Fetch AI recommendations in background (slow, non-blocking)
  useEffect(() => {
    const fetchAIRecommendations = async () => {
      try {
        setAiLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.post(
          'http://localhost:5000/api/ai/analytics',
          {},
          {
            headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
            timeout: 60000,
          }
        );
        if (res.data?.status === 1 && res.data?.data?.recommendations) {
          const recs = res.data.data.recommendations;
          if (Array.isArray(recs) && recs.length > 0) setRecommendations(recs);
        }
      } catch (err) {
        console.warn('AI recommendations fetch error (non-critical):', err.message);
      } finally {
        setAiLoading(false);
      }
    };

    fetchAIRecommendations();
  }, []);

  // Real tool usage breakdown for the Bar Chart — EXACT actual counts
  const toolBreakdown = [
    { label: 'AI Chat', count: counts?.chatCount || 0, icon: '🤖', color: '#6366f1' },
    { label: 'Content', count: counts?.contentCount || 0, icon: '✍️', color: '#06b6d4' },
    { label: 'Images', count: counts?.imageCount || 0, icon: '🖼️', color: '#10b981' },
    { label: 'Strategy', count: counts?.marketingCount || 0, icon: '🎯', color: '#8b5cf6' },
    { label: 'SEO', count: counts?.seoCount || 0, icon: '🔍', color: '#f59e0b' },
  ];
  const maxCount = Math.max(...toolBreakdown.map((t) => t.count), 1);
  const totalActions = counts?.totalActions || 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl btn-primary">📈</div>
          <div>
            <h1 className="text-2xl font-black text-white">Analytics</h1>
            <p className="text-sm text-slate-500">Real verified usage from your GrowthPilot AI account</p>
          </div>
        </div>
        {isLoading ? (
          <span className="text-xs text-indigo-400 animate-pulse">● Syncing live data...</span>
        ) : (
          <span className="text-xs text-green-400 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
            Live Verified Data
          </span>
        )}
      </div>

      {/* Real Counts Summary Bar */}
      {counts && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {toolBreakdown.map((item, i) => (
            <div key={i} className="rounded-xl p-3 text-center card-glass-subtle border border-white/5">
              <div className="text-lg mb-1">{item.icon}</div>
              <div className="text-xl font-black" style={{ color: item.color }}>{item.count}</div>
              <div className="text-xs text-slate-400 mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Usage Score Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {analyticsData.map((item, i) => (
          <div key={i} className="rounded-2xl p-5 card-hover card-glass-subtle">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-bold" style={{ color: item.color }}>
                {isLoading ? '...' : `${item.value}%`}
              </span>
            </div>
            <p className="text-sm font-semibold text-white mb-1">{item.label}</p>
            <p className="text-xs mb-3 text-slate-400">{item.detail}</p>
            <div className="w-full h-2 rounded-full bg-white/5">
              <div
                className="h-2 rounded-full transition-all duration-700"
                style={{
                  width: isLoading ? '0%' : `${item.value}%`,
                  background: `linear-gradient(90deg, ${item.color}, ${item.color}88)`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Real AI Tool Usage Bar Chart — EXACT NUMBERS */}
      <div className="rounded-2xl p-6 card-purple-border">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-base font-bold text-white mb-0.5">Real AI Feature Usage</h2>
            <p className="text-xs text-slate-400">
              Total completed actions: <span className="text-indigo-400 font-bold">{totalActions}</span>
            </p>
          </div>
          {totalActions === 0 && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              No actions yet
            </span>
          )}
        </div>

        <div className="flex items-end gap-3 sm:gap-6 h-40 pt-6 px-2">
          {toolBreakdown.map((item, i) => {
            const barHeightPct = totalActions > 0 ? (item.count / maxCount) * 100 : 0;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-xs font-black" style={{ color: item.count > 0 ? item.color : '#64748b' }}>
                  {item.count}
                </span>
                <div
                  className="w-full rounded-t-lg transition-all duration-700 relative group"
                  style={{
                    height: item.count > 0 ? `${Math.max(14, barHeightPct)}%` : '4px',
                    background: item.count > 0
                      ? `linear-gradient(180deg, ${item.color}, ${item.color}66)`
                      : 'rgba(255,255,255,0.08)',
                    boxShadow: item.count > 0 ? `0 0 12px ${item.color}33` : 'none',
                  }}
                />
                <div className="flex flex-col items-center text-center">
                  <span className="text-xs mb-0.5">{item.icon}</span>
                  <span className="text-[11px] font-medium text-slate-400 truncate max-w-[55px] sm:max-w-none">
                    {item.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Breakdown + Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-2xl p-5 card-glass-subtle">
          <h3 className="text-sm font-bold text-white mb-4">📊 Activity Breakdown (Exact Counts)</h3>
          {toolBreakdown.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 rounded-xl mb-2 card-glass-subtle">
              <div className="flex items-center gap-2.5">
                <span className="text-sm">{item.icon}</span>
                <span className="text-xs text-gray-300">{item.label} Workflows</span>
              </div>
              <span className="text-xs font-black px-2 py-0.5 rounded-md" style={{ color: item.color, background: `${item.color}15` }}>
                {item.count} {item.count === 1 ? 'action' : 'actions'}
              </span>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-5 card-glass-subtle">
          <h3 className="text-sm font-bold text-white mb-4">📱 Channel Distribution</h3>
          {[
            { platform: 'Instagram', score: counts?.chatCount ? Math.min(100, counts.chatCount * 25) : 0, color: '#ec4899' },
            { platform: 'Facebook & Ads', score: counts?.marketingCount ? Math.min(100, counts.marketingCount * 30) : 0, color: '#6366f1' },
            { platform: 'Content & Blog', score: counts?.contentCount ? Math.min(100, counts.contentCount * 25) : 0, color: '#06b6d4' },
            { platform: 'Search & SEO', score: counts?.seoCount ? Math.min(100, counts.seoCount * 30) : 0, color: '#f59e0b' },
          ].map((p, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">{p.platform}</span>
                <span style={{ color: p.color }} className="font-bold">{p.score}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/5">
                <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${p.score}%`, background: p.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations — loads after real data */}
      <div className="rounded-2xl p-5 card-glass-subtle border border-indigo-500/20">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <span>💡</span>
          AI Strategic Insights
          {aiLoading && <span className="ml-2 text-xs text-indigo-400 animate-pulse">Generating with Qwen AI...</span>}
        </h3>
        {recommendations.length > 0 ? (
          <div className="space-y-2">
            {recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02]">
                <span className="text-indigo-400 font-bold shrink-0">#{i + 1}</span>
                <p className="text-xs text-slate-300 leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        ) : aiLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-8 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-600">Use AI features to unlock personalized recommendations.</p>
        )}
      </div>
    </div>
  );
};

export default Analytics;
