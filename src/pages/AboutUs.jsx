import React from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

const values = [
  {
    icon: '⚡',
    title: 'Autonomous Velocity',
    desc: 'We eliminate weeks of manual marketing research by generating actionable growth strategies in seconds.',
  },
  {
    icon: '🔒',
    title: 'Enterprise Privacy',
    desc: 'Your business confidential data is never used to train public LLM models. End-to-end encrypted storage.',
  },
  {
    icon: '🎯',
    title: 'Data-Backed Precision',
    desc: 'No vague fluff. Every recommendation, SEO keyword, and campaign comes with projected ROI and scoring.',
  },
  {
    icon: '🤝',
    title: 'Human + AI Collaboration',
    desc: 'AI does the heavy lifting and data crunching, while putting complete creative control in your hands.',
  },
];

const milestones = [
  { metric: '50,000+', label: 'AI Marketing Campaigns Created' },
  { metric: '1.2M+', label: 'SEO Keywords & Content Generated' },
  { metric: '94%', label: 'Average Growth Rate in First 90 Days' },
  { metric: '4.9 / 5', label: 'User Satisfaction Rating' },
];

const team = [
  {
    name: 'Jay Rathod',
    role: 'Founder & Backend Engineer',
    avatar: '👨‍💻',
    bio: 'Backend systems architect specializing in scalable APIs, database optimization, and real-time AI pipeline integration for high-performance platforms.',
  },
  {
    name: 'Vishvam Bhalani',
    role: 'Co-Founder & Frontend Engineer',
    avatar: '🧑‍💻',
    bio: 'Frontend engineer specializing in responsive web design, interactive user interfaces, and seamless user experiences using React.js and modern web technologies.',
  },
  {
    name: 'Isarat Vadadriya',
    role: 'Co-Founder & UI/UX Engineer',
    avatar: '🎨',
    bio: 'Product designer and frontend engineer crafting intuitive, modern interfaces that make complex AI-powered tools feel effortless and delightful to use.',
  },
];


const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="public-page min-h-screen flex flex-col">
      <PublicNavbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 py-20 text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold uppercase tracking-wider btn-outline-purple">
            <span>✨</span>
            About GrowthPilot AI
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
            Empowering Modern Businesses to <br />
            <span className="gradient-text">Grow 10x Faster with AI</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            GrowthPilot AI was built with a single mission: to level the playing field so every business owner, startup founder, and agency can command enterprise-grade marketing and growth intelligence without hiring expensive teams.
          </p>
        </section>

        {/* Story Section */}
        <section className="px-6 py-12 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-black text-white">
                From Complex Spreadsheets to <span className="text-indigo-400">Intelligent Autopilot</span>
              </h2>
              <p className="text-slate-400 leading-relaxed">
                Before GrowthPilot, growing a business required juggling dozens of fragmented tools: an expensive SEO suite, freelance copywriters, social media schedulers, graphic designers, and complex marketing dashboards.
              </p>
              <p className="text-slate-400 leading-relaxed">
                We designed GrowthPilot to unify everything under one synchronized brain. When your business profile is added, our platform analyzes your audience, calculates your real-time AI Health Score, drafts marketing roadmaps, and designs on-brand visuals automatically.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => navigate('/signup')}
                  className="px-6 py-3 rounded-xl text-sm font-bold btn-primary"
                >
                  Start Your Growth Journey →
                </button>
              </div>
            </div>

            <div className="rounded-3xl p-8 card-glass border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <span>🧠</span> The GrowthPilot AI Engine
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-indigo-400 font-bold text-sm mb-1">Local & Cloud LLMs Hybrid</div>
                  <div className="text-xs text-slate-400">Powered by local high-efficiency Qwen models paired with Google Gemini 2.5 Flash for high throughput and zero latency.</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-purple-400 font-bold text-sm mb-1">Real-Time Scoring Algorithm</div>
                  <div className="text-xs text-slate-400">Calculates dynamic health metrics across 4 pillars: SEO visibility, content volume, brand consistency, and audience reach.</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-emerald-400 font-bold text-sm mb-1">Adaptive Persona Memory</div>
                  <div className="text-xs text-slate-400">Remembers your brand tone, industry quirks, and competitor benchmarks across all AI generations.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Milestones / Impact */}
        <section className="px-6 py-16 bg-white/[0.02] border-y border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {milestones.map((item, i) => (
                <div key={i} className="p-6 rounded-2xl card-glass-subtle">
                  <div className="text-3xl lg:text-4xl font-black gradient-text mb-2">
                    {item.metric}
                  </div>
                  <div className="text-xs text-slate-400 font-medium">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="px-6 py-20 max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-white mb-3">Our Core Principles</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              How we approach technology, engineering, and our commitment to every business owner.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <div key={i} className="p-6 rounded-2xl card-glass-subtle border border-white/5 hover:border-indigo-500/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl mb-4">
                  {v.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{v.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="px-6 py-16 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-3">Meet the Minds Behind GrowthPilot</h2>
            <p className="text-slate-400 text-sm">Builders, researchers, and creators shaping the future of autonomous growth.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((m, i) => (
              <div key={i} className="p-6 rounded-2xl card-glass border border-white/10 text-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-3xl mx-auto mb-4">
                  {m.avatar}
                </div>
                <h4 className="text-lg font-bold text-white">{m.name}</h4>
                <div className="text-xs font-semibold text-indigo-400 mb-3">{m.role}</div>
                <p className="text-xs text-slate-400 leading-relaxed">{m.bio}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
};

export default AboutUs;
