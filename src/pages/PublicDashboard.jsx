import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

const features = [
  {
    icon: '🤖',
    title: 'Nexa AI Business Assistant',
    desc: 'Chat with Nexa AI for personalized business advice, competitive audits, and instant strategic problem-solving.',
    color: '#6366f1',
    link: '/features',
  },
  {
    icon: '🎯',
    title: 'Marketing Strategy Engine',
    desc: 'Generate complete, week-by-week marketing campaigns and growth calendars tailored to your exact industry.',
    color: '#8b5cf6',
    link: '/features',
  },
  {
    icon: '✍️',
    title: 'AI Content Studio',
    desc: 'Create captivating Instagram captions, LinkedIn articles, high-CTR ad headlines, and sales copy in seconds.',
    color: '#06b6d4',
    link: '/features',
  },
  {
    icon: '🖼️',
    title: 'AI Creative Image Generator',
    desc: 'Generate professional product visuals, digital ad banners, and promotional artwork powered by diffusion models.',
    color: '#10b981',
    link: '/features',
  },
  {
    icon: '🔍',
    title: 'SEO Assistant & Audit',
    desc: 'Analyze domain health and uncover high-ranking, low-competition keywords to dominate Google search organically.',
    color: '#f59e0b',
    link: '/features',
  },
  {
    icon: '📊',
    title: 'Live Business Health & Scores',
    desc: 'Track your AI score, marketing performance, and growth metrics in real-time with automated feedback.',
    color: '#ec4899',
    link: '/features',
  },
];

const industries = [
  { id: 'ecommerce', label: 'E-Commerce / D2C', base: 74, multiplier: 2.8, advice: 'High potential for automated Instagram campaigns & visual product ads.' },
  { id: 'saas', label: 'B2B Software / SaaS', base: 78, multiplier: 3.2, advice: 'Massive opportunity in LinkedIn thought leadership & technical SEO keywords.' },
  { id: 'local', label: 'Retail & Local Services', base: 68, multiplier: 2.4, advice: 'Boost local search rankings and daily promotional WhatsApp & Google Business posts.' },
  { id: 'agency', label: 'Marketing Agency / Freelancer', base: 82, multiplier: 3.5, advice: 'Scale multi-client deliverables 10x faster using our automated strategy engine.' },
  { id: 'creator', label: 'Creator / Coaching', base: 72, multiplier: 2.9, advice: 'Accelerate audience conversion with daily viral content hooks and email newsletters.' },
];

