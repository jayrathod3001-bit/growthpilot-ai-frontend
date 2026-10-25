import React, { useState } from 'react';
import axios from 'axios';
import { startTask, finishTask, addHistoryEntry } from '../utils/taskManager';

const platforms = ['Instagram', 'Facebook', 'WhatsApp', 'Google Ads', 'YouTube', 'Twitter'];
const durations = ['7 Days', '14 Days', '30 Days', '60 Days', '90 Days'];
const occasions = ['Regular Campaign', 'Festival Sale', 'Product Launch', 'Wedding Season', 'New Year', 'Diwali', 'Valentine\'s Day'];
const audiences = ['Local Customers', 'Online Customers', 'Young Audience (18-25)', 'Professionals', 'Families', 'Bridal Market'];

const industryTemplates = [
  {
    icon: '🍕',
    name: 'Restaurant / Café',
    product: 'Specialty Dine-in & Beverages',
    goal: 'Increase Weekend Footfall & Online Orders',
    audience: 'Local Customers',
    platform: 'Instagram',
    duration: '30 Days',
    budget: '₹15,000 / month',
    occasion: 'Regular Campaign',
    additionalInfo: 'Focus on food aesthetics, Reels, and Google My Business reviews',
  },
  {
    icon: '🛍️',
    name: 'E-Commerce Store',
    product: 'Trendy Fashion & Accessories',
    goal: 'Boost Online Sales & Conversions',
    audience: 'Young Audience (18-25)',
    platform: 'Instagram',
    duration: '30 Days',
    budget: '₹25,000 / month',
    occasion: 'Festival Sale',
    additionalInfo: 'Run influencer promos and WhatsApp abandoned cart reminders',
  },
  {
    icon: '🏋️',
    name: 'Gym & Fitness',
    product: 'Personal Training & Memberships',
    goal: 'Sign up 40+ New Annual Memberships',
    audience: 'Professionals',
    platform: 'Facebook',
    duration: '60 Days',
    budget: '₹20,000 / month',
    occasion: 'New Year',
    additionalInfo: 'Showcase client transformation results and free trial day passes',
  },
  {
    icon: '🏥',
    name: 'Clinic & Healthcare',
    product: 'Consultation & Wellness Packages',
    goal: 'Build Local Trust & Book Patient Appointments',
    audience: 'Families',
    platform: 'Google Ads',
    duration: '90 Days',
    budget: '₹18,000 / month',
    occasion: 'Regular Campaign',
    additionalInfo: 'Doctor educational tips, hygiene standards, and verified testimonials',
  },
  {
    icon: '✂️',
    name: 'Salon & Beauty',
    product: 'Hair Spa, Facial & Bridal Makeup',
    goal: 'Fill Weekday Bookings & Bridal Packages',
    audience: 'Bridal Market',
    platform: 'Instagram',
    duration: '30 Days',
    budget: '₹12,000 / month',
    occasion: 'Wedding Season',
    additionalInfo: 'Before/after transformation reels and limited-time discount vouchers',
  },
];

