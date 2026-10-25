import React, { useState } from 'react';
import axios from 'axios';
import { startTask, finishTask, addHistoryEntry } from '../utils/taskManager';

const imageTypes = ['Product Advertisement', 'Social Media Post', 'Story Banner', 'Logo Design', 'Promotional Banner'];
const styles = ['Luxury', 'Minimal', 'Bold & Vibrant', 'Natural & Organic', 'Modern & Clean'];
const ratios = ['1:1 (Square)', '9:16 (Story)', '16:9 (Landscape)', '4:5 (Portrait)'];

const ImageGenerator = () => {
  const [form, setForm] = useState(() => {
    try {
      const saved = sessionStorage.getItem('gp_active_image');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.form) return parsed.form;
      }
    } catch {}
    return {
      prompt: '',
      imageType: 'Product Advertisement',
      style: 'Luxury',
      ratio: '1:1 (Square)',
    };
  });
  const [errors, setErrors] = useState({});
  const [generated, setGenerated] = useState(() => {
    try {
      const saved = sessionStorage.getItem('gp_active_image');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.generated) return parsed.generated;
      }
    } catch {}
    return null;
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.prompt.trim()) {
      newErrors.prompt = 'Image prompt is required';
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
    setGenerated(null);

    const taskId = `image_${Date.now()}`;
    startTask(taskId, `Image: "${form.prompt.slice(0, 30)}..."`);

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        'http://localhost:5000/api/generate-image',
        {
          prompt: form.prompt.trim(),
          style: form.style,
          imageType: form.imageType,
          ratio: form.ratio,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
          },
        }
      );

      if (response.data.status === 1 && response.data.data) {
        const imageResult = {
          ...response.data.data,
          style: form.style,
          imageType: form.imageType,
          ratio: form.ratio,
          userPrompt: form.prompt,
        };
        setGenerated(imageResult);

        addHistoryEntry({
          type: 'image-generator',
          icon: '🖼️',
          title: `Image: ${form.prompt.slice(0, 45)}`,
          summary: `${form.imageType} · ${form.style} · ${form.ratio}`,
          path: '/image-generator',
          color: '#10b981',
          data: { form, generated: imageResult },
        });

        finishTask(taskId, {
          icon: '🖼️',
          title: 'Creative Asset Rendered',
          text: 'Your generated image visual is ready to preview and download.',
          color: '#10b981',
        });
      } else {
        setErrors({ general: response.data.message || 'Image generation failed.' });
        finishTask(taskId);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Error connecting to image generation service.';
      setErrors({ general: msg });
      finishTask(taskId);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generated?.imageUrl) return;
    const link = document.createElement('a');
    link.href = generated.imageUrl;
    link.download = `growthpilot-ai-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl btn-green">
          🖼️
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">AI Image Generator</h1>
          <p className="text-sm text-slate-400">
            Powered by Google Gemini (Imagen 3) with automatic Backup Fallback
          </p>
        </div>
      </div>

      {errors.general && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
          <span>⚠️</span>
          <span>{errors.general}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Input Settings Panel */}
        <div className="rounded-2xl p-6 space-y-4 card-green-border">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
              Image Settings
            </h2>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
              Gemini + Backup Auto-Switch
            </span>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4" noValidate>
            <div>
              <label className="form-label-xs">Image Prompt *</label>
              <textarea
                name="prompt"
                value={form.prompt}
                onChange={handleChange}
                placeholder="e.g. Luxury diamond necklace for bridal collection, elegant velvet background, soft golden studio lighting, 8k resolution..."
                rows={3}
                className={`w-full px-4 py-3 text-sm resize-none form-input ${errors.prompt ? 'border border-red-500' : ''}`}
                disabled={isGenerating}
              />
              {errors.prompt && (
                <p className="text-red-500 text-xs mt-1.5">{errors.prompt}</p>
              )}
            </div>

            <div>
              <label className="form-label-xs">Image Type</label>
              <select
                name="imageType"
                value={form.imageType}
                onChange={handleChange}
                disabled={isGenerating}
                className="w-full px-4 py-3 text-sm form-input"
              >
                {imageTypes.map(t => <option key={t} value={t} className="bg-[#1e1e3a] text-white">{t}</option>)}
              </select>
            </div>

            <div>
              <label className="form-label-xs">Visual Style</label>
              <select
                name="style"
                value={form.style}
                onChange={handleChange}
                disabled={isGenerating}
                className="w-full px-4 py-3 text-sm form-input"
              >
                {styles.map(s => <option key={s} value={s} className="bg-[#1e1e3a] text-white">{s}</option>)}
              </select>
            </div>

            <div>
              <label className="form-label-xs">Aspect Ratio</label>
              <select
                name="ratio"
                value={form.ratio}
                onChange={handleChange}
                disabled={isGenerating}
                className="w-full px-4 py-3 text-sm form-input"
              >
                {ratios.map(r => <option key={r} value={r} className="bg-[#1e1e3a] text-white">{r}</option>)}
              </select>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3.5 rounded-xl btn-green disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer font-bold shadow-lg"
            >
              {isGenerating ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating with AI...
                </>
              ) : (
                '🖼️ Generate Image'
              )}
            </button>
          </form>
        </div>

        {/* Output Panel */}
        <div className="rounded-2xl p-6 card-green-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
                Generated Result
              </h2>
              {generated?.engine && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-semibold">
                  ⚡ {generated.engine}
                </span>
              )}
            </div>

            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-80 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                <div className="relative w-16 h-16 mb-4">
                  <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
                  <span className="absolute inset-0 flex items-center justify-center text-2xl">✨</span>
                </div>
                <p className="text-sm font-semibold text-white">Rendering your image with AI...</p>
                <p className="text-xs mt-2 text-slate-400">
                  Processing prompt with Gemini / Backup engine
                </p>
              </div>
            ) : generated ? (
              <div className="space-y-4">
                <div className="rounded-xl overflow-hidden border border-white/10 bg-black/40 flex items-center justify-center max-h-96">
                  <img
                    src={generated.imageUrl}
                    alt={generated.userPrompt || 'Generated image'}
                    className="w-full h-auto object-contain max-h-96 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-400 block mb-0.5">Style</span>
                    <span className="text-white font-semibold">{generated.style}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-400 block mb-0.5">Format</span>
                    <span className="text-white font-semibold">{generated.ratio}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleDownload}
                    className="flex-1 py-2.5 rounded-xl font-semibold text-sm btn-green flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    ⬇ Download Image
                  </button>
                  <button
                    onClick={() => setGenerated(null)}
                    className="py-2.5 px-4 rounded-xl font-semibold text-sm transition-all hover:bg-white/10 border border-white/15 text-slate-300 cursor-pointer"
                  >
                    🔄 Clear
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-80 flex flex-col items-center justify-center bg-emerald-500/5 border border-dashed border-emerald-500/20 rounded-xl text-center p-6">
                <span className="text-6xl mb-4 opacity-25">🎨</span>
                <p className="text-sm font-semibold text-white">No image generated yet</p>
                <p className="text-xs mt-2 text-slate-400 max-w-xs">
                  Enter your product or marketing idea on the left and click "Generate Image"
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ImageGenerator;
