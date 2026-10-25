import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadHistory, clearHistory, deleteHistoryItem, openHistoryItem, getActiveUserInfo } from '../utils/taskManager';

const categories = [
  { id: 'all', label: 'All History', icon: '🌐' },
  { id: 'ai-chat', label: 'AI Chat', icon: '🤖' },
  { id: 'marketing-strategy', label: 'Marketing Strategy', icon: '🎯' },
  { id: 'content-generator', label: 'Content Generator', icon: '✍️' },
  { id: 'image-generator', label: 'Image Generator', icon: '🖼️' },
  { id: 'seo-assistant', label: 'SEO Assistant', icon: '🔍' },
  { id: 'reports', label: 'Reports', icon: '📊' },
  { id: 'analytics', label: 'Analytics', icon: '📈' },
];

const categoryBadgeStyle = {
  'ai-chat': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  'marketing-strategy': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'content-generator': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'image-generator': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'seo-assistant': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'reports': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'analytics': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
};

const History = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => getActiveUserInfo());
  const [history, setHistory] = useState(() => loadHistory());
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    setCurrentUser(getActiveUserInfo());
    setHistory(loadHistory());
    const handleUpdate = (e) => {
      setHistory(e.detail || loadHistory());
      setCurrentUser(getActiveUserInfo());
    };
    window.addEventListener('gp_history_updated', handleUpdate);
    return () => window.removeEventListener('gp_history_updated', handleUpdate);
  }, []);

  const filteredHistory = history.filter((item) => {
    const matchesFilter = filter === 'all' || item.type === filter;
    const matchesSearch =
      !search.trim() ||
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.summary?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleOpenItem = (item) => {
    openHistoryItem(navigate, item);
  };

  const handleDeleteItem = (e, id) => {
    e.stopPropagation();
    deleteHistoryItem(id);
  };

  const handleClearAll = () => {
    clearHistory();
    setShowClearConfirm(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/10">
            📜
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black text-white">Work History</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                {history.length} Saved
              </span>
              {currentUser && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <span>👤</span>
                  <span>{currentUser.name || currentUser.email || 'My Account'}</span>
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400">
              Personalized activity history for {currentUser?.name || currentUser?.email || 'your account'}. Only your work is shown here.
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="self-start md:self-auto text-xs px-4 py-2 rounded-xl text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all font-semibold"
          >
            🗑️ Clear My History
          </button>
        )}
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const count =
              cat.id === 'all'
                ? history.length
                : history.filter((h) => h.type === cat.id).length;
            const isActive = filter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'btn-primary text-white border-transparent shadow-lg'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search work history by keywords, prompts, or results..."
            className="w-full px-4 py-3 pl-10 text-sm form-input rounded-xl"
          />
          <span className="absolute left-3.5 top-3.5 text-slate-400 text-sm">🔍</span>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* History Items Grid */}
      {filteredHistory.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHistory.map((item) => {
            const badgeClass = categoryBadgeStyle[item.type] || 'bg-slate-500/20 text-slate-300 border-slate-500/30';
            return (
              <div
                key={item.id}
                onClick={() => handleOpenItem(item)}
                className="group relative rounded-2xl p-5 card-glass border border-white/10 hover:border-indigo-500/40 transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-xl hover:shadow-indigo-500/5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{item.icon || '📜'}</span>
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badgeClass}`}
                      >
                        {categories.find((c) => c.id === item.type)?.label || item.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500 font-medium">
                        {item.date} · {item.time}
                      </span>
                      <button
                        onClick={(e) => handleDeleteItem(e, item.id)}
                        title="Delete this item"
                        className="text-slate-500 hover:text-red-400 p-1 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 mb-1.5">
                    {item.title}
                  </h3>

                  {item.summary && (
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                      {item.summary}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">Click anywhere to open</span>
                  <span className="text-indigo-400 group-hover:text-indigo-300 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Open Work ↗
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl p-12 card-glass border border-white/10 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 text-3xl flex items-center justify-center mx-auto text-slate-400">
            📜
          </div>
          <div>
            <h3 className="text-base font-bold text-white mb-1">
              {search || filter !== 'all' ? 'No matching history found' : 'No history yet'}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {search || filter !== 'all'
                ? 'Try adjusting your search terms or filter to find what you are looking for.'
                : 'Whenever you use Nexa AI Chat, generate marketing strategies, create captions, images, or SEO reports, they will be automatically saved here for quick access.'}
            </p>
          </div>
          {search ? (
            <button
              onClick={() => {
                setSearch('');
                setFilter('all');
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold btn-outline-purple"
            >
              Reset Filters
            </button>
          ) : (
            <button
              onClick={() => navigate('/ai-chat')}
              className="px-5 py-2.5 rounded-xl text-xs font-bold btn-primary"
            >
              Start New AI Chat 🚀
            </button>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl p-6 card-glass border border-white/10 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-2xl flex items-center justify-center mx-auto">
              🗑️
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Clear All History?</h3>
              <p className="text-xs text-slate-400">
                Are you sure you want to clear your saved work history? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 transition-colors border border-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/25 transition-all"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
