import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { GoogleAuthButton } from '../components/SocialAndMobileAuth';
import { API_BASE_URL } from '../utils/apiConfig';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
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

  const handleAuthSuccess = async (token) => {
    localStorage.setItem('token', token);
    try {
      const bizRes = await axios.get(`${API_BASE_URL}/api/get-my-businesses`, {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/login`, formData);
      if (response.data.status === 1) {
        await handleAuthSuccess(response.data.token);
      } else {
        setErrors({ general: response.data.message || 'Login failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: error.response?.data?.message || error.message || 'Something went wrong.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="w-full max-w-md rounded-3xl p-8 card-glass shadow-2xl relative my-8">

        {/* Header */}
        <div className="text-center mb-6">
          <Link to="/dashboard" className="inline-block">
            <div className="w-12 h-12 logo-badge mx-auto mb-3 text-xl cursor-pointer hover:scale-105 transition-transform">
              🚀
            </div>
          </Link>
          <h1 className="text-2xl font-black text-white mb-1">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-400">
            Sign in to your GrowthPilot account
          </p>
        </div>

        {/* General Error Banner */}
        {errors.general && (
          <div className="mb-4 form-error-banner">
            {errors.general}
          </div>
        )}

        {/* Fast Google Auth */}
        <div className="mb-6">
          <GoogleAuthButton
            text="Sign in with Google"
            onSuccess={handleAuthSuccess}
            onError={(msg) => setErrors({ general: msg })}
          />
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-[#12122b] px-3 text-xs text-slate-500 uppercase font-semibold tracking-wider whitespace-nowrap">
            or sign in with email
          </span>
          <div className="border-t border-white/10 w-full" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>

          {/* Email Field */}
          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl text-sm bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.email ? 'border-red-500' : 'border-white/10'
              }`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl text-sm bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.password ? 'border-red-500' : 'border-white/10'
              }`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1.5">{errors.password}</p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-xs font-medium transition-colors text-indigo-400 hover:text-indigo-300"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl btn-primary font-bold text-sm flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              'Login →'
            )}
          </button>
        </form>

        {/* Signup Link */}
        <p className="text-center text-sm mt-6 text-slate-400">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-indigo-400 hover:text-indigo-300">
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
