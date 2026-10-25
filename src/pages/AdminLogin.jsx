import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [genError, setGenError] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
    setGenError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', form, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.data.status === 1) {
        localStorage.setItem('adminToken', res.data.token);
        navigate('/admin/dashboard');
      } else {
        setGenError(res.data.message || 'Invalid credentials');
      }
    } catch (err) {
      setGenError(err.response?.data?.message || 'Server error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #0f0f2e 50%, #0a0a1a 100%)' }}>
      {/* Background glow */}
      <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '420px', padding: '2rem' }}>
        {/* Logo */}
        <div className="text-center mb-8">
          <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 1rem', boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}>🛡️</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff', marginBottom: '0.25rem' }}>Admin Panel</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>GrowthPilot AI — Secure Access</p>
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '2rem', backdropFilter: 'blur(20px)' }}>

          {genError && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '0.75rem 1rem', color: '#f87171', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              ❌ {genError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Admin Email</label>
              <input
                type="email" id="admin-email" name="email" value={form.email} onChange={handleChange}
                placeholder="admin@growthpilot.ai" autoComplete="email"
                style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.06)', border: `1px solid ${errors.email ? '#ef4444' : 'rgba(255,255,255,0.1)'}`, borderRadius: '12px', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
              />
              {errors.email && <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.35rem' }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Password</label>
              <input
                type="password" id="admin-password" name="password" value={form.password} onChange={handleChange}
                placeholder="Enter admin password" autoComplete="current-password"
                style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.06)', border: `1px solid ${errors.password ? '#ef4444' : 'rgba(255,255,255,0.1)'}`, borderRadius: '12px', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
              />
              {errors.password && <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.35rem' }}>{errors.password}</p>}
            </div>

            <button
              type="submit" id="admin-login-btn" disabled={loading}
              style={{ width: '100%', padding: '0.875rem', background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '0.95rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: loading ? 'none' : '0 4px 20px rgba(99,102,241,0.35)' }}
            >
              {loading ? '⏳ Logging in...' : '🔐 Login as Admin'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: '#475569', fontSize: '0.75rem', marginTop: '1.5rem' }}>
          Not an admin? <span onClick={() => navigate('/login')} style={{ color: '#6366f1', cursor: 'pointer', fontWeight: 600 }}>User Login →</span>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
