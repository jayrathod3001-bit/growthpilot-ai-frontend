import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { startTask, finishTask, addHistoryEntry } from '../utils/taskManager';

const demoResponses = {
  sales: `Based on your business profile, here are **3 practical ways to improve your sales**:

1. 🎁 **Create limited-time promotional offers** — Flash sales and exclusive deals create urgency and drive immediate purchases.

2. 📸 **Publish product-focused content regularly** — Showcase your products with high-quality images and reels on Instagram and Facebook at least 3-4 times a week.

3. ⭐ **Use customer testimonials and social proof** — Share real customer reviews and before/after stories. Trust builds sales.

**For your next campaign**, focus on Instagram and WhatsApp to reach your target audience. A 30% discount offer with a 48-hour countdown works extremely well for jewellery businesses.`,

  marketing: `Here's a **comprehensive marketing plan** tailored for your business:

📅 **Month 1: Brand Awareness Phase**
- Post 15 high-quality content pieces across all platforms
- Run targeted Facebook and Instagram ads (₹500-1000/day budget)
- Collaborate with 2-3 local micro-influencers

📅 **Month 2: Engagement Phase**
- Launch a giveaway or contest to boost followers
- Start WhatsApp Business broadcast lists
- Create video content (Reels, YouTube Shorts)

📅 **Month 3: Conversion Phase**
- Push promotional offers and limited-time deals
- Retarget warm audiences with conversion ads
- Collect and showcase customer reviews

**Expected Result:** 40-60% increase in inquiries within 90 days.`,

  instagram: `Here's your **Instagram Growth Strategy**:

📸 **Content Types to Post:**
- Product photos: 3x per week (Monday, Wednesday, Friday)
- Reels & Short Videos: 2x per week
- Customer testimonials: 1x per week
- Behind-the-scenes: 1x per week

🏷️ **Best Hashtags for Jewellery:**
#GoldJewellery #BridalJewellery #JewelleryDesign #WeddingJewellery #AhmedabadJewellery

⏰ **Best Posting Times:**
- 7:00 PM - 9:00 PM (Evening engagement peak)
- 12:00 PM - 2:00 PM (Lunch break browsing)

💡 **Pro Tip:** Use Instagram Stories daily with polls, Q&A, and countdown timers for offers. Stories get 3x more engagement than regular posts.`,

  seo: `Your **SEO Analysis** shows great potential! Here are key improvements:

🎯 **Current Status:** Your website has decent foundational SEO but needs local optimization.

🔑 **Top Keywords to Target:**
- "Gold jewellery Ahmedabad" (High volume, medium competition)
- "Bridal jewellery near me" (High intent, converts well)
- "Custom gold jewellery Ahmedabad"
- "Wedding jewellery Gujarat"

📝 **Recommended Meta Title:**
"Premium Gold & Bridal Jewellery in Ahmedabad | Triratna Jewels"

📋 **Recommended Meta Description:**
"Explore premium gold and bridal jewellery collections crafted for weddings and special occasions. Visit our showroom in Ahmedabad today."

✅ **Quick Wins:**
1. Add your business to Google My Business
2. Get 10+ Google Reviews (huge ranking factor)
3. Create a "Wedding Jewellery Collection" page
4. Add location to your page titles`,

  content: `Here are **5 ready-to-use content ideas** for your business this week:

📱 **Monday - Product Spotlight:**
"✨ Introducing our latest Gold Necklace Collection — crafted for those who love timeless elegance. Available in 22K & 24K gold. DM us for pricing! #GoldJewellery"

📱 **Wednesday - Testimonial:**
"💛 'The necklace was perfect for my wedding day!' — Thank you [Customer Name] for trusting us with your special moment! ⭐⭐⭐⭐⭐"

📱 **Friday - Offer:**
"🎉 Weekend Special! Get 15% off on all bridal sets this weekend only. Visit us or call +91 XXXXXXXXXX. Offer valid till Sunday midnight! ⏰"

📱 **Reel Idea:**
Behind-the-scenes: Show the crafting process of a gold necklace. Caption: "From gold to glory — every piece tells a story ✨"

📱 **Story Idea:**
Poll: "Which style do you prefer? 💛 Traditional vs ✨ Modern" — This boosts engagement by 200%!`,

  default: `Hello! I'm **Nexa AI**, your intelligent business growth assistant. 🤖

I can help you with:
- 📈 **Sales strategies** to grow your revenue
- 🎯 **Marketing plans** for your target audience
- 📸 **Social media** content and growth tips
- 🔍 **SEO optimization** for better online visibility
- ✍️ **Content ideas** for your business

**Try asking me:**
- "How can I increase sales?"
- "Create a marketing strategy for my business"
- "How to grow on Instagram?"
- "SEO tips for my jewellery business"
- "Give me content ideas"

I'm here to help your business grow smarter! 🚀`,
};

