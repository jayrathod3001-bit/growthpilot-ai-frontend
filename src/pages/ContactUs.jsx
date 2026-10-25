import React, { useState } from 'react';
import axios from 'axios';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    category: 'General Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState('');

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.name.trim()) {
      errs.name = 'Your name is required';
    }
    if (!formData.email.trim()) {
      errs.email = 'Work email is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim()) {
      errs.message = 'Please provide an inquiry or message description';
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await axios.post('http://localhost:5000/api/inquiries', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        businessName: formData.businessName.trim(),
        category: formData.category,
        subject: formData.category,
        message: formData.message.trim(),
        source: 'contact',
      });
      if (res.data?.status === 1) {
        setSubmitted(true);
      } else {
        setErrorMsg(res.data?.message || 'Failed to submit inquiry');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to send inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="public-page min-h-screen flex flex-col">
      <PublicNavbar />

      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-semibold uppercase tracking-wider btn-outline-purple">
            <span>📫</span>
            Contact & Support
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            We’d Love to <span className="gradient-text">Hear From You</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg">
            Have questions about GrowthPilot AI, need custom enterprise integration, or just want to explore how AI can accelerate your business? Reach out anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Contact Details Column */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl card-glass border border-white/10 space-y-5">
              <h3 className="text-lg font-bold text-white mb-2">Direct Channels</h3>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-lg flex-shrink-0">
                  📧
                </div>
                <div>
                  <div className="text-xs text-slate-400">Email Us</div>
                  <a href="mailto:jayrathod@yopmail.com" className="text-sm font-semibold text-white hover:text-indigo-400 transition-colors">
                    jayrathod@yopmail.com
                  </a>
                  <div className="text-[11px] text-slate-500">Replies within 2 hours</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-lg flex-shrink-0">
                  📱
                </div>
                <div>
                  <div className="text-xs text-slate-400">Call / WhatsApp</div>
                  <div className="text-sm font-semibold text-white">+91 84690 84695</div>
                  <div className="text-[11px] text-slate-500">Mon - Fri, 9am - 7pm IST</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-lg flex-shrink-0">
                  📍
                </div>
                <div>
                  <div className="text-xs text-slate-400">Headquarters</div>
                  <div className="text-sm font-semibold text-white">LJ University, SG Highway</div>
                  <div className="text-[11px] text-slate-500">Ahmedabad, Gujarat, India</div>
                </div>
              </div>
            </div>

            {/* Quick Support Badge */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-purple-950/40 border border-indigo-500/20">
              <div className="text-xs uppercase font-bold text-indigo-400 tracking-wider mb-2">
                Need Instant Help?
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Already have an account? You can chat with our 24/7 AI Growth Assistant inside your dashboard.
              </p>
              <a
                href="/login"
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                Go to AI Support →
              </a>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-2 p-8 rounded-3xl card-glass border border-white/10 shadow-2xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-3xl mx-auto">
                  ✅
                </div>
                <h3 className="text-2xl font-black text-white">Message Received!</h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  Thank you for reaching out, <span className="font-semibold text-white">{formData.name}</span>. One of our growth specialists will contact you at <span className="text-indigo-400">{formData.email}</span> within 2 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      businessName: '',
                      category: 'General Inquiry',
                      message: '',
                    });
                  }}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold btn-outline-purple mt-4"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <h3 className="text-xl font-black text-white mb-2">Send us a Message</h3>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Ananya Roy"
                      className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-slate-500 text-sm focus:outline-none ${errors.name ? 'border-red-500 bg-red-500/5' : 'border-white/10 focus:border-indigo-400'}`}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1 font-semibold">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Work Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@company.com"
                      className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-slate-500 text-sm focus:outline-none ${errors.email ? 'border-red-500 bg-red-500/5' : 'border-white/10 focus:border-indigo-400'}`}
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1 font-semibold">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Mobile Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Business / Company Name</label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="e.g. Acme Studio"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">How Can We Help?</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#14142a] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-400"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Technical Support">Technical Support & Onboarding</option>
                    <option value="Enterprise AI Plan">Custom Enterprise AI Plan</option>
                    <option value="Agency Partnership">Agency / Affiliate Partnership</option>
                    <option value="Feature Request">Feature Request / Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Message *</label>
                  <textarea
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your business goals or issue..."
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-slate-500 text-sm focus:outline-none ${errors.message ? 'border-red-500 bg-red-500/5' : 'border-white/10 focus:border-indigo-400'}`}
                  />
                  {errors.message && <p className="text-red-400 text-xs mt-1 font-semibold">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl font-bold text-sm btn-primary flex items-center justify-center gap-2"
                >
                  {submitting ? 'Sending Message...' : 'Submit Inquiry →'}
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

export default ContactUs;
