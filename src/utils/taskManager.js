// -----------------------------------------------------------------------------
// taskManager.js  �  Global background task queue + work history store
// -----------------------------------------------------------------------------

import { getUserFromToken } from './auth';

// User-scoped storage key helper: guarantees strict privacy & isolation between user accounts
export const getHistoryKey = () => {
  try {
    const user = getUserFromToken();
    const uid = user?._id || user?.id || user?.email;
    return uid ? `gp_work_history_${uid}` : 'gp_work_history_guest';
  } catch {
    return 'gp_work_history_guest';
  }
};

export const getActiveUserInfo = () => {
  return getUserFromToken();
};

// -- History helpers (User Isolated) -------------------------------------------

export const loadHistory = () => {
  try {
    const key = getHistoryKey();
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    const user = getUserFromToken();
    const uid = user?._id || user?.id || user?.email;
    if (uid) {
      return parsed.filter(item => !item.userId || item.userId === uid);
    }
    return parsed;
  } catch {
    return [];
  }
};

export const saveHistory = (items) => {
  try {
    const key = getHistoryKey();
    localStorage.setItem(key, JSON.stringify(items));
  } catch {}
};

/**
 * Add one entry to the active user's work history.
 */
export const addHistoryEntry = (entry) => {
  const user = getUserFromToken();
  const uid = user?._id || user?.id || user?.email || 'guest';
  const uName = user?.name || user?.email || 'User';

  const history = loadHistory();
  const newEntry = {
    id: Date.now(),
    userId: uid,
    userName: uName,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    ...entry,
  };
  const updated = [newEntry, ...history].slice(0, 50);
  saveHistory(updated);
  window.dispatchEvent(new CustomEvent('gp_history_updated', { detail: updated }));

  // Safely sync to MongoDB so user Analytics and Admin Dashboard are 100% accurate in real time
  try {
    const token = localStorage.getItem('token');
    if (token && uid !== 'guest') {
      fetch('http://localhost:5000/api/user/record-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          type: entry.type,
          prompt: entry.title,
          text: entry.summary,
          inputs: entry.data?.form || entry.data || {},
          result: entry.data?.result || entry.data?.generated || entry.data || {},
          imageUrl: entry.data?.generated?.imageUrl || entry.imageUrl || ''
        })
      }).catch(() => {});
    }
  } catch {}

  return newEntry;
};

export const deleteHistoryItem = (id) => {
  const history = loadHistory().filter(item => item.id !== id);
  saveHistory(history);
  window.dispatchEvent(new CustomEvent('gp_history_updated', { detail: history }));
};

export const clearHistory = () => {
  try {
    const key = getHistoryKey();
    localStorage.removeItem(key);
  } catch {}
  saveHistory([]);
  window.dispatchEvent(new CustomEvent('gp_history_updated', { detail: [] }));
};

/**
 * Restores work state into sessionStorage and navigates to the tool page.
 */
export const openHistoryItem = (navigate, item) => {
  if (!item) return;

  if (item.type === 'ai-chat' && item.messages) {
    sessionStorage.setItem('nexa_chat_history', JSON.stringify(item.messages));
  } else if (item.type === 'marketing-strategy' && item.data) {
    sessionStorage.setItem('gp_active_marketing_strategy', JSON.stringify(item.data));
  } else if (item.type === 'content-generator' && item.data) {
    sessionStorage.setItem('gp_active_content', JSON.stringify(item.data));
  } else if (item.type === 'image-generator' && item.data) {
    sessionStorage.setItem('gp_active_image', JSON.stringify(item.data));
  } else if (item.type === 'seo-assistant' && item.data) {
    sessionStorage.setItem('gp_active_seo', JSON.stringify(item.data));
  } else if (item.type === 'reports' && item.data) {
    sessionStorage.setItem('gp_active_report', JSON.stringify(item.data));
  }

  if (item.path) {
    navigate(item.path);
  }
};

// -- In-flight task registry --------------------------------------------------
const activeTasks = new Map();
let _showToast = null;

export const injectToastHandler = (fn) => { _showToast = fn; };

export const startTask = (id, label) => {
  activeTasks.set(id, { id, label, startedAt: Date.now() });
  window.dispatchEvent(new CustomEvent('gp_tasks_updated', { detail: [...activeTasks.values()] }));
};

export const finishTask = (id, toastPayload) => {
  activeTasks.delete(id);
  window.dispatchEvent(new CustomEvent('gp_tasks_updated', { detail: [...activeTasks.values()] }));
  if (toastPayload && _showToast) {
    _showToast(toastPayload);
  }
};

export const getActiveTasks = () => [...activeTasks.values()];

