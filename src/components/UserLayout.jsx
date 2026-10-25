import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import UserHeader from './UserHeader';
import { getActiveTasks } from '../utils/taskManager';

const menuItems = [
  { name: 'Dashboard', path: '/user-dashboard', icon: '🏠' },
  { name: 'AI Chat', path: '/ai-chat', icon: '🤖' },
  { name: 'Marketing Strategy', path: '/marketing-strategy', icon: '🎯' },
  { name: 'Content Generator', path: '/content-generator', icon: '✍️' },
  { name: 'Image Generator', path: '/image-generator', icon: '🖼️' },
  { name: 'SEO Assistant', path: '/seo-assistant', icon: '🔍' },
  { name: 'Reports', path: '/reports', icon: '📊' },
  { name: 'Analytics', path: '/analytics', icon: '📈' },
  { name: 'History', path: '/history', icon: '📜' },
  { name: 'Settings', path: '/settings', icon: '⚙️' },
];

const UserLayout = ({ children }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [activeTasks, setActiveTasks] = useState(() => getActiveTasks());

  // Listen for background task updates
  useEffect(() => {
    const onTasks = (e) => setActiveTasks(e.detail || []);
    window.addEventListener('gp_tasks_updated', onTasks);
    return () => window.removeEventListener('gp_tasks_updated', onTasks);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    try { sessionStorage.clear(); } catch {}
    window.dispatchEvent(new CustomEvent('gp_history_updated', { detail: [] }));
    setShowLogoutConfirm(false);
    navigate('/login');
  };

  return (
    <div className="main-layout-bg h-screen max-h-screen flex flex-col overflow-hidden">
      <UserHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} activeTasks={activeTasks} />
      <div className="flex flex-1 overflow-hidden min-h-0">

        <aside
          className={`sidebar-container sidebar-transition flex-shrink-0 ${sidebarOpen ? 'w-60 min-w-[15rem]' : 'w-0 min-w-0 border-r-0'
            }`}
        >
          <div className="p-4 flex-1 overflow-y-auto">
            <div className="text-xs font-semibold uppercase tracking-widest mb-4 px-2 text-indigo-400 whitespace-nowrap">
              Main Menu
            </div>
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 whitespace-nowrap ${isActive
                      ? 'btn-primary shadow-lg text-white'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <span className="text-base shrink-0">{item.icon}</span>
                  <span className="truncate">{item.name}</span>
                </NavLink>
              ))}
            </nav>

            {/* ── Active Background Tasks ───────────────────────────────── */}
            {activeTasks.length > 0 && (
              <div className="mt-4 mb-2">
                <div className="text-xs font-semibold uppercase tracking-widest mb-2 px-2 text-amber-400 whitespace-nowrap flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
                  Running ({activeTasks.length})
                </div>
                <div className="space-y-1.5">
                  {activeTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20"
                    >
                      <span className="text-amber-400 animate-spin text-xs">⟳</span>
                      <span className="text-xs text-amber-300 truncate">{task.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resources & Support in Sidebar */}
            <div className="mt-4 pt-3 border-t border-white/5 space-y-1">
              <div className="text-[10px] font-semibold uppercase tracking-widest mb-2 px-2 text-slate-500 whitespace-nowrap">
                Resources
              </div>
              <NavLink
                to="/support"
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
              >
                <span className="text-sm">💡</span>
                <span className="truncate">Help & Support</span>
              </NavLink>
              <NavLink
                to="/feedback"
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
              >
                <span className="text-sm">⭐</span>
                <span className="truncate">Send Feedback</span>
              </NavLink>
              <NavLink
                to="/faq"
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
              >
                <span className="text-sm">❓</span>
                <span className="truncate">FAQ</span>
              </NavLink>
            </div>

          </div>

          <div className="p-4 border-t border-white/10 shrink-0">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-white/5 text-red-400 whitespace-nowrap"
            >
              <span className="shrink-0">🚪</span>
              <span className="truncate">Logout</span>
            </button>
          </div>
        </aside>

        <main className="flex-1 p-6 overflow-y-auto bg-[#0f0f1a] min-h-0">
          {children}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl p-6 card-glass border border-white/10 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-2xl flex items-center justify-center mx-auto">
              🚪
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Confirm Logout</h3>
              <p className="text-sm text-slate-400">
                Are you sure you want to log out of your GrowthPilot AI account?
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold bg-white/5 hover:bg-white/10 text-slate-300 transition-colors border border-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-lg shadow-red-500/25 transition-all"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserLayout;
