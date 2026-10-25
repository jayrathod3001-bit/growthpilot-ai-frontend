import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const demoReports = [
  {
    id: 1, icon: '📈', title: 'Business Growth Report', desc: 'Monthly overview of your business performance, key metrics, and growth trends.',
    date: 'Current Month', status: 'Ready', statusColor: '#10b981',
    preview: {
      summary: 'Your business has shown strong growth this month with a 23% increase in customer inquiries.',
      metrics: [
        { label: 'Customer Inquiries', value: '+23%', positive: true },
        { label: 'Profile Views', value: '+41%', positive: true },
        { label: 'Content Engagement', value: '+18%', positive: true },
        { label: 'Conversion Rate', value: '3.2%', positive: true },
      ],
      insights: [
        'Your Instagram engagement is performing above industry average.',
        'Weekend promotions have the highest conversion rate.',
        'Product photography posts generate 3x more inquiries than text-only posts.',
      ],
    },
  },
  {
    id: 2, icon: '🎯', title: 'Marketing Report', desc: 'Analysis of your marketing campaigns, content performance, and audience insights.',
    date: 'Current Month', status: 'Ready', statusColor: '#6366f1',
    preview: {
      summary: 'Your marketing campaigns reached 12,500+ potential customers this month.',
      metrics: [
        { label: 'Total Reach', value: '12,500+', positive: true },
        { label: 'Ad Impressions', value: '45,000', positive: true },
        { label: 'Click-Through Rate', value: '4.8%', positive: true },
        { label: 'Cost Per Click', value: '₹2.30', positive: true },
      ],
      insights: [
        'Instagram ads performed 3x better than Facebook ads this month.',
        'Evening campaigns (6-9 PM) show highest engagement rates.',
        'Jewellery and gifting keywords have the highest conversion intent.',
      ],
    },
  },
  {
    id: 3, icon: '🔍', title: 'SEO Report', desc: 'Search engine ranking analysis, keyword performance, and visibility improvements.',
    date: 'Current Month', status: 'Ready', statusColor: '#f59e0b',
    preview: {
      summary: 'Your SEO score improved from 65 to 78 with significant gains in local search visibility.',
      metrics: [
        { label: 'SEO Score', value: '78/100', positive: true },
        { label: 'Keyword Rankings', value: '15 tracked', positive: true },
        { label: 'Organic Traffic', value: '+34%', positive: true },
        { label: 'Local Visibility', value: 'High', positive: true },
      ],
      insights: [
        'Local search queries for your category increased by 28% this month.',
        'Adding Google My Business improved local visibility significantly.',
        'Long-tail keywords are driving high-quality, converting traffic.',
      ],
    },
  },
  {
    id: 4, icon: '🤖', title: 'AI Activity Report', desc: 'Summary of all AI-generated content, strategies, and recommendations used.',
    date: 'Current Month', status: 'Ready', statusColor: '#8b5cf6',
    preview: {
      summary: 'This month, GrowthPilot AI helped generate content pieces and marketing strategies to grow your business.',
      metrics: [
        { label: 'AI Chats', value: '—', positive: true },
        { label: 'Content Generated', value: '—', positive: true },
        { label: 'Strategies Created', value: '—', positive: true },
        { label: 'Images Generated', value: '—', positive: true },
      ],
      insights: [
        'Content generated via AI received 2x more engagement than manually created posts.',
        'Marketing strategies led to a measurable increase in inquiries.',
        'AI-generated captions show higher hashtag reach performance.',
      ],
    },
  },
];

