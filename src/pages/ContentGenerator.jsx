import React, { useState } from 'react';
import axios from 'axios';

const platforms = ['Instagram', 'Facebook', 'WhatsApp', 'Twitter', 'LinkedIn', 'YouTube'];
const contentTypes = ['Caption', 'Product Description', 'Blog Post Intro', 'Ad Copy', 'Story Text', 'Email Subject'];
const tones = ['Luxury', 'Friendly', 'Professional', 'Exciting', 'Inspirational', 'Informative'];
const audienceOptions = ['Young Adults (18-25)', 'Professionals', 'Families', 'Brides & Grooms', 'Local Community', 'Online Shoppers'];

const generateContent = ({ platform, contentType, product, tone, targetAudience, topic }) => {
  const templates = {
    luxury: {
      caption: `✨ ${topic || 'Timeless Elegance Redefined'}

Discover our exquisite ${product || 'collection'} — crafted for those who appreciate the finest things in life.

Every piece tells a story. Every moment becomes unforgettable.

🏆 Premium Quality | 💎 Handcrafted | 🚚 Free Delivery

Visit us today or DM for exclusive pricing.

#${(product || 'Jewellery').replace(/\s+/g, '')} #LuxuryStyle #Premium${platform}`,
      ad: `💎 Experience ${tone} Excellence

${topic || `Introducing our ${product || 'newest collection'}`} — where craftsmanship meets sophistication.

✅ Premium Materials
✅ Expert Craftsmanship  
✅ Exclusive Designs

Limited pieces available. Reserve yours today.

📞 Call Now | 📍 Visit Our Showroom`,
    },
    friendly: {
      caption: `Hey! 👋 We have something special for you!

Check out our amazing ${product || 'new collection'} — perfect for ${targetAudience || 'everyone'}! 🎉

${topic || 'We put so much love into creating this just for you!'}

Drop a ❤️ if you love it and tag a friend who'd want this!

#${(product || 'New').replace(/\s+/g, '')} #MustHave #${platform}Finds`,
    },
    professional: {
      caption: `Introducing ${topic || `Our ${product || 'Latest Collection'}`}

We are proud to present our newest ${product || 'offering'}, designed specifically for ${targetAudience || 'discerning customers'} who value quality and excellence.

Key Highlights:
• Superior craftsmanship
• Premium materials
• Competitive pricing
• Expert consultation available

Connect with us for more information.`,
    },
  };

  const toneKey = tone.toLowerCase();
  const template = templates[toneKey] || templates.friendly;
  const contentKey = contentType.toLowerCase().includes('ad') ? 'ad' : 'caption';
  return template[contentKey] || template.caption || Object.values(template)[0];
};

import { startTask, finishTask, addHistoryEntry } from '../utils/taskManager';

