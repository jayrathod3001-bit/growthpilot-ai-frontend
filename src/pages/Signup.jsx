import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { GoogleAuthButton } from '../components/SocialAndMobileAuth';

const calculatePasswordStrength = (pwd) => {
  if (!pwd) return { score: 0, label: '', color: '', meetsAll: false, hasMin: false, hasUpper: false, hasLower: false, hasNumber: false, hasSpecial: false };
  const hasMin = pwd.length >= 8;
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSpecial = /[^a-zA-Z0-9]/.test(pwd);

  let score = 0;
  if (hasMin) score += 20;
  if (hasUpper) score += 20;
  if (hasLower) score += 20;
  if (hasNumber) score += 20;
  if (hasSpecial) score += 20;

  const meetsAll = hasMin && hasUpper && hasLower && hasNumber && hasSpecial;

  if (score <= 40) return { score, label: 'Weak', color: '#ef4444', meetsAll, hasMin, hasUpper, hasLower, hasNumber, hasSpecial };
  if (score <= 60) return { score, label: 'Fair', color: '#f59e0b', meetsAll, hasMin, hasUpper, hasLower, hasNumber, hasSpecial };
  if (!meetsAll) return { score: 80, label: 'Almost Complete', color: '#3b82f6', meetsAll, hasMin, hasUpper, hasLower, hasNumber, hasSpecial };
  return { score: 100, label: 'Strong & Valid ✓', color: '#10b981', meetsAll, hasMin, hasUpper, hasLower, hasNumber, hasSpecial };
};

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('form'); // 'form' | 'otp'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const handleAuthSuccess = async (token) => {
    localStorage.setItem('token', token);
    try {
      const bizRes = await axios.get('http://localhost:5000/api/get-my-businesses', {
        headers: { Authorization: 'Bearer ' + token },
      });
      if (bizRes.data.status === 1 && bizRes.data.data.length > 0) {
        navigate('/user-dashboard');
      } else {
        navigate('/add-business');
      }
    } catch {
      navigate('/user-dashboard');
    }
  };

  // Countdown timer for Resend OTP
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must include at least one uppercase letter (A-Z)';
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = 'Password must include at least one lowercase letter (a-z)';
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Password must include at least one number (0-9)';
    } else if (!/[^a-zA-Z0-9]/.test(formData.password)) {
      newErrors.password = 'Password must include at least one special character (!@#$%^&*...)';
    } else if (formData.password.length > 25) {
      newErrors.password = 'Password must be at most 25 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 text-sm form-input ${errors[field] ? 'border border-red-500' : ''}`;

  // Step 1: Send OTP to Email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    setInfoMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/send-otp', {
        email: formData.email.trim(),
      });

      if (response.data.status === 1) {
        setStep('otp');
        setResendTimer(60);
        setInfoMessage(`Verification code sent to ${formData.email.trim()}. Please check your inbox or spam folder.`);
      } else {
        setErrors({ general: response.data.message || 'Failed to send verification code.' });
      }
    } catch (error) {
      setErrors({
        general:
          error.response?.data?.message ||
          error.message ||
          'Failed to send verification code. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Register Account
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      setErrors({ otp: 'Please enter the 6-digit OTP' });
      return;
    }

    if (otp.trim().length !== 6) {
      setErrors({ otp: 'OTP must be exactly 6 digits' });
      return;
    }

    setErrors({});
    setLoading(true);
    setInfoMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/add-user', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        otp: otp.trim(),
      });

      if (response.data.status === 1 || response.data.data) {
        setInfoMessage('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 1200);
      } else {
        setErrors({ general: response.data.message || 'Registration failed.' });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Invalid OTP or registration failed.';
      setErrors({ general: errorMsg, otp: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (resendTimer > 0 || loading) return;
    setLoading(true);
    setErrors({});
    setInfoMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/send-otp', {
        email: formData.email.trim(),
      });

      if (response.data.status === 1) {
        setResendTimer(60);
        setInfoMessage(`A fresh verification code has been sent to ${formData.email.trim()}`);
      } else {
        setErrors({ general: response.data.message || 'Failed to resend code.' });
      }
    } catch (error) {
      setErrors({
        general:
          error.response?.data?.message ||
          error.message ||
          'Failed to resend code. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="w-full max-w-md rounded-3xl p-8 card-glass">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 logo-badge text-xl mx-auto mb-3">
            ✨
          </div>
          <h1 className="text-2xl font-black text-white mb-1">
            {step === 'form' ? 'Create Your Account' : 'Verify Your Email'}
          </h1>
          <p className="text-sm text-slate-400">
            {step === 'form'
              ? 'Start growing your business with AI'
              : `Enter the 6-digit code sent to ${formData.email}`}
          </p>
        </div>

        {/* Info Message Banner */}
        {infoMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-start gap-2">
            <span className="text-base leading-none">✅</span>
            <span>{infoMessage}</span>
          </div>
        )}

        {/* General Error Banner */}
        {errors.general && (
          <div className="mb-4 form-error-banner">
            {errors.general}
          </div>
        )}

        {/* Fast Social & Mobile Auth Options */}
        {step === 'form' && (
          <>
            <div className="mb-6">
              <GoogleAuthButton
                text="Sign up with Google"
                onSuccess={handleAuthSuccess}
                onError={(msg) => setErrors({ general: msg })}
              />
            </div>

            <div className="relative flex items-center justify-center my-6">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-[#12122b] px-3 text-xs text-slate-500 uppercase font-semibold tracking-wider whitespace-nowrap">
                or sign up with email
              </span>
              <div className="border-t border-white/10 w-full" />
            </div>
          </>
        )}

        {/* STEP 1: Registration Form */}
        {step === 'form' && (
          <form onSubmit={handleSendOtp} className="space-y-4" noValidate>

            {/* Full Name */}
            <div>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                id="add-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={inputClass('name')}
                placeholder="Enter full name"
                disabled={loading}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="form-label">Email (e.g. yopmail / gmail)</label>
              <input
                type="email"
                id="add-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClass('email')}
                placeholder="you@example.com / username@yopmail.com"
                disabled={loading}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <label className="form-label">Password</label>
                {formData.password && (
                  <span
                    className="text-[11px] font-bold"
                    style={{ color: calculatePasswordStrength(formData.password).color }}
                  >
                    {calculatePasswordStrength(formData.password).label}
                  </span>
                )}
              </div>
              <input
                type="password"
                id="add-password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={inputClass('password')}
                placeholder="At least 8 characters"
                disabled={loading}
              />
              {formData.password && (
                <div className="mt-2 space-y-1.5">
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${calculatePasswordStrength(formData.password).score}%`,
                        background: calculatePasswordStrength(formData.password).color,
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[11px] pt-1">
                    <span className={calculatePasswordStrength(formData.password).hasMin ? 'text-emerald-400 font-medium' : 'text-slate-500'}>
                      {calculatePasswordStrength(formData.password).hasMin ? '✓' : '○'} 8+ characters
                    </span>
                    <span className={calculatePasswordStrength(formData.password).hasUpper ? 'text-emerald-400 font-medium' : 'text-slate-500'}>
                      {calculatePasswordStrength(formData.password).hasUpper ? '✓' : '○'} 1 Uppercase (A-Z)
                    </span>
                    <span className={calculatePasswordStrength(formData.password).hasLower ? 'text-emerald-400 font-medium' : 'text-slate-500'}>
                      {calculatePasswordStrength(formData.password).hasLower ? '✓' : '○'} 1 Lowercase (a-z)
                    </span>
                    <span className={calculatePasswordStrength(formData.password).hasNumber ? 'text-emerald-400 font-medium' : 'text-slate-500'}>
                      {calculatePasswordStrength(formData.password).hasNumber ? '✓' : '○'} 1 Number (0-9)
                    </span>
                    <span className={`col-span-2 ${calculatePasswordStrength(formData.password).hasSpecial ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                      {calculatePasswordStrength(formData.password).hasSpecial ? '✓' : '○'} 1 Special char (!@#$%^&*...)
                    </span>
                  </div>
                </div>
              )}
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                id="add-confirm-password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={inputClass('confirmPassword')}
                placeholder="Confirm your password"
                disabled={loading}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl btn-primary mt-2 flex items-center justify-center gap-2 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending Verification Code...
                </>
              ) : (
                'Send Verification OTP →'
              )}
            </button>
          </form>
        )}

        {/* STEP 2: OTP Verification Form */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyAndRegister} className="space-y-5" noValidate>

            <div>
              <label className="form-label text-center block mb-2">
                Enter 6-Digit OTP Code
              </label>
              <input
                type="text"
                id="add-otp"
                name="otp"
                maxLength={6}
                value={otp}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setOtp(val);
                  if (errors.otp) setErrors({ ...errors, otp: '', general: '' });
                }}
                className={`w-full px-4 py-3 text-center text-3xl font-mono tracking-widest form-input ${
                  errors.otp ? 'border border-red-500' : ''
                }`}
                placeholder="••••••"
                autoFocus
                disabled={loading}
              />
              {errors.otp && (
                <p className="text-red-500 text-sm mt-2 text-center font-medium">
                  {errors.otp}
                </p>
              )}
              <p className="text-xs text-slate-400 text-center mt-2">
                Code expires in 5 minutes
              </p>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className={`w-full py-3 rounded-xl btn-primary flex items-center justify-center gap-2 ${
                loading || otp.length !== 6 ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying OTP...
                </>
              ) : (
                'Verify & Complete Signup →'
              )}
            </button>

            {/* Resend and Edit options */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-700/50">
              <button
                type="button"
                onClick={() => {
                  setStep('form');
                  setOtp('');
                  setErrors({});
                  setInfoMessage('');
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
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Signup;
