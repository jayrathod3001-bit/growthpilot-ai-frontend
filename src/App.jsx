import React, { lazy, Suspense, useState, useCallback, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { injectToastHandler } from './utils/taskManager';

import UserLayout from './components/UserLayout';

// ── Sabhi pages lazy loaded ───────────────────────────────────────────────
const PublicDashboard = lazy(() => import('./pages/PublicDashboard'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const AddBusiness = lazy(() => import('./pages/AddBusiness'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// ── Public Pages & Legal ──────────────────────────────────────────────────
const AboutUs = lazy(() => import('./pages/AboutUs'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const OurFeatures = lazy(() => import('./pages/OurFeatures'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const FAQ = lazy(() => import('./pages/FAQ'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/TermsConditions'));
const HelpSupport = lazy(() => import('./pages/HelpSupport'));
const Feedback = lazy(() => import('./pages/Feedback'));

const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const AIChat = lazy(() => import('./pages/AIChat'));
const MarketingStrategy = lazy(() => import('./pages/MarketingStrategy'));
const ContentGenerator = lazy(() => import('./pages/ContentGenerator'));
const ImageGenerator = lazy(() => import('./pages/ImageGenerator'));
const SEOAssistant = lazy(() => import('./pages/SEOAssistant'));
const Reports = lazy(() => import('./pages/Reports'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Notifications = lazy(() => import('./pages/Notifications'));
const History = lazy(() => import('./pages/History'));
const Settings = lazy(() => import('./pages/Settings'));

// ── Loading Spinner (Suspense fallback) ──────────────────────────────────
const PageLoader = () => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', height: '100vh',
    background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', gap: '16px',
  }}>
    <div style={{
      width: '48px', height: '48px',
      border: '4px solid rgba(255,255,255,0.1)',
      borderTop: '4px solid #a78bfa', borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
    <p style={{ color: '#a78bfa', fontSize: '14px', fontFamily: 'Inter, sans-serif', letterSpacing: '0.05em' }}>
      Loading...
    </p>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// ── Toast Notification Popup ──────────────────────────────────────────────
// ── Toast Notification Popup (Professional Design) ────────────────────────
const Toast = ({ toast, onClose }) => {
  if (!toast) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
        maxWidth: '360px', width: '100%',
        background: 'linear-gradient(135deg, rgba(17,17,34,0.98), rgba(30,27,75,0.98))',
        border: `1px solid ${toast.color || '#6366f1'}66`,
        borderRadius: '16px', padding: '16px 20px',
        boxShadow: `0 12px 40px rgba(0,0,0,0.6), 0 0 20px ${toast.color || '#6366f1'}22`,
        cursor: 'pointer',
        animation: 'toast-slide-in 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <style>{`
        @keyframes toast-slide-in {
          from { transform: translateX(110%); opacity: 0; }
          to   { transform: translateX(0);   opacity: 1; }
        }
      `}</style>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '20px',
          background: `${toast.color || '#6366f1'}25`,
          border: `1px solid ${toast.color || '#6366f1'}50`,
          boxShadow: `0 0 12px ${toast.color || '#6366f1'}33`,
        }}>
          {toast.icon || '✨'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
            <span style={{
              fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800,
              padding: '2px 6px', borderRadius: '4px',
              background: `${toast.color || '#6366f1'}25`, color: toast.color || '#a5b4fc',
            }}>
              Success
            </span>
          </div>
          <p style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '4px', fontFamily: 'Inter, sans-serif' }}>
            {toast.title}
          </p>
          <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.45', fontFamily: 'Inter, sans-serif' }}>
            {toast.text}
          </p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          style={{ color: '#64748b', fontSize: '18px', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, lineHeight: 1 }}
        >
          ×
        </button>
      </div>
      <div style={{
        height: '2px', borderRadius: '2px', marginTop: '12px',
        background: `${toast.color || '#6366f1'}30`,
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', background: toast.color || '#6366f1',
          animation: 'toast-progress 5s linear forwards',
        }} />
      </div>
      <style>{`
        @keyframes toast-progress { from { width: 100%; } to { width: 0%; } }
      `}</style>
    </div>
  );
};

// ── Protected Route Guard ─────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const [toast, setToast] = useState(null);
  const [toastTimer, setToastTimer] = useState(null);

  const showToast = useCallback((toastData) => {
    setToast(toastData);
    if (toastTimer) clearTimeout(toastTimer);
    const t = setTimeout(() => setToast(null), 5500);
    setToastTimer(t);
  }, [toastTimer]);

  // Inject into taskManager so background tasks can trigger toasts
  useEffect(() => {
    injectToastHandler(showToast);
  }, [showToast]);

  const closeToast = useCallback(() => {
    setToast(null);
    if (toastTimer) clearTimeout(toastTimer);
  }, [toastTimer]);

  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Routes>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={<PublicDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/add-business" element={<AddBusiness />} />

          {/* Public & Information Pages */}
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/features" element={<OurFeatures />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/support" element={<HelpSupport />} />
          <Route path="/feedback" element={<Feedback />} />

          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route path="/user-dashboard" element={<ProtectedRoute><UserLayout><UserDashboard /></UserLayout></ProtectedRoute>} />
          <Route path="/ai-chat" element={<ProtectedRoute><UserLayout><AIChat /></UserLayout></ProtectedRoute>} />
          <Route path="/marketing-strategy" element={<ProtectedRoute><UserLayout><MarketingStrategy /></UserLayout></ProtectedRoute>} />
          <Route path="/content-generator" element={<ProtectedRoute><UserLayout><ContentGenerator /></UserLayout></ProtectedRoute>} />
          <Route path="/image-generator" element={<ProtectedRoute><UserLayout><ImageGenerator /></UserLayout></ProtectedRoute>} />
          <Route path="/seo-assistant" element={<ProtectedRoute><UserLayout><SEOAssistant /></UserLayout></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><UserLayout><Reports /></UserLayout></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><UserLayout><Analytics /></UserLayout></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><UserLayout><History /></UserLayout></ProtectedRoute>} />
          <Route path="/notifications" element={<Navigate to="/history" replace />} />
          <Route path="/settings" element={<ProtectedRoute><UserLayout><Settings /></UserLayout></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>

      {/* Global Toast — renders outside Suspense so it's always visible */}
      <Toast toast={toast} onClose={closeToast} />
    </>
  );
}

export default App;