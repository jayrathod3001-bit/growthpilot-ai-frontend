import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

const featureList = [
  {
    id: 'ai-chat',
    icon: '🤖',
    badge: 'Strategic Advisory',
    title: 'Nexa AI Business Assistant',
    subtitle: 'Your 24/7 on-demand Chief Marketing Officer',
    color: '#6366f1',
    description: 'Nexa AI is not a generic chatbot. It connects directly with your active business data to provide nuanced, actionable marketing strategies, competitive analysis, and tactical troubleshooting for your exact market.',
    points: [
      'Tailored answers using your business profile & target demographic',
      'Instant brainstorms for viral campaigns, discounts & launch promos',
      'Competitive threat alerts and pivot recommendations',
      'Multi-turn conversational memory with exportable action items',
    ],
  },
  {
    id: 'marketing-strategy',
    icon: '🎯',
    badge: 'Automated Roadmaps',
    title: 'Marketing Strategy Engine',
    subtitle: 'From zero to high-ROI campaigns in 60 seconds',
    color: '#8b5cf6',
    description: 'Generating complete, month-long marketing calendars used to take agencies weeks. GrowthPilot builds multi-channel roadmaps across Instagram, LinkedIn, Google Ads, and Email sequences with step-by-step execution checklists.',
    points: [
      'Week-by-week structured campaign roadmap with daily action items',
      'Target persona definition with pain points & hooks',
      'Budget and resource distribution estimates',
      'Downloadable PDF and spreadsheet marketing plans',
    ],
  },
  {
    id: 'content-generator',
    icon: '✍️',
    badge: 'Content & Copywriting',
    title: 'AI Content Studio',
    subtitle: 'High-converting copy crafted for your brand voice',
    color: '#06b6d4',
    description: 'Create weeks worth of engaging social media captions, LinkedIn thought leadership articles, sales email sequences, and high-CTR ad headlines that resonate deeply with your customers.',
    points: [
      'Dynamic tone adaptation: Professional, playful, persuasive, or punchy',
      'Platform-specific formatting for Instagram, X/Twitter, and LinkedIn',
      'Integrated hashtags, emoji hooks, and calls-to-action',
      'One-click regeneration and real-time editing workspace',
    ],
  },
  {
    id: 'image-generator',
    icon: '🖼️',
    badge: 'Visual Design',
    title: 'AI Image & Creative Generator',
    subtitle: 'Studio-grade promotional banners without graphic designers',
    color: '#10b981',
    description: 'Transform simple text prompts into stunning product showcases, advertising visuals, and digital assets powered by modern diffusion models and Gemini Image APIs.',
    points: [
      'Photorealistic product and lifestyle visuals tailored to your niche',
      'Multiple aspect ratios optimized for mobile feeds and display banners',
      'Instant download in crisp high-resolution formats',
      'Style presets: Minimalist, Neon Cyberpunk, Studio Luxury, Editorial',
    ],
  },
  {
    id: 'seo-assistant',
    icon: '🔍',
    badge: 'Organic Visibility',
    title: 'SEO Assistant & Audit Suite',
    subtitle: 'Dominate Google search results organically',
    color: '#f59e0b',
    description: 'Uncover high-intent, low-competition keywords that your ideal customers are searching for. Get actionable recommendations for meta tags, technical SEO fixes, and on-page content optimization.',
    points: [
      'Instant domain and landing page SEO health checks',
      'High-traffic keyword suggestions with search intent classification',
      'Optimized meta titles and meta descriptions ready to paste',
      'Competitor content gap analysis to rank above your rivals',
    ],
  },
  {
    id: 'analytics',
    icon: '📊',
    badge: 'Live Intelligence',
    title: 'Live Business Health & AI Scoring',
    subtitle: 'Real-time visibility into your growth velocity',
    color: '#ec4899',
    description: 'Never guess if your marketing is working. GrowthPilot aggregates your campaigns, SEO health, and platform activity into a single dynamic Live Score that updates continuously.',
    points: [
      'Dynamic 0-100 Live Score with clear improvement recommendations',
      'Real-time task tracking with background process monitor',
      'Exportable executive summary reports for founders and investors',
      'Actionable milestone checklists that unlock higher growth tiers',
    ],
  },
];