const printStrategyPDF = (strat, formInputs) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${strat?.title || 'Marketing Strategy'} - GrowthPilot AI</title>
        <style>
          @page { size: A4; margin: 15mm; }
          body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.5; padding: 0; margin: 0; background: #fff; }
          .header { border-bottom: 2px solid #6366f1; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
          .logo { font-size: 22px; font-weight: 900; color: #4338ca; }
          .logo span { color: #f59e0b; }
          .report-tag { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 1px; }
          h1 { font-size: 20px; margin: 0 0 4px 0; color: #0f172a; font-weight: 800; }
          .meta-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; }
          .meta-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; }
          .meta-box span { font-size: 10px; text-transform: uppercase; font-weight: 700; color: #64748b; display: block; margin-bottom: 3px; }
          .meta-box strong { font-size: 13px; color: #0f172a; }
          .section-title { font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #4338ca; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin: 24px 0 12px 0; }
          .roadmap-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
          .week-card { border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; background: #fafafa; }
          .week-header { font-size: 12px; font-weight: 800; color: #b45309; margin-bottom: 6px; display: flex; justify-content: space-between; }
          ul { margin: 0; padding-left: 18px; font-size: 12px; color: #334155; }
          li { margin-bottom: 4px; }
          .footer { margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 10px; text-align: center; font-size: 10px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">GrowthPilot <span>AI</span></div>
            <div class="report-tag">Executive Tactical Marketing Roadmap</div>
          </div>
          <div style="text-align: right; font-size: 11px; color: #64748b;">
            Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>

        <h1>${strat?.title || 'Growth Campaign Strategy'}</h1>
        <p style="font-size: 12px; color: #64748b; margin-top: 0; margin-bottom: 16px;">Product/Service: <strong>${formInputs?.product || 'Business'}</strong> • Target Platform: <strong>${formInputs?.platform || 'Social Media'}</strong></p>

        <div class="meta-grid">
          <div class="meta-box">
            <span>Primary Goal</span>
            <strong>${strat?.goal || formInputs?.marketingGoal || 'Growth'}</strong>
          </div>
          <div class="meta-box">
            <span>Target Audience</span>
            <strong>${strat?.targetAudience || formInputs?.targetAudience || 'Target Customers'}</strong>
          </div>
          <div class="meta-box">
            <span>Allocated Budget</span>
            <strong>${strat?.budget || formInputs?.budget || 'Custom'}</strong>
          </div>
        </div>

        <div class="section-title">📅 Multi-Week Execution Schedule</div>
        <div class="roadmap-grid">
          ${(strat?.weeks || []).map((w, idx) => `
            <div class="week-card">
              <div class="week-header">
                <span>${w.week || `Week ${idx + 1}`}</span>
                <span style="color: #0f172a;">${w.theme || 'Execution'}</span>
              </div>
              <ul>
                ${(w.activities || []).map(act => `<li>${act}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>

        <div class="section-title">🎯 Content Strategy & Key Performance Indicators (KPIs)</div>
        <div class="roadmap-grid">
          <div class="week-card">
            <div class="week-header" style="color: #4338ca;">High-Converting Content Hooks</div>
            <ul>
              ${(strat?.contentIdeas || []).map(c => `<li>${c}</li>`).join('')}
            </ul>
          </div>
          <div class="week-card">
            <div class="week-header" style="color: #059669;">Target Success Metrics (KPIs)</div>
            <ul>
              ${(strat?.kpis || []).map(k => `<li>${k}</li>`).join('')}
            </ul>
          </div>
        </div>

        <div class="footer">
          Generated automatically by <strong>GrowthPilot AI</strong> • Free AI Platform for Business Growth • Confidential & Proprietary Roadmap
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `;
  printWindow.document.write(html);
  printWindow.document.close();
};

const generateStrategy = (form) => ({
  title: `${form.duration || '30 Days'} ${form.product || 'Business'} Growth Campaign`,
  targetAudience: `${form.targetAudience || 'Customers'} with a focus on ${form.platform || 'Social Media'} users`,
  platforms: [form.platform || 'Instagram', 'WhatsApp', 'Facebook'],
  budget: form.budget,
  goal: form.marketingGoal,
  weeks: [
    {
      week: 'Week 1',
      theme: 'Brand Awareness',
      activities: [
        `Post 5 high-quality ${form.product || 'product'} photos on ${form.platform || 'Instagram'}`,
        'Write compelling captions with trending hashtags',
        'Set up business profile optimization',
      ],
    },
    {
      week: 'Week 2',
      theme: 'Product Showcase',
      activities: [
        `Create 3 Reels showcasing ${form.product || 'your products'} in detail`,
        'Go live once on Instagram/Facebook',
        'Share behind-the-scenes content',
      ],
    },
    {
      week: 'Week 3',
      theme: 'Customer Testimonials',
      activities: [
        'Share 2 customer testimonials/reviews',
        'Run an engagement poll or Q&A',
        'Collaborate with a local micro-influencer',
      ],
    },
    {
      week: 'Week 4',
      theme: 'Promotional Campaign',
      activities: [
        `Launch a ${form.occasion || 'special'} promotional offer`,
        'Run a paid ad campaign (₹500-1000/day)',
        'Send WhatsApp broadcasts to existing customers',
      ],
    },
  ],
  contentIdeas: [
    `5 ${form.platform || 'Instagram'} posts with product photography`,
    '3 short video Reels with background music',
    '2 customer testimonial posts',
    '1 promotional campaign with offer countdown',
    'WhatsApp broadcast message template',
  ],
  kpis: [
    'Target: 500+ new followers in 30 days',
    'Goal: 50+ inquiries per week',
    'Aim: 25% increase in website/store visits',
    'Target: 10+ positive reviews',
  ],
});

const MarketingStrategy = () => {
  const [form, setForm] = useState(() => {
    try {
      const saved = sessionStorage.getItem('gp_active_marketing_strategy');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          if (parsed.form) return parsed.form;
          if (parsed.inputs) return parsed.inputs;
        }
      }
    } catch {}
    return {
      marketingGoal: '',
      budget: '',
      targetAudience: '',
      platform: '',
      duration: '',
      product: '',
      occasion: '',
      additionalInfo: '',
    };
  });
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(() => {
    try {
      const saved = sessionStorage.getItem('gp_active_marketing_strategy');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          if (parsed.result) return parsed.result;
          if (parsed.weeks || parsed.title) return parsed;
        } else if (typeof parsed === 'string') {
          return parsed;
        }
      }
    } catch {}
    return null;
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.marketingGoal?.trim()) {
      newErrors.marketingGoal = 'Marketing goal is required';
    }
    if (!form.budget?.trim()) {
      newErrors.budget = 'Budget is required';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsGenerating(true);

    const taskId = `marketing_${Date.now()}`;
    startTask(taskId, `Marketing Strategy: ${form.marketingGoal.slice(0, 40)}`);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/ai/marketing-strategy', form, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        timeout: 60000,
      });

      const strategyData = (res.data?.status === 1 && res.data?.data) ? res.data.data : generateStrategy(form);
      setResult(strategyData);

      addHistoryEntry({
        type: 'marketing-strategy',
        icon: '🎯',
        title: `Strategy: ${form.marketingGoal.slice(0, 45)}`,
        summary: `${form.duration || '30 Days'} campaign for ${form.platform || 'Social Media'} — Budget: ${form.budget}`,
        path: '/marketing-strategy',
        color: '#f59e0b',
        data: { form, result: strategyData },
      });

      finishTask(taskId, {
        icon: '🎯',
        title: 'Strategy Plan Compiled',
        text: 'Your tailored marketing campaign roadmap is ready for execution.',
        color: '#f59e0b',
      });
    } catch (err) {
      console.error('Marketing Strategy AI error:', err);
      const strategyData = generateStrategy(form);
      setResult(strategyData);

      addHistoryEntry({
        type: 'marketing-strategy',
        icon: '🎯',
        title: `Strategy: ${form.marketingGoal.slice(0, 45)}`,
        summary: `${form.duration || '30 Days'} campaign — Budget: ${form.budget}`,
        path: '/marketing-strategy',
        color: '#f59e0b',
        data: { form, result: strategyData },
      });

      finishTask(taskId, {
        icon: '🎯',
        title: 'Strategy Plan Compiled',
        text: 'Your tailored marketing campaign roadmap is ready for execution.',
        color: '#f59e0b',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const [copiedStrategy, setCopiedStrategy] = useState(false);

  const handleCopyStrategy = () => {
    if (!result) return;
    if (typeof result === 'string') {
      navigator.clipboard.writeText(result);
      setCopiedStrategy(true);
      setTimeout(() => setCopiedStrategy(false), 2000);
      return;
    }
    const weeksArr = Array.isArray(result.weeks) ? result.weeks : [];
    const contentArr = Array.isArray(result.contentIdeas) ? result.contentIdeas : [];
    const kpisArr = Array.isArray(result.kpis) ? result.kpis : [];

    const text = `MARKETING STRATEGY: ${result.title || 'Growth Campaign'}
Target Audience: ${result.targetAudience || 'Not specified'}
Budget: ${result.budget || 'Not specified'}
Primary Goal: ${result.goal || 'Not specified'}

CAMPAIGN SCHEDULE:
${weeksArr.map(w => `${w.week || ''} (${w.theme || ''}):\n` + (Array.isArray(w.activities) ? w.activities.map(a => ` - ${a}`).join('\n') : '')).join('\n\n')}

CONTENT PLAN:
${contentArr.map(c => ` - ${c}`).join('\n')}

SUCCESS TARGETS:
${kpisArr.map(k => ` - ${k}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopiedStrategy(true);
    setTimeout(() => setCopiedStrategy(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 logo-badge text-2xl">
          🎯
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Marketing Strategy</h1>
          <p className="text-sm text-slate-500">Generate a complete, week-by-week marketing campaign</p>
        </div>
      </div>

      <div className="rounded-2xl p-6 card-purple-border">
        {/* 1-Click Industry Templates */}
        <div className="mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <span>⚡</span> 1-Click Industry Presets (Auto-fills form)
            </span>
            <span className="text-[11px] text-slate-400">Click to load tailored business settings</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {industryTemplates.map((tmpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setForm({
                    product: tmpl.product,
                    marketingGoal: tmpl.goal,
                    targetAudience: tmpl.audience,
                    platform: tmpl.platform,
                    duration: tmpl.duration,
                    budget: tmpl.budget,
                    occasion: tmpl.occasion,
                    additionalInfo: tmpl.additionalInfo,
                  });
                  setErrors({});
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 text-slate-200 hover:text-amber-300 transition-all flex items-center gap-1.5"
              >
                <span>{tmpl.icon}</span>
                <span>{tmpl.name}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 gap-5" noValidate>
          <div>
            <label className="form-label-xs">Marketing Goal *</label>
            <input
              type="text"
              name="marketingGoal"
              value={form.marketingGoal}
              onChange={handleChange}
              placeholder="e.g. Increase online sales by 30%"
              className={`w-full px-4 py-3 text-sm form-input ${errors.marketingGoal ? 'border border-red-500' : ''}`}
            />
            {errors.marketingGoal && (
              <p className="text-red-500 text-xs mt-1.5">{errors.marketingGoal}</p>
            )}
          </div>

          <div>
            <label className="form-label-xs">Budget *</label>
            <input
              type="text"
              name="budget"
              value={form.budget}
              onChange={handleChange}
              placeholder="e.g. ₹10,000/month"
              className={`w-full px-4 py-3 text-sm form-input ${errors.budget ? 'border border-red-500' : ''}`}
            />
            {errors.budget && (
              <p className="text-red-500 text-xs mt-1.5">{errors.budget}</p>
            )}
          </div>

          <div>
            <label className="form-label-xs">Target Audience</label>
            <select name="targetAudience" value={form.targetAudience} onChange={handleChange}
              className="w-full px-4 py-3 text-sm form-input">
              <option value="">Select Audience</option>
              {audiences.map(a => <option key={a} value={a} className="bg-[#1e1e3a] text-white">{a}</option>)}
            </select>
          </div>

          <div>
            <label className="form-label-xs">Primary Platform</label>
            <select name="platform" value={form.platform} onChange={handleChange}
              className="w-full px-4 py-3 text-sm form-input">
              <option value="">Select Platform</option>
              {platforms.map(p => <option key={p} value={p} className="bg-[#1e1e3a] text-white">{p}</option>)}
            </select>
          </div>

          <div>
            <label className="form-label-xs">Campaign Duration</label>
            <select name="duration" value={form.duration} onChange={handleChange}
              className="w-full px-4 py-3 text-sm form-input">
              <option value="">Select Duration</option>
              {durations.map(d => <option key={d} value={d} className="bg-[#1e1e3a] text-white">{d}</option>)}
            </select>
          </div>

          <div>
            <label className="form-label-xs">Product / Service</label>
            <input type="text" name="product" value={form.product} onChange={handleChange}
              placeholder="e.g. Gold Jewellery, Cafe Menu"
              className="w-full px-4 py-3 text-sm form-input" />
          </div>

          <div>
            <label className="form-label-xs">Campaign Occasion</label>
            <select name="occasion" value={form.occasion} onChange={handleChange}
              className="w-full px-4 py-3 text-sm form-input">
              <option value="">Select Occasion</option>
              {occasions.map(o => <option key={o} value={o} className="bg-[#1e1e3a] text-white">{o}</option>)}
            </select>
          </div>

          <div>
            <label className="form-label-xs">Additional Information</label>
            <input type="text" name="additionalInfo" value={form.additionalInfo} onChange={handleChange}
              placeholder="Any special requirements..."
              className="w-full px-4 py-3 text-sm form-input" />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isGenerating}
              className={`w-full py-4 rounded-xl font-bold text-white text-base transition-all btn-primary ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isGenerating ? '⏳ Formulating Strategic Roadmap...' : '🎯 Generate Marketing Strategy'}
            </button>
          </div>
        </form>
      </div>

      {result && (
        <div className="rounded-2xl p-6 space-y-6 insight-box border border-amber-500/30 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-xl shrink-0">
                🎯
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-white">{result?.title || 'Growth Campaign Strategy'}</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                    Executive Strategy
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Verified Multi-Week Tactical Campaign Roadmap</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => printStrategyPDF(result, form)}
                className="text-xs px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 hover:text-white transition-all flex items-center gap-1.5 font-bold shrink-0"
              >
                <span>🖨️</span> Download PDF Report
              </button>
              <button
                onClick={handleCopyStrategy}
                className="text-xs px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 font-semibold shrink-0"
              >
                {copiedStrategy ? '✓ Strategy Copied!' : '📋 Copy Text'}
              </button>
            </div>
          </div>

          {typeof result === 'string' ? (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-slate-300 whitespace-pre-line text-sm leading-relaxed">
              {result}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Target Audience', value: result?.targetAudience, icon: '👥', color: '#6366f1' },
                  { label: 'Budget Allocated', value: result?.budget, icon: '💰', color: '#10b981' },
                  { label: 'Primary Objective', value: result?.goal, icon: '🎯', color: '#f59e0b' },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                    <span className="text-xl p-2 rounded-lg bg-white/5 shrink-0">{item.icon}</span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{item.label}</p>
                      <p className="text-sm font-bold text-white mt-0.5 truncate">{item.value || 'Not specified'}</p>
                    </div>
                  </div>
                ))}
              </div>

              {Array.isArray(result?.weeks) && result.weeks.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                      <span>📅</span> Execution Schedule by Phases
                    </h3>
                    <span className="text-[11px] text-slate-500">{result.weeks.length} Weeks Roadmap</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.weeks.map((week, i) => (
                      <div key={i} className="p-4 rounded-xl card-glass-subtle border border-white/5 hover:border-amber-500/30 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/25">
                            {week?.week || `Week ${i + 1}`}
                          </span>
                          <span className="text-xs font-bold text-white tracking-wide">{week?.theme || 'Action Plan'}</span>
                        </div>
                        <ul className="space-y-2">
                          {(Array.isArray(week?.activities) ? week.activities : []).map((activity, j) => (
                            <li key={j} className="text-xs flex items-start gap-2 text-slate-300 leading-relaxed">
                              <span className="text-amber-400 font-bold shrink-0 mt-0.5">▪</span>
                              <span>{activity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.isArray(result?.contentIdeas) && result.contentIdeas.length > 0 && (
                  <div className="p-5 rounded-xl card-glass-subtle border border-white/5">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3 flex items-center gap-1.5">
                      <span>📝</span> High-Converting Content Hooks
                    </h3>
                    <ul className="space-y-2.5">
                      {result.contentIdeas.map((idea, i) => (
                        <li key={i} className="text-xs flex items-start gap-2.5 text-slate-300 leading-relaxed bg-white/5 p-2.5 rounded-lg border border-white/5">
                          <span className="text-emerald-400 font-bold shrink-0">✓</span>
                          <span>{idea}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {Array.isArray(result?.kpis) && result.kpis.length > 0 && (
                  <div className="p-5 rounded-xl card-glass-subtle border border-white/5">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3 flex items-center gap-1.5">
                      <span>📊</span> Key Performance Indicators (KPIs)
                    </h3>
                    <ul className="space-y-2.5">
                      {result.kpis.map((kpi, i) => (
                        <li key={i} className="text-xs flex items-start gap-2.5 text-slate-300 leading-relaxed bg-white/5 p-2.5 rounded-lg border border-white/5">
                          <span className="text-amber-400 shrink-0">⭐</span>
                          <span className="font-medium">{kpi}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MarketingStrategy;
