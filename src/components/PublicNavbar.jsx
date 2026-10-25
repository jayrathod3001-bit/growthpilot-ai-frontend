import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const navLinks = [
  { label: 'Features', path: '/features' },
  { label: 'How It Works', path: '/how-it-works' },
  { label: 'Live Score', path: '/dashboard#live-score' },
  { label: 'About Us', path: '/about' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Contact', path: '/contact' },
];

const PublicNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLiveScoreClick = (e) => {
    if (location.pathname === '/dashboard') {
      const el = document.getElementById('live-score');
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0d0d1e]/80 border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 logo-badge text-base group-hover:scale-105 transition-transform flex items-center justify-center font-black">
            GP
          </div>
          <div>
            <span className="text-xl font-black text-white tracking-tight">GrowthPilot</span>
            <span className="text-xs ml-1.5 px-2 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              AI
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={item.path.includes('#') ? handleLiveScoreClick : undefined}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                location.pathname === item.path
                  ? 'text-white bg-white/10 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {isLoggedIn ? (
            <button
              onClick={() => navigate('/user-dashboard')}
              className="px-5 py-2.5 rounded-xl text-sm font-bold btn-primary flex items-center gap-2"
            >
              <span>Go to Dashboard</span>
              <span>→</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all text-slate-300 hover:text-white hover:bg-white/5"
              >
                Log In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-5 py-2.5 rounded-xl text-sm font-bold btn-primary"
              >
                Get Started Free
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 border border-white/10"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0e0e22] border-b border-white/10 px-6 py-5 space-y-3 animate-fade-in">
          {navLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-slate-300 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            {isLoggedIn ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/user-dashboard');
                }}
                className="w-full py-3 rounded-xl text-sm font-bold btn-primary"
              >
                Go to Dashboard →
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-white/5"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/signup');
                  }}
                  className="w-full py-2.5 rounded-xl text-sm font-bold btn-primary"
                >
                  Get Started Free →
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;