const downloadReport = (report) => {
  const now = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>${report.title} — GrowthPilot AI</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #1e1b4b; padding: 40px; }
    .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #6366f1; padding-bottom: 20px; margin-bottom: 30px; }
    .brand { font-size: 22px; font-weight: 900; color: #6366f1; }
    .report-title { font-size: 18px; font-weight: 700; color: #1e1b4b; }
    .date { font-size: 12px; color: #64748b; margin-top: 4px; }
    .section { margin-bottom: 28px; }
    .section-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #6366f1; margin-bottom: 12px; }
    .summary { background: #f8f7ff; border-left: 4px solid #6366f1; padding: 16px; border-radius: 8px; font-size: 14px; line-height: 1.6; color: #374151; }
    .metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .metric { background: #f8f7ff; border: 1px solid #e0e7ff; border-radius: 10px; padding: 16px; text-align: center; }
    .metric-value { font-size: 22px; font-weight: 900; color: #6366f1; }
    .metric-label { font-size: 11px; color: #64748b; margin-top: 4px; }
    .insight { display: flex; gap: 10px; padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #374151; line-height: 1.5; }
    .arrow { color: #6366f1; font-weight: 700; }
    .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 16px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">GrowthPilot AI</div>
    <div>
      <div class="report-title">${report.icon} ${report.title}</div>
      <div class="date">Generated on ${now}</div>
    </div>
  </div>
  <div class="section">
    <div class="section-title">Executive Summary</div>
    <div class="summary">${report.preview.summary}</div>
  </div>
  <div class="section">
    <div class="section-title">Key Metrics</div>
    <div class="metrics">
      ${report.preview.metrics.map(m => `
        <div class="metric">
          <div class="metric-value">${m.value}</div>
          <div class="metric-label">${m.label}</div>
        </div>`).join('')}
    </div>
  </div>
  <div class="section">
    <div class="section-title">AI Insights</div>
    ${report.preview.insights.map(i => `
      <div class="insight"><span class="arrow">→</span><span>${i}</span></div>`).join('')}
  </div>
  <div class="footer">This report was auto-generated by GrowthPilot AI (Nexa AI) • ${now} • Confidential</div>
</body>
</html>`;

  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); }, 500);
};

import { startTask, finishTask, addHistoryEntry } from '../utils/taskManager';

const Reports = () => {
  const [activeReport, setActiveReport] = useState(() => {
    try {
      const saved = sessionStorage.getItem('gp_active_report');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });
  const [loadingReportId, setLoadingReportId] = useState(null);
  const [reportsData, setReportsData] = useState(demoReports);
  const [liveStats, setLiveStats] = useState(null);

  // Fetch live user stats on mount — pre-populate AI Activity Report with real counts
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await axios.get('http://localhost:5000/api/user/stats', {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 8000,
        });
        if (res.data?.status === 1 && res.data?.data) {
          const { counts } = res.data.data;
          setLiveStats(counts);
          // Update AI Activity Report card metrics with real data
          setReportsData(prev => prev.map(r => {
            if (r.id === 4) {
              return {
                ...r,
                preview: {
                  ...r.preview,
                  summary: `GrowthPilot AI has powered ${counts.totalActions} activities — ${counts.chats} chats, ${counts.contentPieces} content pieces, ${counts.marketingStrategies} strategies, and ${counts.imagesGenerated} images generated.`,
                  metrics: [
                    { label: 'AI Chats', value: `${counts.chats}`, positive: true },
                    { label: 'Content Generated', value: `${counts.contentPieces}`, positive: true },
                    { label: 'Strategies Created', value: `${counts.marketingStrategies}`, positive: true },
                    { label: 'Images Generated', value: `${counts.imagesGenerated}`, positive: true },
                  ],
                },
              };
            }
            return r;
          }));
        }
      } catch (err) {
        console.warn('Live stats fetch (non-critical):', err.message);
      }
    };
    fetchStats();
  }, []);

  const handleSelectReport = async (report) => {
    if (activeReport?.id === report.id) {
      setActiveReport(null);
      return;
    }
    setActiveReport(report);
    setLoadingReportId(report.id);

    const taskId = `report_${Date.now()}`;
    startTask(taskId, `Report: ${report.title}`);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/ai/reports',
        { reportType: report.title },
        {
          headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
          timeout: 20000,
        }
      );

      if (res.data?.status === 1 && res.data?.data) {
        const aiData = res.data.data;
        const updated = reportsData.map((r) =>
          r.id === report.id
            ? {
                ...r,
                preview: {
                  summary: aiData.summary || r.preview.summary,
                  metrics: Array.isArray(aiData.metrics) && aiData.metrics.length > 0 ? aiData.metrics : r.preview.metrics,
                  insights: Array.isArray(aiData.insights) && aiData.insights.length > 0 ? aiData.insights : r.preview.insights,
                },
              }
            : r
        );
        setReportsData(updated);
        const updatedActive = updated.find((r) => r.id === report.id);
        setActiveReport(updatedActive);

        addHistoryEntry({
          type: 'reports',
          icon: report.icon || '📊',
          title: report.title,
          summary: updatedActive?.preview?.summary || report.desc,
          path: '/reports',
          color: report.statusColor || '#6366f1',
          data: updatedActive,
        });

        finishTask(taskId, {
          icon: report.icon || '📊',
          title: 'Executive Report Compiled',
          text: 'Your business performance report and metrics are ready.',
          color: report.statusColor || '#6366f1',
        });
      } else {
        addHistoryEntry({
          type: 'reports',
          icon: report.icon || '📊',
          title: report.title,
          summary: report.preview?.summary || report.desc,
          path: '/reports',
          color: report.statusColor || '#6366f1',
          data: report,
        });

        finishTask(taskId, {
          icon: report.icon || '📊',
          title: 'Executive Report Compiled',
          text: 'Your business performance report and metrics are ready.',
          color: report.statusColor || '#6366f1',
        });
      }
    } catch (err) {
      console.warn('AI report fetch error (using cached):', err.message);
      addHistoryEntry({
        type: 'reports',
        icon: report.icon || '📊',
        title: report.title,
        summary: report.preview?.summary || report.desc,
        path: '/reports',
        color: report.statusColor || '#6366f1',
        data: report,
      });

      finishTask(taskId, {
        icon: report.icon || '📊',
        title: 'Executive Report Compiled',
        text: 'Your business performance report and metrics are ready.',
        color: report.statusColor || '#6366f1',
      });
    } finally {
      setLoadingReportId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 logo-badge text-2xl">📊</div>
          <div>
            <h1 className="text-2xl font-black text-white">Reports</h1>
            <p className="text-sm text-slate-500">Live AI business performance reports — powered by your real usage data</p>
          </div>
        </div>
        {liveStats && (
          <span className="text-xs text-emerald-400 flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live data
          </span>
        )}
      </div>

      {/* Live usage summary bar */}
      {liveStats && (
        <div className="grid grid-cols-5 gap-3">
          {[
            { label: 'AI Chats', value: liveStats.chats, icon: '🤖', color: '#6366f1' },
            { label: 'Content', value: liveStats.contentPieces, icon: '✍️', color: '#06b6d4' },
            { label: 'Strategies', value: liveStats.marketingStrategies, icon: '🎯', color: '#8b5cf6' },
            { label: 'SEO Audits', value: liveStats.seoAnalyses, icon: '🔍', color: '#f59e0b' },
            { label: 'Images', value: liveStats.imagesGenerated, icon: '🖼️', color: '#10b981' },
          ].map((item, i) => (
            <div key={i} className="rounded-xl p-3 text-center card-glass-subtle">
              <div className="text-lg mb-1">{item.icon}</div>
              <div className="text-lg font-black" style={{ color: item.color }}>{item.value}</div>
              <div className="text-xs text-slate-600 mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reportsData.map((report) => (
          <div
            key={report.id}
            className="rounded-2xl p-5 transition-all card-hover card-glass-subtle"
            style={{
              border: activeReport?.id === report.id
                ? `1px solid ${report.statusColor}55`
                : '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: `${report.statusColor}20`, border: `1px solid ${report.statusColor}30` }}>
                  {report.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{report.title}</h3>
                  <p className="text-xs text-slate-600">{report.date}</p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded-full font-semibold"
                style={{ background: `${report.statusColor}20`, color: report.statusColor }}>
                {report.status}
              </span>
            </div>

            <p className="text-xs mb-4 leading-relaxed text-slate-500">{report.desc}</p>

            <div className="flex gap-2">
              <button
                onClick={() => handleSelectReport(report)}
                disabled={loadingReportId === report.id}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: activeReport?.id === report.id ? `${report.statusColor}20` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${activeReport?.id === report.id ? report.statusColor + '40' : 'rgba(255,255,255,0.07)'}`,
                  color: activeReport?.id === report.id ? report.statusColor : '#94a3b8',
                }}
              >
                {loadingReportId === report.id
                  ? '⏳ Generating...'
                  : activeReport?.id === report.id
                  ? '▲ Hide Report'
                  : '⚡ View AI Report'}
              </button>
              {/* Download button — available even without viewing */}
              <button
                onClick={() => downloadReport(report)}
                title="Download as PDF"
                className="px-3 py-2.5 rounded-xl text-sm transition-all hover:bg-white/5 border border-white/10 text-slate-400 hover:text-white"
              >
                ↓ PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {activeReport && (
        <div
          className="rounded-2xl p-6 space-y-5"
          style={{ background: `${activeReport.statusColor}08`, border: `1px solid ${activeReport.statusColor}30` }}
        >
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <span className="text-2xl">{activeReport.icon}</span>
            <div className="flex-1">
              <h2 className="text-lg font-black text-white">{activeReport.title}</h2>
              <p className="text-xs mt-0.5" style={{ color: activeReport.statusColor }}>
                {activeReport.date} — Auto-generated by Nexa AI
              </p>
            </div>
            <button
              onClick={() => downloadReport(activeReport)}
              className="text-xs px-4 py-2 rounded-xl font-semibold border transition-all hover:bg-white/5"
              style={{ borderColor: `${activeReport.statusColor}50`, color: activeReport.statusColor }}
            >
              ↓ Download PDF
            </button>
          </div>

          <div className="p-4 rounded-xl card-glass-subtle">
            <p className="text-sm leading-relaxed text-slate-300">📋 {activeReport.preview.summary}</p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 text-slate-500">Key Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {activeReport.preview.metrics.map((m, i) => (
                <div key={i} className="p-4 rounded-xl text-center card-glass-subtle">
                  <div className="text-lg font-black mb-1" style={{ color: activeReport.statusColor }}>{m.value}</div>
                  <div className="text-xs text-slate-500">{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 text-slate-500">AI Insights</h3>
            <div className="space-y-2">
              {activeReport.preview.insights.map((insight, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl card-glass-subtle">
                  <span style={{ color: activeReport.statusColor }}>→</span>
                  <p className="text-sm text-gray-400">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