const PublicDashboard = () => {
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState(null);

  // Live Score Calculator State
  const [selectedIndustry, setSelectedIndustry] = useState(industries[0].id);
  const [budgetTier, setBudgetTier] = useState(2); // 1 = Low, 2 = Medium, 3 = High, 4 = Enterprise
  const [postFrequency, setPostFrequency] = useState(2); // 0 = Rare, 1 = 2-3/wk, 2 = Daily, 3 = Multi-daily
  const [hasWebsite, setHasWebsite] = useState(true);

  // Dynamic Live Score Calculation
  const liveScoreData = useMemo(() => {
    const ind = industries.find((i) => i.id === selectedIndustry) || industries[0];
    let score = ind.base;

    score += (budgetTier - 2) * 4;
    score += (postFrequency - 1) * 5;
    if (hasWebsite) score += 6;
    else score -= 8;

    score = Math.min(99, Math.max(45, score));

    const hoursSaved = Math.round(18 + (score / 100) * 16);
    const trafficPotential = `+${Math.round(score * 1.85)}%`;
    const roiMultiplier = `${(ind.multiplier + (score > 80 ? 0.4 : 0.1)).toFixed(1)}x`;

    return {
      score,
      industry: ind,
      hoursSaved,
      trafficPotential,
      roiMultiplier,
      grade: score >= 90 ? 'A+ Elite' : score >= 80 ? 'A Strong' : score >= 70 ? 'B+ Good' : 'Needs Optimization',
      gaugeStroke: score >= 85 ? '#10b981' : score >= 75 ? '#6366f1' : '#f59e0b',
    };
  }, [selectedIndustry, budgetTier, postFrequency, hasWebsite]);

  return (
    <div className="public-page min-h-screen flex flex-col">
      <PublicNavbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 py-20 text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs font-semibold uppercase tracking-wider btn-outline-purple">
            <span className="ai-pulse">✨</span>
            AI-Powered Business Growth Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight text-white tracking-tight">
            Grow Your Business{' '}
            <span className="gradient-text">Smarter with AI</span>
          </h1>

          <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed text-slate-400">
            Analyze your market, generate complete marketing strategies, create high-converting copy & images, optimize SEO rankings, and track real-time business health with one unified AI cockpit.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-4 rounded-xl font-bold text-base transition-all btn-primary shadow-xl shadow-indigo-500/25"
            >
              Start Free Today →
            </button>
            <a
              href="#live-score"
              className="px-8 py-4 rounded-xl font-bold text-base transition-all btn-outline-purple flex items-center justify-center gap-2"
            >
              <span>⚡</span> Check Your Live Score
            </a>
          </div>

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto text-left">
            <div className="p-5 rounded-2xl card-glass-subtle border border-white/5">
              <div className="text-2xl mb-1">⚡</div>
              <div className="text-2xl font-black text-indigo-400">72 / 100</div>
              <div className="text-xs text-slate-400 font-medium">Avg Baseline AI Score</div>
            </div>
            <div className="p-5 rounded-2xl card-glass-subtle border border-white/5">
              <div className="text-2xl mb-1">🎯</div>
              <div className="text-2xl font-black text-purple-400">30+ hrs</div>
              <div className="text-xs text-slate-400 font-medium">Saved Per Week</div>
            </div>
            <div className="p-5 rounded-2xl card-glass-subtle border border-white/5">
              <div className="text-2xl mb-1">📈</div>
              <div className="text-2xl font-black text-emerald-400">2.8x</div>
              <div className="text-xs text-slate-400 font-medium">Avg Revenue Lift</div>
            </div>
            <div className="p-5 rounded-2xl card-glass-subtle border border-white/5">
              <div className="text-2xl mb-1">🔒</div>
              <div className="text-2xl font-black text-cyan-400">100%</div>
              <div className="text-xs text-slate-400 font-medium">Private & Isolated Data</div>
            </div>
          </div>
        </section>

        {/* ── LIVE SCORE CALCULATOR & SIMULATOR SECTION ─────────────────────── */}
        <section id="live-score" className="px-6 py-20 bg-white/[0.015] border-y border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                Live Real-Time Engine
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-3">
                Simulate Your <span className="gradient-text">Live AI Growth Score</span>
              </h2>
              <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
                Adjust your business parameters below to see how our neural engine benchmarks your growth potential in real-time.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Controls Column */}
              <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl card-glass border border-white/10 space-y-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2.5">
                    1. Select Your Business Industry
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {industries.map((ind) => (
                      <button
                        key={ind.id}
                        type="button"
                        onClick={() => setSelectedIndustry(ind.id)}
                        className={`p-3 rounded-xl text-left text-xs font-semibold transition-all ${selectedIndustry === ind.id
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/50'
                            : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                          }`}
                      >
                        {ind.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      2. Monthly Marketing & Ad Budget
                    </label>
                    <span className="text-xs font-mono font-bold text-indigo-400">
                      {budgetTier === 1 && '₹10,000 - ₹25,000 (Early Bootstrapped)'}
                      {budgetTier === 2 && '₹25,000 - ₹75,000 (Growing Small Business)'}
                      {budgetTier === 3 && '₹75,000 - ₹2,50,000 (Scaling Startup / Agency)'}
                      {budgetTier === 4 && '₹2,50,000+ (High Velocity Enterprise)'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    step="1"
                    value={budgetTier}
                    onChange={(e) => setBudgetTier(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      3. Current Content & Social Post Velocity
                    </label>
                    <span className="text-xs font-mono font-bold text-purple-400">
                      {postFrequency === 0 && 'Rarely / Inconsistent (<1 per week)'}
                      {postFrequency === 1 && 'Occasional (2-3 posts per week)'}
                      {postFrequency === 2 && 'Daily Active (1 post per day)'}
                      {postFrequency === 3 && 'Aggressive Multi-Channel (3+ posts/day)'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="1"
                    value={postFrequency}
                    onChange={(e) => setPostFrequency(Number(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div>
                    <div className="text-sm font-bold text-white">Active Website / Landing Page?</div>
                    <div className="text-xs text-slate-400">Do you have a live website for SEO and customer conversion?</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHasWebsite(!hasWebsite)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${hasWebsite ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'
                      }`}
                  >
                    {hasWebsite ? '✓ Yes, Active' : '✕ No Website'}
                  </button>
                </div>
              </div>

              {/* Live Score Radial Gauge Display */}
              <div className="lg:col-span-5 p-8 rounded-3xl card-glass border border-white/10 text-center relative overflow-hidden shadow-2xl">
                <div
                  className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-30 pointer-events-none"
                  style={{ background: liveScoreData.gaugeStroke }}
                />

                <div className="relative mb-6 inline-block">
                  {/* Circular SVG Gauge */}
                  <svg className="w-48 h-48 transform -rotate-90 mx-auto" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke={liveScoreData.gaugeStroke}
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray={314}
                      strokeDashoffset={314 - (314 * liveScoreData.score) / 100}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black text-white font-mono tracking-tighter">
                      {liveScoreData.score}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      OUT OF 100
                    </span>
                  </div>
                </div>

                <div className="inline-block px-3 py-1 rounded-full text-xs font-black mb-6 bg-white/10 text-white border border-white/10">
                  {liveScoreData.grade}
                </div>

                {/* Score Breakdown Metrics */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-white/5 border border-white/10 mb-6 text-center">
                  <div>
                    <div className="text-xs text-slate-400">Projected Lift</div>
                    <div className="text-sm font-bold text-emerald-400">{liveScoreData.trafficPotential}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Time Saved</div>
                    <div className="text-sm font-bold text-indigo-400">{liveScoreData.hoursSaved} hrs/wk</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">ROI Multiplier</div>
                    <div className="text-sm font-bold text-purple-400">{liveScoreData.roiMultiplier}</div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-6 bg-white/[0.03] p-3 rounded-xl border border-white/5 text-left">
                  <span className="font-semibold text-indigo-300 block mb-1">AI Recommendation:</span>
                  {liveScoreData.industry.advice}
                </p>

                <button
                  onClick={() => navigate('/signup')}
                  className="w-full py-3.5 rounded-xl font-bold text-sm btn-primary shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
                >
                  <span>Unlock Real-Time Live Scoring</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="px-6 py-20 max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Everything You Need to{' '}
              <span className="gradient-text">Grow Faster</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base">
              Six synchronized AI tools engineered to automate your marketing pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
                onClick={() => navigate(f.link)}
                className="rounded-3xl p-7 cursor-pointer transition-all duration-300 card-glass-subtle flex flex-col justify-between"
                style={{
                  background:
                    hoveredFeature === i
                      ? `linear-gradient(135deg, ${f.color}20, ${f.color}08)`
                      : 'rgba(255,255,255,0.03)',
                  border: hoveredFeature === i
                    ? `1px solid ${f.color}55`
                    : '1px solid rgba(255,255,255,0.06)',
                  transform: hoveredFeature === i ? 'translateY(-4px)' : 'none',
                  boxShadow: hoveredFeature === i ? `0 12px 30px ${f.color}25` : 'none',
                }}
              >
                <div>
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4"
                    style={{ background: `${f.color}22`, border: `1px solid ${f.color}33` }}
                  >
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    {f.desc}
                  </p>
                </div>
                <span className="text-xs font-semibold flex items-center gap-1.5" style={{ color: f.color }}>
                  Explore Capability →
                </span>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/features"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold btn-outline-purple"
            >
              <span>View All Feature Specs & Comparisons</span>
              <span>→</span>
            </Link>
          </div>
        </section>

        {/* Call to Action Banner */}
        <section className="px-6 py-16 text-center">
          <div className="max-w-4xl mx-auto rounded-3xl p-12 banner-cta border border-white/10 relative overflow-hidden">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Ready to Supercharge Your Business?
            </h2>
            <p className="mb-8 text-slate-300 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              Join thousands of modern businesses accelerating revenue and saving 30+ hours each week with GrowthPilot AI.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/signup')}
                className="px-8 py-4 rounded-xl font-bold text-base btn-primary shadow-xl"
              >
                Get Started Free →
              </button>
              <button
                onClick={() => navigate('/features')}
                className="px-6 py-4 rounded-xl font-semibold text-base btn-outline-purple"
              >
                Explore All Features →
              </button>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
};

export default PublicDashboard;
