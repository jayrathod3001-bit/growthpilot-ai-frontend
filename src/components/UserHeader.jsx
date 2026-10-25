import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUserFromToken } from '../utils/auth';

const UserHeader = ({ onMenuToggle }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('User');
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [businesses, setBusinesses] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const fetchUserBusinesses = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.get('http://localhost:5000/api/get-my-businesses', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });

      if (response.data.status === 1 && response.data.data) {
        const list = response.data.data;
        setBusinesses(list);

        if (response.data.user?.name) {
          setUserName(response.data.user.name);
        }

        if (list.length > 0) {
          const activeId = response.data.activeBusinessId;
          const activeBiz = list.find((b) => b._id === activeId) || list[0];
          setSelectedBusiness(activeBiz.businessName);
        } else {
          setSelectedBusiness('No Business Added');
        }
      }
    } catch (err) {
      console.log('Error fetching user businesses:', err.message);
    }
  };

  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await axios.get('http://localhost:5000/api/user/notifications', {
        headers: { Authorization: 'Bearer ' + token },
      });
      if (res.data.status === 1 && res.data.data) {
        setNotifications(res.data.data);
      }
    } catch {
      // Fallback notifications if offline
      setNotifications([
        { id: 1, type: 'welcome', title: '🎉 Welcome to GrowthPilot AI!', message: 'Explore your Marketing Strategy & SEO audit tools.', time: new Date() },
        { id: 2, type: 'tip', title: '💡 Pro Tip', message: 'Download your reports as PDF directly from the dashboard.', time: new Date() }
      ]);
    }
  };

  useEffect(() => {
    const user = getUserFromToken();
    if (user?.name) {
      setUserName(user.name);
    }

    fetchUserBusinesses();
    fetchNotifications();

    const handleBizChange = (e) => {
      if (e?.detail?.businessName) {
        setSelectedBusiness(e.detail.businessName);
      }
      fetchUserBusinesses();
    };

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifDropdown(false);
      }
    };

    window.addEventListener('businessChanged', handleBizChange);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('businessChanged', handleBizChange);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleBusinessChange = async (e, biz) => {
    e.stopPropagation(); // prevent click from bubbling to toggle button
    setSelectedBusiness(biz.businessName);
    setShowDropdown(false);
    window.dispatchEvent(new CustomEvent('businessChanged', { detail: biz }));

    const token = localStorage.getItem('token');
    if (token && biz._id) {
      try {
        await axios.put(
          'http://localhost:5000/api/set-active-business',
          { businessId: biz._id },
          { headers: { Authorization: 'Bearer ' + token } }
        );
      } catch (err) {
        console.log('Error saving active business to database:', err.message);
      }
    }
  };

  return (
    <header className="app-header">

      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="text-gray-400 hover:text-white transition-colors text-xl"
        >
          ☰
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 logo-badge text-xs">
            GP
          </div>
          <span className="font-bold text-white text-lg hidden sm:block">GrowthPilot AI</span>
        </div>

        <div className="relative ml-4 hidden md:block" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all btn-outline-purple"
          >
            <span>🏢</span>
            <span>{selectedBusiness || 'Select Business'}</span>
            <span className="text-xs">▼</span>
          </button>
          {showDropdown && (
            <div className="absolute top-10 left-0 py-2 min-w-56 dropdown-menu-box">
              {businesses.length === 0 ? (
                <div className="px-4 py-2 text-xs text-slate-400">
                  No businesses found. Add your first business!
                </div>
              ) : (
                businesses.map((biz) => (
                  <button
                    key={biz._id || biz.businessName}
                    onClick={(e) => handleBusinessChange(e, biz)}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors flex items-center justify-between ${selectedBusiness === biz.businessName ? 'text-indigo-400 font-semibold' : 'text-gray-400'
                      }`}
                  >
                    <span>{biz.businessName}</span>
                    <span className="text-xs text-slate-500 font-normal">{biz.businessCategory}</span>
                  </button>
                ))
              )}
              <div className="border-t border-white/10 mt-1 pt-1">
                <button
                  onClick={(e) => { e.stopPropagation(); navigate('/add-business'); setShowDropdown(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors text-indigo-400 hover:text-indigo-300"
                >
                  + Add New Business
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Live Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifDropdown((prev) => !prev)}
            title="Notifications"
            className="relative p-2 px-2.5 rounded-xl transition-all bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 flex items-center justify-center hover:text-white"
          >
            <span className="text-base">🔔</span>
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-md animate-pulse">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 top-11 w-80 max-w-[90vw] py-2 rounded-2xl dropdown-menu-box shadow-2xl z-50 border border-white/10 bg-[#0f172a]">
              <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-white">Notifications</span>
                <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/20 px-2 py-0.5 rounded-full">
                  {notifications.length} New
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">No new notifications</div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="p-3 hover:bg-white/5 transition-colors">
                      <div className="text-xs font-bold text-white flex items-center justify-between">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-500">
                          {n.time ? new Date(n.time).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Now'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate('/history')}
          title="Work History"
          className="relative p-2 px-3 rounded-xl transition-all bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 flex items-center gap-1.5 hover:text-white"
        >
          <span className="text-base">📜</span>
          <span className="text-xs font-semibold hidden sm:inline text-indigo-300">History</span>
        </button>

        <div className="user-badge-profile">
          <div className="w-7 h-7 rounded-full logo-badge text-xs">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium hidden sm:block text-indigo-200">
            {userName}
          </span>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
