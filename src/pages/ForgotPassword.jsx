import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('email'); // 'email' | 'reset'
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Resend OTP Countdown timer
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const validateEmailStep = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }

    return newErrors;
  };

  const validateResetStep = () => {
    const newErrors = {};

    if (!formData.otp.trim()) {
      newErrors.otp = 'OTP is required';
    } else if (formData.otp.trim().length !== 6) {
      newErrors.otp = 'OTP must be 6 digits';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must include at least one uppercase letter (A-Z)';
    } else if (!/[a-z]/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must include at least one lowercase letter (a-z)';
    } else if (!/[0-9]/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must include at least one number (0-9)';
    } else if (!/[^a-zA-Z0-9]/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must include at least one special character (!@#$%^&*...)';
    } else if (formData.newPassword.length > 25) {
      newErrors.newPassword = 'Password must be at most 25 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name] || errors.general) {
      setErrors({ ...errors, [name]: '', general: '' });
    }
    setMessage('');
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 text-sm form-input ${errors[field] ? 'border border-red-500' : ''}`;

  // Step 1: Send OTP to Email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    const validationErrors = validateEmailStep();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/forgot-password-otp', {
        email: formData.email.trim(),
      });

      if (response.data.status === 1) {
        setStep('reset');
        setResendTimer(60);
        setMessage(`Verification code sent to ${formData.email.trim()}. Please check your email.`);
      } else {
        setErrors({ general: response.data.message || 'Failed to send OTP.' });
      }
    } catch (error) {
      setErrors({
        general:
          error.response?.data?.message ||
          error.message ||
          'Failed to send verification code. Please check your email.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0 || loading) return;
    setLoading(true);
    setErrors({});
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/forgot-password-otp', {
        email: formData.email.trim(),
      });

      if (response.data.status === 1) {
        setResendTimer(60);
        setMessage(`A fresh OTP code has been sent to ${formData.email.trim()}`);
      } else {
        setErrors({ general: response.data.message || 'Failed to resend code.' });
      }
    } catch (error) {
      setErrors({
        general:
          error.response?.data?.message ||
          error.message ||
          'Failed to resend code.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    const validationErrors = validateResetStep();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/forgot-password', {
        email: formData.email.trim(),
        otp: formData.otp.trim(),
        newPassword: formData.newPassword,
      });

      if (response.data.status === 1) {
        setIsSuccess(true);
        setMessage('Password updated successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1800);
      } else {
        setErrors({ general: response.data.message || 'Failed to update password' });
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        'Invalid OTP or failed to update password.';
      setErrors({ general: errorMsg, otp: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="w-full max-w-md rounded-3xl p-8 card-glass">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3 btn-outline-purple">
            🔐
          </div>
          <h1 className="text-2xl font-black text-white mb-1">
            {step === 'email' ? 'Forgot Password' : 'Verify OTP & Reset'}
          </h1>
          <p className="text-sm text-slate-400">
            {step === 'email'
              ? 'Enter your registered email to receive a verification OTP'
              : `Enter the 6-digit code sent to ${formData.email}`}
          </p>
        </div>

        {errors.general && (
          <div className="mb-4 form-error-banner">
            {errors.general}
          </div>
        )}

        {message && !isSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-sm flex items-start gap-2">
            <span>ℹ️</span>
            <span>{message}</span>
          </div>
        )}

        {isSuccess && (
          <div className="mb-4 form-success-banner">
            ✅ {message}
          </div>
        )}

        {!isSuccess && step === 'email' && (
          <form onSubmit={handleSendOtp} className="space-y-4" noValidate>
            <div>
              <label className="form-label">
                Registered Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your registered email"
                className={inputClass('email')}
                disabled={loading}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl btn-primary flex items-center justify-center gap-2 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending Verification Code...
                </>
              ) : (
                'Send Reset OTP →'
              )}
            </button>
          </form>
        )}

        {!isSuccess && step === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-4" noValidate>
            <div>
              <label className="form-label text-center block mb-1">
                6-Digit Verification OTP
              </label>
              <input
                type="text"
                name="otp"
                maxLength={6}
                value={formData.otp}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setFormData({ ...formData, otp: val });
                  if (errors.otp) setErrors({ ...errors, otp: '', general: '' });
                }}
                placeholder="••••••"
                className={`w-full px-4 py-3 text-center text-2xl font-mono tracking-widest form-input ${
                  errors.otp ? 'border border-red-500' : ''
                }`}
                autoFocus
                disabled={loading}
              />
              {errors.otp && (
                <p className="mt-1 text-xs text-red-400 text-center">{errors.otp}</p>
              )}
            </div>

            <div>
              <label className="form-label">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="At least 8 characters"
                className={inputClass('newPassword')}
                disabled={loading}
              />
              {formData.newPassword && (
                <div className="grid grid-cols-2 gap-1 text-[11px] pt-1.5">
                  <span className={formData.newPassword.length >= 8 ? 'text-emerald-400 font-medium' : 'text-slate-500'}>
                    {formData.newPassword.length >= 8 ? '✓' : '○'} 8+ characters
                  </span>
                  <span className={/[A-Z]/.test(formData.newPassword) ? 'text-emerald-400 font-medium' : 'text-slate-500'}>
                    {/[A-Z]/.test(formData.newPassword) ? '✓' : '○'} 1 Uppercase (A-Z)
                  </span>
                  <span className={/[a-z]/.test(formData.newPassword) ? 'text-emerald-400 font-medium' : 'text-slate-500'}>
                    {/[a-z]/.test(formData.newPassword) ? '✓' : '○'} 1 Lowercase (a-z)
                  </span>
                  <span className={/[0-9]/.test(formData.newPassword) ? 'text-emerald-400 font-medium' : 'text-slate-500'}>
                    {/[0-9]/.test(formData.newPassword) ? '✓' : '○'} 1 Number (0-9)
                  </span>
                  <span className={`col-span-2 ${/[^a-zA-Z0-9]/.test(formData.newPassword) ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                    {/[^a-zA-Z0-9]/.test(formData.newPassword) ? '✓' : '○'} 1 Special char (!@#$%^&*...)
                  </span>
                </div>
              )}
              {errors.newPassword && (
                <p className="mt-1 text-xs text-red-400">{errors.newPassword}</p>
              )}
            </div>

            <div>
              <label className="form-label">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                className={inputClass('confirmPassword')}
                disabled={loading}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || formData.otp.length !== 6}
              className={`w-full py-3 rounded-xl btn-primary flex items-center justify-center gap-2 ${
                loading || formData.otp.length !== 6 ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying OTP & Updating...
                </>
              ) : (
                'Verify OTP & Update Password →'
              )}
            </button>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-700/50">
              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setFormData({ ...formData, otp: '', newPassword: '', confirmPassword: '' });
                  setErrors({});
                  setMessage('');
                }}
                className="text-slate-400 hover:text-white transition-colors"
                disabled={loading}
              >
                ← Change Email
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendTimer > 0 || loading}
                className={`font-semibold transition-colors ${
                  resendTimer > 0
                    ? 'text-slate-500 cursor-not-allowed'
                    : 'text-indigo-400 hover:text-indigo-300 cursor-pointer'
                }`}
              >
                {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
              </button>
            </div>
          </form>
        )}

        <p className="text-center text-sm mt-6 text-slate-500">
          Remember your password?{' '}
          <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