const ContentGenerator = () => {
  const [form, setForm] = useState(() => {
    try {
      const saved = sessionStorage.getItem('gp_active_content');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.form) return parsed.form;
      }
    } catch {}
    return {
      platform: 'Instagram',
      contentType: 'Caption',
      product: '',
      tone: 'Luxury',
      targetAudience: '',
      topic: '',
    };
  });
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(() => {
    try {
      const saved = sessionStorage.getItem('gp_active_content');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.result) return parsed.result;
      }
    } catch {}
    return '';
  });
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.product.trim()) {
      newErrors.product = 'Product / Service is required';
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

    const taskId = `content_${Date.now()}`;
    startTask(taskId, `Content: ${form.contentType} for ${form.product.slice(0, 30)}`);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/ai/content-generator', form, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        timeout: 20000,
      });

      const generatedText = (res.data?.status === 1 && res.data?.data?.content)
        ? res.data.data.content
        : generateContent(form);

      setResult(generatedText);

      addHistoryEntry({
        type: 'content-generator',
        icon: '✍️',
        title: `${form.contentType}: ${form.product}`,
        summary: generatedText.slice(0, 100) + '...',
        path: '/content-generator',
        color: '#06b6d4',
        data: { form, result: generatedText },
      });

      finishTask(taskId, {
        icon: '✍️',
        title: 'Content Copy Ready',
        text: 'Your marketing content and captions have been generated.',
        color: '#06b6d4',
      });
    } catch (err) {
      console.warn('Content Generator fallback triggered:', err.message);
      const generatedText = generateContent(form);
      setResult(generatedText);

      addHistoryEntry({
        type: 'content-generator',
        icon: '✍️',
        title: `${form.contentType}: ${form.product}`,
        summary: generatedText.slice(0, 100) + '...',
        path: '/content-generator',
        color: '#06b6d4',
        data: { form, result: generatedText },
      });

      finishTask(taskId, {
        icon: '✍️',
        title: 'Content Copy Ready',
        text: 'Your marketing content and captions have been generated.',
        color: '#06b6d4',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl btn-cyan">
          ✍️
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Content Generator</h1>
          <p className="text-sm text-slate-500">Create professional content for any platform instantly</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="rounded-2xl p-6 space-y-4 card-cyan-border">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-cyan-400">
            Content Settings
          </h2>

          <form onSubmit={handleGenerate} className="space-y-4" noValidate>
            <div>
              <label className="form-label-xs">Platform</label>
              <select name="platform" value={form.platform} onChange={handleChange}
                className="w-full px-4 py-3 text-sm form-input">
                <option value="">Select Platform</option>
                {platforms.map(o => <option key={o} value={o} className="bg-[#1e1e3a] text-white">{o}</option>)}
              </select>
            </div>

            <div>
              <label className="form-label-xs">Content Type</label>
              <select name="contentType" value={form.contentType} onChange={handleChange}
                className="w-full px-4 py-3 text-sm form-input">
                <option value="">Select Content Type</option>
                {contentTypes.map(o => <option key={o} value={o} className="bg-[#1e1e3a] text-white">{o}</option>)}
              </select>
            </div>

            <div>
              <label className="form-label-xs">Tone</label>
              <select name="tone" value={form.tone} onChange={handleChange}
                className="w-full px-4 py-3 text-sm form-input">
                <option value="">Select Tone</option>
                {tones.map(o => <option key={o} value={o} className="bg-[#1e1e3a] text-white">{o}</option>)}
              </select>
            </div>

            <div>
              <label className="form-label-xs">Target Audience</label>
              <select name="targetAudience" value={form.targetAudience} onChange={handleChange}
                className="w-full px-4 py-3 text-sm form-input">
                <option value="">Select Target Audience</option>
                {audienceOptions.map(o => <option key={o} value={o} className="bg-[#1e1e3a] text-white">{o}</option>)}
              </select>
            </div>

            <div>
              <label className="form-label-xs">Product / Service *</label>
              <input type="text" name="product" value={form.product} onChange={handleChange}
                placeholder="e.g. Gold Necklace, Designer Ring"
                className={`w-full px-4 py-3 text-sm form-input ${errors.product ? 'border border-red-500' : ''}`} />
              {errors.product && (
                <p className="text-red-500 text-xs mt-1.5">{errors.product}</p>
              )}
            </div>

            <div>
              <label className="form-label-xs">Topic / Theme</label>
              <input type="text" name="topic" value={form.topic} onChange={handleChange}
                placeholder="e.g. Wedding Collection, Diwali Sale"
                className="w-full px-4 py-3 text-sm form-input" />
            </div>

            <button type="submit"
              disabled={isGenerating}
              className={`w-full py-3.5 rounded-xl btn-cyan ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {isGenerating ? '⏳ Crafting with Qwen AI...' : '✨ Generate Content'}
            </button>
          </form>
        </div>

        <div className="rounded-2xl p-6 card-cyan-border shadow-2xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block animate-pulse" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                Publication-Ready Copy
              </h2>
            </div>
            {result && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 font-mono">
                  {result.trim().split(/\s+/).length} words · {result.length} chars
                </span>
                <button
                  onClick={handleCopy}
                  className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                    copied
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      : 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30'
                  }`}
                >
                  {copied ? '✓ Copied to Clipboard' : '📋 Copy Text'}
                </button>
                <button
                  onClick={() => setResult('')}
                  className="text-xs px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-white transition-colors"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="rounded-xl p-5 min-h-64 relative bg-[#0b101b] border border-cyan-500/30 shadow-inner">
                <div className="text-sm leading-relaxed whitespace-pre-wrap font-sans text-slate-200 selection:bg-cyan-500/30">
                  {result}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 flex items-center gap-1">
                  <span>📱</span> {form.platform} Optimized
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 flex items-center gap-1">
                  <span>🎨</span> {form.tone} Tone
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 flex items-center gap-1">
                  <span>🎯</span> {form.contentType}
                </span>
              </div>
            </div>
          ) : (
            <div className="h-72 flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-xl">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-2xl text-cyan-400 mb-3">
                ✍️
              </div>
              <p className="text-sm font-semibold text-white">
                Ready to generate marketing copy
              </p>
              <p className="text-xs mt-1.5 text-slate-400 max-w-sm">
                Select your target platform, tone, and product details on the left, then click Generate to create tailored promotional content.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentGenerator;
