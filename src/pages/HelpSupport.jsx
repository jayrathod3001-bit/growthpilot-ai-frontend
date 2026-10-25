import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

const helpArticles = [
  {
    category: 'Getting Started',
    title: 'How to setup your first Business Profile & calibrate AI',
    readTime: '3 min read',
    icon: '🚀',
    desc: 'Step-by-step walkthrough on configuring your brand voice, competitors, and target demographics for maximum output quality.',
  },
  {
    category: 'Live Score',
    title: 'Understanding your Live AI Health Score and how to boost it',
    readTime: '4 min read',
    icon: '⚡',
    desc: 'Learn how our 4-vector algorithm evaluates your SEO, content velocity, and audience reach, plus quick actions to reach 90+.',
  },
  {
    category: 'Authentication',
    title: 'Signing in with Google & Seamless Account Access',
    readTime: '2 min read',
    icon: '🔑',
    desc: 'How passwordless login works, OTP delivery details, and troubleshooting Google Identity Services.',
  },
  {
    category: 'Marketing Strategy',
    title: 'Generating and exporting complete 30-day marketing roadmaps',
    readTime: '5 min read',
    icon: '🎯',
    desc: 'How to turn high-level business goals into daily actionable steps across social, email, and organic search.',
  },
  {
    category: 'SEO Assistant',
    title: 'Running a domain SEO audit & extracting low-competition keywords',
    readTime: '4 min read',
    icon: '🔍',
    desc: 'A complete guide to uncovering high-intent keywords that can rank your website on Google page one.',
  },
  {
    category: 'Visual Design',
    title: 'Prompt engineering tips for high-res AI promotional images',
    readTime: '3 min read',
    icon: '🖼️',
    desc: 'Techniques to generate studio-lighting product visuals, social ad creatives, and banner graphics in seconds.',
  },
];