const OurFeatures = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(featureList[0].id);

  const selectedFeature = featureList.find((f) => f.id === activeTab) || featureList[0];

  return (
    <div className="public-page min-h-screen flex flex-col">
      <PublicNavbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 py-20 text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold uppercase tracking-wider btn-outline-purple">
            <span>⚡</span>
            Complete Autonomous Suite
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
            Everything You Need to <br />
            <span className="gradient-text">Outpace Your Competition</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Six enterprise-grade AI growth engines operating in perfect harmony. Designed to save you 30+ hours per week while dramatically boosting customer acquisition.
          </p>

          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-3.5 rounded-xl text-sm font-bold btn-primary"
            >
              Explore Free with AI →
            </button>
            <button
              onClick={() => navigate('/how-it-works')}
              className="px-6 py-3.5 rounded-xl text-sm font-semibold btn-outline-purple"
            >
              See How It Works
            </button>
          </div>
        </section>

        {/* Interactive Deep-Dive Explorer */}
        <section className="px-6 py-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
            {featureList.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveTab(f.id)}
                className={`p-4 rounded-2xl text-center transition-all ${
                  activeTab === f.id
                    ? 'card-glass border-2'
                    : 'bg-white/5 border border-white/5 hover:bg-white/10'
                }`}
                style={{
                  borderColor: activeTab === f.id ? f.color : undefined,
                  boxShadow: activeTab === f.id ? `0 8px 24px ${f.color}25` : undefined,
                }}
              >
                <div className="text-2xl mb-1.5">{f.icon}</div>
                <div className="text-xs font-bold text-white truncate">{f.title.split(' ')[0]}</div>
                <div className="text-[10px] text-slate-400 truncate">{f.badge}</div>
              </button>
            ))}
          </div>

          {/* Active Feature Showcase Card */}
          <div className="rounded-3xl p-8 lg:p-12 card-glass border border-white/10 relative overflow-hidden">
            <div
              className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ background: selectedFeature.color }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <div
                  className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
                  style={{
                    background: `${selectedFeature.color}22`,
                    color: selectedFeature.color,
                    border: `1px solid ${selectedFeature.color}44`,
                  }}
                >
                  <span>{selectedFeature.icon}</span>
                  {selectedFeature.badge}
                </div>

                <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
                  {selectedFeature.title}
                </h2>
                <h3 className="text-base text-indigo-300 font-medium mb-6">
                  {selectedFeature.subtitle}
                </h3>

                <p className="text-slate-300 leading-relaxed text-sm md:text-base mb-8">
                  {selectedFeature.description}
                </p>

                <div className="space-y-3 mb-8">
                  {selectedFeature.points.map((pt, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                        style={{ background: `${selectedFeature.color}33`, color: selectedFeature.color }}
                      >
                        ✓
                      </div>
                      <span className="text-xs md:text-sm text-slate-300">{pt}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-3 rounded-xl text-sm font-bold btn-primary"
                >
                  Try {selectedFeature.title.split(' ')[0]} Now →
                </button>
              </div>

              {/* Mockup Preview Panel */}
              <div className="rounded-2xl p-6 bg-slate-950/70 border border-white/10 font-mono text-xs text-slate-300 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-slate-500 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
                    <span className="ml-2 text-slate-400">GrowthPilot AI • Engine Terminal</span>
                  </div>
                  <span className="text-emerald-400">● LIVE</span>
                </div>

                <div className="space-y-2 text-slate-300">
                  <p className="text-indigo-400 font-semibold">$ nexa-engine run --module {selectedFeature.id}</p>
                  <p className="text-slate-400">» Context loaded: Business profile, Target audience, Industry metrics</p>
                  <p className="text-slate-400">» Executing neural pipeline with active weights...</p>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-1">
                    <span className="text-amber-400 font-bold block mb-1">Generated Output Sample:</span>
                    <span className="text-slate-300 block">
                      "{selectedFeature.points[0]}"
                    </span>
                    <span className="text-slate-400 block text-[11px]">
                      Confidence Score: 98.7% | Latency: 412ms | Model: Hybrid Qwen-Gemini
                    </span>
                  </div>
                  <p className="text-emerald-400">✓ Result delivered to user dashboard seamlessly.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid Overview */}
        <section className="px-6 py-20 max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-white mb-3">All Six Tools, One Single Subscription</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">No per-feature add-ons. Everything is unlocked out of the box.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureList.map((f, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl card-glass-subtle border border-white/5 hover:border-indigo-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl mb-4">
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{f.description}</p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-indigo-400 font-semibold">{f.badge}</span>
                  <button
                    onClick={() => navigate('/login')}
                    className="text-slate-300 hover:text-white font-medium"
                  >
                    Launch →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
};

export default OurFeatures;
