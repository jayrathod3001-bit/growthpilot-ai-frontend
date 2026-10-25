import React from 'react';
import { Link } from 'react-router-dom';

const PublicFooter = () => {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a16] text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 logo-badge text-sm font-black flex items-center justify-center">
                GP
              </div>
              <span className="text-xl font-black text-white">GrowthPilot AI</span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Autonomous AI Growth Partner for modern businesses. We combine marketing intelligence, AI content generation, real-time analytics, and automated SEO strategies into one powerful platform.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                System Status: 99.98% Operational
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-white text-sm font-bold tracking-wider uppercase mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/features" className="hover:text-white transition-colors">
                  Our Features
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/dashboard#live-score" className="hover:text-white transition-colors">
                  Live AI Score
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  User Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support Links */}
          <div>
            <h4 className="text-white text-sm font-bold tracking-wider uppercase mb-4">Company & Support</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-white transition-colors">
                  Help & Support
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="hover:text-white transition-colors text-indigo-400 font-semibold">
                  Share Feedback ⭐
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white text-sm font-bold tracking-wider uppercase mb-4">Legal & Trust</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <span className="text-xs text-slate-500 block pt-1">
                  GDPR & DPDP Compliant • 256-bit SSL Encryption
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} GrowthPilot AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-slate-400">Privacy</Link>
            <Link to="/terms" className="hover:text-slate-400">Terms</Link>
            <Link to="/feedback" className="hover:text-slate-400">Feedback</Link>
            <Link to="/contact" className="hover:text-slate-400">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
