import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

const steps = [
  {
    step: '01',
    title: 'Connect Your Business Identity',
    subtitle: 'Takes less than 2 minutes',
    icon: '🏢',
    desc: 'Enter your business name, industry, target customer persona, and primary growth objective. GrowthPilot AI immediately builds a dedicated contextual memory store for your brand.',
    highlights: ['Multi-business support', 'Custom tone preferences', 'Industry benchmarking'],
  },
  {
    step: '02',
    title: 'Instant AI Audit & Live Score',
    subtitle: 'Deep diagnostic analysis',
    icon: '⚡',
    desc: 'Our engine scans your market landscape and computes your baseline Live Score across 4 key vectors: Brand Consistency, Content Velocity, SEO Visibility, and Audience Reach.',
    highlights: ['Identifies critical growth bottlenecks', 'Actionable priority score', 'Transparent 0-100 metrics'],
  },
  {
    step: '03',
    title: 'Autonomous Strategy & Content Generation',
    subtitle: 'Zero writer’s block, ever',
    icon: '🎯',
    desc: 'With one click, unlock full 30-day marketing roadmaps, persuasive social media copy, SEO-optimized landing page meta tags, and high-impact studio visuals.',
    highlights: ['Multi-channel campaign roadmaps', 'Photorealistic AI imagery', 'Platform-optimized copy'],
  },
  {
    step: '04',
    title: 'Execute, Track & Watch Scores Rise',
    subtitle: 'Real-time feedback loop',
    icon: '📈',
    desc: 'Implement the daily action items, publish AI content, and watch your business metrics and live platform scores improve in real-time as customer engagement climbs.',
    highlights: ['Live progress tracking', 'Exportable PDF executive reports', 'Continuous adaptive learning'],
  },
];

const HowItWorks = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="public-page min-h-screen flex flex-col">
      <PublicNavbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="px-6 py-20 text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold uppercase tracking-wider btn-outline-purple">
            <span>🗺️</span>
            Simple 4-Step Process
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
            How GrowthPilot AI <br />
            <span className="gradient-text">Transforms Your Growth</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            No steep learning curves or complicated setup. Go from business idea to a fully calibrated marketing and content engine in under five minutes.
          </p>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-3.5 rounded-xl text-sm font-bold btn-primary"
            >
              Start Free in 2 Minutes →
            </button>
          </div>
        </section>

        {/* Step-by-Step Flow */}
        <section className="px-6 py-12 max-w-6xl mx-auto">
          <div className="space-y-8">
            {steps.map((s, idx) => (
              <div
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-8 rounded-3xl transition-all cursor-pointer border ${
                  activeStep === idx
                    ? 'card-glass border-indigo-500/40 shadow-2xl scale-[1.01]'
                    : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="flex items-start gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-3xl flex-shrink-0">
                      {s.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400">
                          STEP {s.step}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{s.subtitle}</span>
                      </div>
                      <h3 className="text-2xl font-black text-white mb-2">{s.title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">{s.desc}</p>
                    </div>
                  </div>

                  {/* Highlight badges */}
                  <div className="flex flex-wrap lg:flex-col gap-2 w-full lg:w-60 flex-shrink-0">
                    {s.highlights.map((h, i) => (
                      <div
                        key={i}
                        className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300 flex items-center gap-1.5"
                      >
                        <span className="text-emerald-400">✓</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Growth Roadmap Visualization */}
        <section className="px-6 py-20 max-w-6xl mx-auto">
          <div className="rounded-3xl p-8 lg:p-12 card-glass border border-white/10 text-center relative overflow-hidden">
            <h2 className="text-3xl font-black text-white mb-4">
              Ready to Experience the GrowthPilot Advantage?
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto mb-8">
              Join thousands of businesses that use GrowthPilot every day to create smarter marketing campaigns, dominate search results, and accelerate revenue.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/signup')}
                className="px-8 py-3.5 rounded-xl text-sm font-bold btn-primary"
              >
                Create Your Account Now →
              </button>
              <button
                onClick={() => navigate('/faq')}
                className="px-6 py-3.5 rounded-xl text-sm font-semibold btn-outline-purple"
              >
                Read FAQs
              </button>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
};

export default HowItWorks;