const HelpSupport = () => {
  const [search, setSearch] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMsg, setTicketMsg] = useState('');
  const [ticketEmail, setTicketEmail] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [ticketError, setTicketError] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!ticketEmail.trim()) {
      errs.email = 'Email address is required';
    } else if (!emailRegex.test(ticketEmail.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    if (!ticketSubject.trim()) {
      errs.subject = 'Subject / topic is required';
    }
    if (!ticketMsg.trim()) {
      errs.message = 'Please provide details of your issue';
    }
    return errs;
  };

  const filteredArticles = helpArticles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase()) ||
      a.desc.toLowerCase().includes(search.toLowerCase())
  );

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setTicketError('');
    try {
      const res = await axios.post('http://localhost:5000/api/inquiries', {
        name: ticketEmail.trim().split('@')[0],
        email: ticketEmail.trim(),
        subject: ticketSubject.trim(),
        category: 'Support Ticket',
        message: ticketMsg.trim(),
        source: 'help_ticket',
      });
      if (res.data?.status === 1) {
        setSubmittedTicket('TICKET-' + Math.floor(100000 + Math.random() * 900000));
        setErrors({});
      } else {
        setTicketError(res.data?.message || 'Failed to submit ticket');
      }
    } catch (err) {
      setTicketError(err.response?.data?.message || err.message || 'Error creating ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="public-page min-h-screen flex flex-col">
      <PublicNavbar />

      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-semibold uppercase tracking-wider btn-outline-purple">
            <span>💡</span>
            Help & Knowledge Hub
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            How Can We <span className="gradient-text">Help You Today?</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg">
            Search our comprehensive guides, explore troubleshooting steps, or open a direct priority support ticket.
          </p>

          {/* Search Box */}
          <div className="relative max-w-xl mx-auto mt-8">
            <span className="absolute left-4 top-3.5 text-slate-400">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search knowledge base articles..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-400 shadow-xl"
            />
          </div>
        </div>

        {/* Quick Channels Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-2xl card-glass border border-white/10 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl mb-4">
                💬
              </div>
              <h3 className="font-bold text-white text-base mb-1">Live AI Chatbot</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Instant 24/7 technical and marketing guidance powered by Nexa AI.
              </p>
            </div>
            <Link to="/login" className="text-xs font-bold text-indigo-400 hover:text-indigo-300">
              Open Dashboard Chat →
            </Link>
          </div>

          <div className="p-6 rounded-2xl card-glass border border-white/10 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-2xl mb-4">
                ✉️
              </div>
              <h3 className="font-bold text-white text-base mb-1">Email Specialist</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Send your inquiry to our engineering team. Average reply under 2 hours.
              </p>
            </div>
            <a href="mailto:jayrathod@yopmail.com" className="text-xs font-bold text-purple-400 hover:text-purple-300">
              jayrathod@yopmail.com →
            </a>
          </div>

          <div className="p-6 rounded-2xl card-glass border border-white/10 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl mb-4">
                ⚡
              </div>
              <h3 className="font-bold text-white text-base mb-1">System Health</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                All AI inference clusters and database clusters running at 100% capacity.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
              All Systems Operational
            </span>
          </div>
        </div>

        {/* Knowledge Base Articles */}
        <div className="mb-16">
          <h2 className="text-2xl font-black text-white mb-6">Popular Help Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredArticles.map((art, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl card-glass-subtle border border-white/5 hover:border-indigo-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10 font-medium">
                      {art.category}
                    </span>
                    <span className="text-slate-500">{art.readTime}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                    <span>{art.icon}</span> {art.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{art.desc}</p>
                </div>
                <Link to="/contact" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
                  Read Guide & Examples →
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Priority Ticket Form */}
        <div className="p-8 lg:p-10 rounded-3xl card-glass border border-white/10">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-black text-white mb-2 text-center">Open a Support Ticket</h2>
            <p className="text-xs text-slate-400 text-center mb-8">
              Encountered a bug or have an account inquiry? Submit a ticket and our technical team will resolve it swiftly.
            </p>

            {submittedTicket ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <div className="text-3xl">🎫</div>
                <h3 className="text-lg font-bold text-white">Ticket Submitted Successfully</h3>
                <div className="font-mono text-xs px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 inline-block font-bold">
                  {submittedTicket}
                </div>
                <p className="text-xs text-slate-300">
                  Confirmation sent to <span className="text-white font-medium">{ticketEmail}</span>. An engineer will follow up within 2 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmittedTicket(null);
                    setTicketSubject('');
                    setTicketMsg('');
                    setTicketEmail('');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold btn-outline-purple mt-2"
                >
                  Submit Another Ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="space-y-4" noValidate>
                {ticketError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
                    {ticketError}
                  </div>
                )}
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Your Email *</label>
                  <input
                    type="email"
                    value={ticketEmail}
                    onChange={(e) => {
                      setTicketEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                    }}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-white placeholder-slate-500 text-sm focus:outline-none transition-all ${
                      errors.email
                        ? 'border-red-500 bg-red-500/5 focus:border-red-400'
                        : 'border-white/10 focus:border-indigo-400'
                    }`}
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1 font-semibold">{errors.email}</p>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Subject / Issue Topic *</label>
                  <input
                    type="text"
                    value={ticketSubject}
                    onChange={(e) => {
                      setTicketSubject(e.target.value);
                      if (errors.subject) setErrors((prev) => ({ ...prev, subject: null }));
                    }}
                    placeholder="e.g. Question regarding Live Score recalculation"
                    className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-white placeholder-slate-500 text-sm focus:outline-none transition-all ${
                      errors.subject
                        ? 'border-red-500 bg-red-500/5 focus:border-red-400'
                        : 'border-white/10 focus:border-indigo-400'
                    }`}
                  />
                  {errors.subject && <p className="text-red-400 text-xs mt-1 font-semibold">{errors.subject}</p>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Description of Issue *</label>
                  <textarea
                    rows={4}
                    value={ticketMsg}
                    onChange={(e) => {
                      setTicketMsg(e.target.value);
                      if (errors.message) setErrors((prev) => ({ ...prev, message: null }));
                    }}
                    placeholder="Please include relevant details or screenshots..."
                    className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-white placeholder-slate-500 text-sm focus:outline-none transition-all ${
                      errors.message
                        ? 'border-red-500 bg-red-500/5 focus:border-red-400'
                        : 'border-white/10 focus:border-indigo-400'
                    }`}
                  />
                  {errors.message && <p className="text-red-400 text-xs mt-1 font-semibold">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl font-bold text-sm btn-primary"
                >
                  {submitting ? 'Submitting Ticket...' : 'Create Priority Ticket →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default HelpSupport;