const getAIResponse = (question) => {
  const q = question.toLowerCase();
  if (q.includes('sale') || q.includes('revenue') || q.includes('customer') || q.includes('profit'))
    return demoResponses.sales;
  if (q.includes('marketing') || q.includes('campaign') || q.includes('advertis') || q.includes('promote'))
    return demoResponses.marketing;
  if (q.includes('instagram') || q.includes('social media') || q.includes('facebook') || q.includes('post'))
    return demoResponses.instagram;
  if (q.includes('seo') || q.includes('google') || q.includes('search') || q.includes('keyword'))
    return demoResponses.seo;
  if (q.includes('content') || q.includes('caption') || q.includes('write') || q.includes('idea'))
    return demoResponses.content;
  return demoResponses.default;
};

const CHAT_STORAGE_KEY = 'nexa_chat_history';

const loadSavedMessages = () => {
  try {
    const saved = sessionStorage.getItem(CHAT_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
};

const AIChat = () => {
  const [messages, setMessages] = useState(() => {
    const saved = loadSavedMessages();
    if (saved && Array.isArray(saved) && saved.length > 0) return saved;
    return [{
      id: 1,
      role: 'ai',
      text: `Hello! I'm **Nexa AI** — your intelligent business growth assistant. 🤖\n\nI can help you with sales, marketing, content, SEO, and more. What would you like to work on today?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    try { sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages)); } catch {}
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const currentInput = input;
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    const taskId = `chat_${Date.now()}`;
    startTask(taskId, `AI Chat: "${currentInput.slice(0, 40)}..."`);

    try {
      const token = localStorage.getItem('token');
      const apiPayload = {
        messages: updatedMessages.map((m) => ({
          role: m.role === 'ai' ? 'assistant' : 'user',
          content: m.text,
        })),
        userMessage: currentInput,
      };

      const res = await axios.post('http://localhost:5000/api/ai/chat', apiPayload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        timeout: 12000,
      });

      const replyText = res.data?.data?.reply || getAIResponse(currentInput);
      const aiReply = {
        id: Date.now() + 1,
        role: 'ai',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      const finalMessages = [...updatedMessages, aiReply];
      setMessages(finalMessages);

      // Save to history
      addHistoryEntry({
        type: 'ai-chat',
        icon: '🤖',
        title: `Chat: ${currentInput.slice(0, 45)}`,
        summary: replyText.replace(/\*\*/g, '').slice(0, 80) + '...',
        path: '/ai-chat',
        color: '#6366f1',
        messages: finalMessages,
      });

      finishTask(taskId, {
        icon: '🤖',
        title: 'AI Consultation Ready',
        text: 'Your customized business growth strategy is ready to review.',
        color: '#6366f1',
      });
    } catch (err) {
      console.warn('AI Chat fallback triggered:', err.message);
      const replyText = getAIResponse(currentInput);
      const fallbackReply = {
        id: Date.now() + 1,
        role: 'ai',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      const finalMessages = [...updatedMessages, fallbackReply];
      setMessages(finalMessages);

      addHistoryEntry({
        type: 'ai-chat',
        icon: '🤖',
        title: `Chat: ${currentInput.slice(0, 45)}`,
        summary: replyText.replace(/\*\*/g, '').slice(0, 80) + '...',
        path: '/ai-chat',
        color: '#6366f1',
        messages: finalMessages,
      });

      finishTask(taskId, {
        icon: '🤖',
        title: 'AI Consultation Ready',
        text: 'Your customized business growth strategy is ready to review.',
        color: '#6366f1',
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const [copiedId, setCopiedId] = useState(null);
  const handleCopyMessage = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatText = (text) => {
    if (!text) return '';
    return text
      .replace(/^### (.*$)/gim, '<h3 class="text-base font-bold text-indigo-300 mt-3 mb-1">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-lg font-extrabold text-white mt-3 mb-1.5 pb-1 border-b border-white/10">$1</h2>')
      .replace(/^\* (.*$)/gim, '<div class="flex items-start gap-2 my-1"><span class="text-indigo-400 mt-1">✦</span><span>$1</span></div>')
      .replace(/^- (.*$)/gim, '<div class="flex items-start gap-2 my-1"><span class="text-indigo-400 mt-1">✦</span><span>$1</span></div>')
      .replace(/^(\d+)\.\s+(.*$)/gim, '<div class="flex items-start gap-2.5 my-1.5"><span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/25 text-indigo-300 shrink-0 mt-0.5">$1</span><span>$2</span></div>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-200 font-bold">$1</strong>')
      .replace(/\n\n/g, '<div class="h-2"></div>')
      .replace(/\n/g, '<br/>');
  };

  const suggestedQuestions = [
    'How can I increase sales?',
    'Create a marketing strategy',
    'How to grow on Instagram?',
    'SEO tips for my business',
  ];

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-100px)]">

      <div className="chat-header">
        <div className="w-12 h-12 logo-badge text-2xl glow-purple">
          🤖
        </div>
        <div>
          <h1 className="text-lg font-black text-white">Nexa AI</h1>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
            <span className="text-xs text-gray-400">Always online — Your AI Business Assistant</span>
          </div>
        </div>
        <button
          onClick={() => {
            const freshMsg = [{
              id: Date.now(), role: 'ai',
              text: "Hello! I'm **Nexa AI** — ready to help your business grow! 🚀",
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }];
            setMessages(freshMsg);
            try { sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(freshMsg)); } catch {}
          }}
          className="ml-auto text-xs px-3 py-1.5 rounded-lg btn-ghost-muted"
        >
          Clear Chat
        </button>
      </div>

      <div className="chat-messages-area space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 fade-in-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >

            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 ${msg.role === 'ai'
                ? 'logo-badge'
                : 'bg-indigo-500/20 border border-indigo-500/30'
                }`}
            >
              {msg.role === 'ai' ? '🤖' : '👤'}
            </div>

            <div
              className={`max-w-2xl rounded-2xl p-4 shadow-lg ${msg.role === 'ai'
                ? 'chat-bubble-ai border border-indigo-500/20'
                : 'chat-bubble-user'
                }`}
            >
              {msg.role === 'ai' && (
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5 text-[11px]">
                  <span className="text-indigo-400 font-semibold tracking-wide uppercase flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
                    Verified Strategy Advisor
                  </span>
                  <button
                    onClick={() => handleCopyMessage(msg.id, msg.text)}
                    className="text-slate-400 hover:text-white px-2 py-0.5 rounded hover:bg-white/5 transition-colors flex items-center gap-1"
                  >
                    {copiedId === msg.id ? '✓ Copied' : '📋 Copy'}
                  </button>
                </div>
              )}
              <div
                className="text-sm leading-relaxed prose-invert space-y-1"
                dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
              />
              <p className={`text-[11px] mt-2 ${msg.role === 'ai' ? 'text-slate-500 text-right' : 'text-white/60'}`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 fade-in-up">
            <div className="w-8 h-8 logo-badge text-sm shrink-0">
              🤖
            </div>
            <div className="rounded-2xl px-5 py-4 chat-bubble-ai">
              <div className="flex gap-1.5 items-center">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-suggestions-bar">
        {suggestedQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => setInput(q)}
            className="text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors btn-outline-purple shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      <div className="chat-input-bar">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Nexa AI anything about your business..."
          rows={1}
          className="flex-1 px-4 py-3 text-sm resize-none form-input"
          disabled={isTyping}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="px-5 py-3 rounded-xl font-bold btn-primary disabled:opacity-40"
        >
          {isTyping ? '...' : 'Send ↗'}
        </button>
      </div>
    </div>
  );
};

export default AIChat;
