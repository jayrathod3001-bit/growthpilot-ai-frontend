import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

const faqCategories = ['All', 'General', 'AI & Technology', 'Content & SEO', 'Security & Privacy', 'Getting Started'];

const faqs = [
  {
    category: 'General',
    q: 'What is GrowthPilot AI?',
    a: 'GrowthPilot AI is an all-in-one autonomous business growth assistant. It combines AI business advisory (Nexa AI), automated marketing strategy creation, multi-platform content generation, studio image synthesis, SEO audit tools, and real-time business health scoring in a single unified platform.',
  },
  {
    category: 'General',
    q: 'Who is GrowthPilot AI built for?',
    a: 'GrowthPilot AI is engineered for small & medium business owners, startup founders, solopreneurs, digital marketing agencies, e-commerce stores, and freelance creators who want to scale their marketing without hiring costly agencies.',
  },
  {
    category: 'General',
    q: 'Can I manage multiple businesses under one account?',
    a: 'Yes! GrowthPilot supports multi-business profiles. You can add distinct businesses (e.g. your e-commerce shop, SaaS startup, or client accounts) and switch between them seamlessly from the dashboard header with isolated memory and stats for each.',
  },
  {
    category: 'AI & Technology',
    q: 'What AI models power GrowthPilot AI?',
    a: 'We utilize a hybrid high-efficiency architecture: localized Qwen 2.5 LLMs for ultra-fast response times combined with Google Gemini 2.5 Flash for high-context strategic reasoning and creative image synthesis.',
  },
  {
    category: 'AI & Technology',
    q: 'How does the Live Business Score work?',
    a: 'Your Live Score (0 to 100) is dynamically computed across four core pillars: SEO visibility, content volume, brand consistency, and platform activity. As you generate campaigns, publish content, and optimize your business profile, your score updates live.',
  },
  {
    category: 'Content & SEO',
    q: 'Is the generated content unique and plagiarism-free?',
    a: 'Yes. All content is generated in real-time based on your specific business context, target audience, and selected tone. It is original, plagiarism-free, and safe for SEO and social publishing.',
  },
  {
    category: 'Content & SEO',
    q: 'Can I export strategies and marketing roadmaps?',
    a: 'Absolutely. All marketing roadmaps, content calendars, and analytics reports can be copied, edited, or exported for your team or clients.',
  },
  {
    category: 'Security & Privacy',
    q: 'Is my confidential business data safe?',
    a: 'Security is foundational to GrowthPilot. We use 256-bit SSL encryption in transit and at rest. Your business strategy and proprietary information is never sold or used to train public LLM foundation models.',
  },
  {
    category: 'Security & Privacy',
    q: 'How does Google and Mobile OTP login protect my account?',
    a: 'We support passwordless, cryptographically signed Google OAuth and time-based 6-digit Mobile OTP verification. This eliminates password leaks and makes authentication both fast and secure.',
  },
  {
    category: 'Getting Started',
    q: 'Is GrowthPilot AI completely free to use?',
    a: 'Yes! GrowthPilot AI is 100% free. There are no hidden charges, no subscription fees, no credit card required, and no premium plans. Every feature — AI chat, marketing strategy, content generation, SEO audit, image generation, and analytics — is fully accessible at no cost.',
  },
  {
    category: 'Getting Started',
    q: 'How do I get started with GrowthPilot AI?',
    a: 'Simply create a free account using your email, Google account, or mobile OTP. Once registered, add your business profile and immediately access all AI-powered tools from your dashboard — completely free, no setup fees.',
  },
];

const FAQ = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(0);

  const filteredFaqs = faqs.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="public-page min-h-screen flex flex-col">
      <PublicNavbar />

      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-semibold uppercase tracking-wider btn-outline-purple">
            <span>❓</span>
            Got Questions? We’ve Got Answers
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg">
            Everything you need to know about GrowthPilot AI, features, privacy, and how to scale your business.
          </p>
        </div>

        {/* Live Search Input */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-slate-400 text-base">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. Live score, Google login, SEO, pricing)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-400 shadow-xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-3 text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {faqCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => (
              <div
                key={idx}
                className={`rounded-2xl transition-all border ${
                  openIndex === idx
                    ? 'card-glass border-indigo-500/30'
                    : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4"
                >
                  <span className="text-base md:text-lg font-bold text-white flex items-center gap-3">
                    <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                      {faq.category}
                    </span>
                    {faq.q}
                  </span>
                  <span className="text-xl font-bold text-indigo-400 flex-shrink-0">
                    {openIndex === idx ? '−' : '+'}
                  </span>
                </button>

                {openIndex === idx && (
                  <div className="px-5 pb-5 text-sm md:text-base text-slate-300 leading-relaxed border-t border-white/5 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-slate-400 text-sm mb-2">No questions matched your search "{searchQuery}"</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="text-xs text-indigo-400 hover:underline"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </div>

        {/* Still have questions card */}
        <div className="mt-16 p-8 rounded-3xl card-glass border border-white/10 text-center">
          <h3 className="text-xl font-black text-white mb-2">Still Have Questions?</h3>
          <p className="text-slate-400 text-xs md:text-sm max-w-md mx-auto mb-6">
            Can’t find what you’re looking for? Our support team is online and ready to assist you.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/contact"
              className="px-6 py-2.5 rounded-xl text-xs font-bold btn-primary"
            >
              Contact Support →
            </Link>
            <Link
              to="/support"
              className="px-6 py-2.5 rounded-xl text-xs font-semibold btn-outline-purple"
            >
              Visit Help Center
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default FAQ;
