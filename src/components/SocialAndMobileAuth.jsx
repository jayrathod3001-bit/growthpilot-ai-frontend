import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const BACKEND_URL = 'http://localhost:5000';

export const GoogleAuthButton = ({ onSuccess, onError, text = 'Sign in with Google' }) => {
  const [loading, setLoading] = useState(false);

  // Listen for Google OAuth callback message from popup window
  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'GOOGLE_OAUTH_TOKEN' && event.data?.credential) {
        setLoading(true);
        try {
          const res = await axios.post(`${BACKEND_URL}/api/auth/google`, {
            credential: event.data.credential,
          });
          if (res.data?.status === 1 && res.data?.token) {
            onSuccess(res.data.token, res.data.data);
          } else {
            onError?.(res.data?.message || 'Google sign-in failed');
          }
        } catch (err) {
          onError?.(err.response?.data?.message || err.message || 'Google sign-in error');
        } finally {
          setLoading(false);
        }
      }
      if (event.data?.type === 'GOOGLE_AUTH_PROFILE' && event.data?.profile) {
        setLoading(true);
        try {
          const res = await axios.post(`${BACKEND_URL}/api/auth/google`, {
            profile: event.data.profile,
          });
          if (res.data?.status === 1 && res.data?.token) {
            onSuccess(res.data.token, res.data.data);
          } else {
            onError?.(res.data?.message || 'Google sign-in failed');
          }
        } catch (err) {
          onError?.(err.response?.data?.message || err.message || 'Google sign-in error');
        } finally {
          setLoading(false);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSuccess, onError]);

  // Initialize Google GIS if client ID is available
  useEffect(() => {
    if (GOOGLE_CLIENT_ID && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response) => {
            if (!response?.credential) return;
            setLoading(true);
            try {
              const res = await axios.post(`${BACKEND_URL}/api/auth/google`, {
                credential: response.credential,
              });
              if (res.data?.status === 1 && res.data?.token) {
                onSuccess(res.data.token, res.data.data);
              } else {
                onError?.(res.data?.message || 'Google sign-in failed');
              }
            } catch (err) {
              onError?.(err.response?.data?.message || err.message || 'Google sign-in error');
            } finally {
              setLoading(false);
            }
          },
        });
      } catch (e) {
        console.log('Google GIS init notice:', e.message);
      }
    }
  }, [onSuccess, onError]);

  const handleClick = () => {
    // 1. If Google GIS OAuth2 client is available, use token client for interactive account selection
    if (GOOGLE_CLIENT_ID && window.google?.accounts?.oauth2) {
      try {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'email profile openid',
          callback: async (tokenResponse) => {
            if (tokenResponse.error) {
              console.error('Google token error:', tokenResponse.error);
              onError?.(tokenResponse.error_description || 'Google sign-in was cancelled or failed.');
              return;
            }
            if (!tokenResponse.access_token) return;

            setLoading(true);
            try {
              // Fetch user profile from Google userinfo API
              const userInfoRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
              });
              const googleProfile = userInfoRes.data;

              // Send to backend
              const res = await axios.post(`${BACKEND_URL}/api/auth/google`, {
                profile: googleProfile,
              });

              if (res.data?.status === 1 && res.data?.token) {
                onSuccess(res.data.token, res.data.data);
              } else {
                onError?.(res.data?.message || 'Google sign-in failed');
              }
            } catch (err) {
              onError?.(err.response?.data?.message || err.message || 'Failed to complete Google authentication');
            } finally {
              setLoading(false);
            }
          },
        });
        tokenClient.requestAccessToken({ prompt: 'select_account' });
        return;
      } catch (oauthErr) {
        console.warn('OAuth2 token client warning, falling back:', oauthErr.message);
      }
    }

    // 2. Fallback: GIS One-Tap prompt if initialized
    if (GOOGLE_CLIENT_ID && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt();
        return;
      } catch (err) {
        console.log('Google prompt fallback:', err.message);
      }
    }

    // 3. Fallback: Open real Google account chooser page in a popup window
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open(
      'https://accounts.google.com/AccountChooser',
      'GoogleSignIn',
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
    );
    if (!popup) {
      onError?.('Popup blocked! Please allow popups for this site and try again.');
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="w-full py-3 px-4 rounded-xl flex items-center justify-center gap-3 font-semibold text-sm transition-all duration-200"
      style={{
        background: 'rgba(255, 255, 255, 0.06)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        color: '#f8fafc',
        cursor: loading ? 'not-allowed' : 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
      }}
    >
      {loading ? (
        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
      )}
      <span>{loading ? 'Opening Google...' : text}</span>
    </button>
  );
};

export const MobileAuthModal = () => null;
