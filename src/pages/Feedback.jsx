import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

const feedbackTypes = [
  { id: 'feature', label: 'Feature Request', icon: '💡' },
  { id: 'quality', label: 'AI Quality', icon: '🧠' },
  { id: 'design', label: 'UI / UX Design', icon: '🎨' },
  { id: 'bug', label: 'Bug Report', icon: '🐛' },
  { id: 'speed', label: 'Speed & Latency', icon: '⚡' },
  { id: 'general', label: 'General Thoughts', icon: '💬' },
];

const Feedback = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedType, setSelectedType] = useState('feature');
  const [npsScore, setNpsScore] = useState(10);
  const [comments, setComments] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!comments.trim()) {
      errs.comments = 'Please write your thoughts or suggestions';
    }
    if (userEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userEmail.trim())) {
        errs.email = 'Please enter a valid email address';
      }
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});
    try {
      const typeLabel = feedbackTypes.find((t) => t.id === selectedType)?.label || 'Product Feedback';
      await axios.post('http://localhost:5000/api/inquiries', {
        name: userName.trim() || 'Anonymous User',
        email: userEmail.trim() || 'feedback-user@growthpilot.ai',
        subject: `Feedback: ${typeLabel} (${rating}/5 ⭐)`,
        category: 'Feedback',
        message: `Rating: ${rating}/5 Stars | NPS: ${npsScore}/10 | Type: ${typeLabel}\n\nComments:\n${comments.trim() || 'No additional comment provided'}`,
        source: 'feedback',
        rating,
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Feedback submit error:', err.message);
      setSubmitted(true); // Still thank the user
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="public-page min-h-screen flex flex-col">
      <PublicNavbar />

      <main className="flex-1 max-w-3xl mx-auto px-6 py-16 w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-semibold uppercase tracking-wider btn-outline-purple">
            <span>⭐</span>
            Your Voice Shapes GrowthPilot
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-3">
            Share Your <span className="gradient-text">Feedback</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            We are obsessively focused on building the best autonomous AI experience. Tell us what you love, what needs work, or what feature we should build next!
          </p>
        </div>

        {/* Feedback Card */}
        <div className="p-8 lg:p-10 rounded-3xl card-glass border border-white/10 shadow-2xl relative overflow-hidden">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-4xl mx-auto animate-bounce">
                🎉
              </div>
              <h2 className="text-2xl font-black text-white">Thank You for Your Feedback!</h2>
              <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                Your thoughts have been logged directly with our engineering and design teams. We review every single submission to guide our next product sprint.
              </p>
              <div className="pt-4 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold btn-outline-purple"
                >
                  Send Another Note
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold btn-primary"
                >
                  Return to Dashboard →
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Star Rating */}
              <div className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <label className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-3">
                  How would you rate your experience?
                </label>
                <div className="flex justify-center items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="text-3xl sm:text-4xl transition-transform hover:scale-125 focus:outline-none"
                    >
                      <span
                        style={{
                          color: (hoverRating || rating) >= star ? '#f59e0b' : '#334155',
                          textShadow: (hoverRating || rating) >= star ? '0 0 16px rgba(245, 158, 11, 0.5)' : 'none',
                        }}
                      >
                        ★
                      </span>
                    </button>
                  ))}
                </div>
                <div className="text-xs text-indigo-400 font-semibold mt-2">
                  {rating === 5 && 'Outstanding! 🌟'}
                  {rating === 4 && 'Very Good! 👍'}
                  {rating === 3 && 'Decent / Average 😐'}
                  {rating === 2 && 'Needs Improvement ⚠️'}
                  {rating === 1 && 'Poor experience 💔'}
                </div>
              </div>

              {/* Category Chips */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-2 block">
                  What area is your feedback about?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {feedbackTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type.id)}
                      className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                        selectedType === type.id
                          ? 'bg-indigo-600 text-white border border-indigo-400/50 shadow-lg'
                          : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-base">{type.icon}</span>
                      <span>{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* NPS Slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    How likely are you to recommend GrowthPilot AI to a friend?
                  </label>
                  <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                    {npsScore} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={npsScore}
                  onChange={(e) => setNpsScore(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0 - Not likely</span>
                  <span>5 - Neutral</span>
                  <span>10 - Extremely likely</span>
                </div>
              </div>

              {/* Comments Textarea */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                  Your Thoughts & Suggestions *
                </label>
                <textarea
                  rows={4}
                  value={comments}
                  onChange={(e) => {
                    setComments(e.target.value);
                    if (errors.comments) setErrors((prev) => ({ ...prev, comments: null }));
                  }}
                  placeholder="Tell us what you'd love to see or what we can polish..."
                  className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-slate-500 text-sm focus:outline-none transition-all ${
                    errors.comments
                      ? 'border-red-500 bg-red-500/5 focus:border-red-400'
                      : 'border-white/10 focus:border-indigo-400'
                  }`}
                />
                {errors.comments && <p className="text-red-400 text-xs mt-1 font-semibold">{errors.comments}</p>}
              </div>

              {/* Optional Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1 block">Your Name (Optional)</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Sameer Kapoor"
                    className="w-full px-3 py-2 text-sm rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1 block">Email (If you’d like a reply)</label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => {
                      setUserEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                    }}
                    placeholder="you@domain.com"
                    className={`w-full px-3 py-2 text-sm rounded-xl bg-white/5 border text-white placeholder-slate-500 focus:outline-none transition-all ${
                      errors.email
                        ? 'border-red-500 bg-red-500/5 focus:border-red-400'
                        : 'border-white/10 focus:border-indigo-400'
                    }`}
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1 font-semibold">{errors.email}</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl font-bold text-sm btn-primary flex items-center justify-center gap-2"
              >
                {submitting ? 'Submitting...' : 'Submit Feedback ⭐'}
              </button>
            </form>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default Feedback;
