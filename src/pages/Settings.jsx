import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Decode JWT token to get user id
const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch {
    return null;
  }
};

const businessGoals = [
  'Increase Sales',
  'Get More Customers',
  'Brand Awareness',
  'Improve Marketing',
  'Launch New Product',
  'Improve Online Presence',
];

const targetAudiences = [
  'Local Customers',
  'Online Customers',
  'Young Audience',
  'Professionals',
  'Families',
  'Other',
];

const Settings = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // ── Personal Profile ──────────────────────────────────────────────
  const [personal, setPersonal] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [personalErrors, setPersonalErrors] = useState({});
  const [personalSaved, setPersonalSaved] = useState(false);
  const [personalGenError, setPersonalGenError] = useState('');

  // ── Business Profile ──────────────────────────────────────────────
  const [business, setBusiness] = useState({
    _id: '',
    businessName: '',
    businessCategory: '',
    businessDescription: '',
    location: '',
    phone: '',
    email: '',
    businessGoal: '',
    targetAudience: '',
  });
  const [businessesList, setBusinessesList] = useState([]);
  const [businessErrors, setBusinessErrors] = useState({});
  const [businessSaved, setBusinessSaved] = useState(false);

  // ── Password ──────────────────────────────────────────────────────
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordMsg, setPasswordMsg] = useState('');
  const [confirmDialog, setConfirmDialog] = useState(null);

  // ── Fetch user data from API on mount ────────────────────────────
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const decoded = decodeToken(token);
    if (!decoded?.id) {
      navigate('/login');
      return;
    }

    // Fetch personal data from API
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/get-singleuser/${decoded.id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token,
            },
          }
        );
        const u = response.data.data;
        if (u) {
          const rawEmail = u.email || '';
          const isFakeEmail = rawEmail.includes('@mobile.growthpilot.local') || rawEmail.includes('@google.growthpilot.local');
          setPersonal({
            name: (u.name && !u.name.startsWith('User +') && !u.name.startsWith('User 0')) ? u.name : '',
            email: isFakeEmail ? '' : rawEmail,
            phone: u.phone || '',
          });
        }
      } catch (error) {
        console.log('Error fetching user:', error.message);
      }
    };

    const fetchBusiness = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/get-my-businesses', {
          headers: { Authorization: 'Bearer ' + token },
        });
        if (response.data.status === 1 && response.data.data.length > 0) {
          const list = response.data.data;
          setBusinessesList(list);
          const activeId = response.data.activeBusinessId;
          const matched = list.find((b) => b._id === activeId) || list[0];
          setBusiness({
            _id: matched._id || '',
            businessName: matched.businessName || '',
            businessCategory: matched.businessCategory || '',
            businessDescription: matched.businessDescription || '',
            location: matched.location || '',
            phone: matched.phone || '',
            email: matched.email || '',
            businessGoal: matched.businessGoal || '',
            targetAudience: matched.targetAudience || '',
          });
        }
      } catch (err) {
        console.log('Error loading business in settings:', err.message);
      }
    };

    fetchUser();
    fetchBusiness();

    const handleBizChange = (e) => {
      if (e?.detail?._id) {
        const selected = e.detail;
        setBusiness({
          _id: selected._id || '',
          businessName: selected.businessName || '',
          businessCategory: selected.businessCategory || '',
          businessDescription: selected.businessDescription || '',
          location: selected.location || '',
          phone: selected.phone || '',
          email: selected.email || '',
          businessGoal: selected.businessGoal || '',
          targetAudience: selected.targetAudience || '',
        });
      }
    };

    window.addEventListener('businessChanged', handleBizChange);
    return () => window.removeEventListener('businessChanged', handleBizChange);
  }, []);

  // ── Validate Personal ────────────────────────────────────────────
  const validatePersonal = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (personal.name && personal.name.trim().length > 0 && personal.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (personal.email && personal.email.trim().length > 0) {
      if (!emailRegex.test(personal.email.trim())) {
        newErrors.email = 'Enter a valid email address';
      }
    }

    if (personal.phone && personal.phone.trim().length > 0) {
      const cleanPhone = personal.phone.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        newErrors.phone = 'Enter a valid 10-digit mobile number';
      }
    }

    if (!personal.email?.trim() && !personal.phone?.trim()) {
      newErrors.email = 'Please provide either an email or mobile number';
    }

    return newErrors;
  };

  // ── Validate Business ────────────────────────────────────────────
  const validateBusiness = () => {
    const newErrors = {};

    if (!business.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    } else if (business.businessName.trim().length < 2) {
      newErrors.businessName = 'Business name must be at least 2 characters';
    }

    if (!business.businessCategory.trim()) {
      newErrors.businessCategory = 'Business category is required';
    }

    if (business.email && business.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(business.email.trim())) {
        newErrors.email = 'Enter a valid business email';
      }
    }

    if (business.phone && !/^[0-9]{6,15}$/.test(business.phone)) {
      newErrors.phone = 'Phone must be 6 to 15 digits';
    }

    return newErrors;
  };

  // ── Validate Password ────────────────────────────────────────────
  const validatePassword = () => {
    const newErrors = {};

    if (!passwords.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwords.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwords.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(passwords.newPassword)) {
      newErrors.newPassword = 'Password must include at least one uppercase letter (A-Z)';
    } else if (!/[a-z]/.test(passwords.newPassword)) {
      newErrors.newPassword = 'Password must include at least one lowercase letter (a-z)';
    } else if (!/[0-9]/.test(passwords.newPassword)) {
      newErrors.newPassword = 'Password must include at least one number (0-9)';
    } else if (!/[^a-zA-Z0-9]/.test(passwords.newPassword)) {
      newErrors.newPassword = 'Password must include at least one special character (!@#$%^&*...)';
    } else if (passwords.newPassword.length > 25) {
      newErrors.newPassword = 'Password must be at most 25 characters';
    }

    if (!passwords.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwords.newPassword !== passwords.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  // ── Handlers: Personal ───────────────────────────────────────────
  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonal({ ...personal, [name]: value });
    if (personalErrors[name]) {
      setPersonalErrors({ ...personalErrors, [name]: '' });
    }
    setPersonalSaved(false);
    setPersonalGenError('');
  };

  const executeSavePersonal = async () => {
    const decoded = decodeToken(token);
    if (!decoded?.id) return;

    try {
      const response = await axios.put(
        `http://localhost:5000/api/update-user/${decoded.id}`,
        personal,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        }
      );
      if (response.data.data) {
        setPersonalSaved(true);
        setTimeout(() => setPersonalSaved(false), 3000);
      } else {
        setPersonalGenError(response.data.message || 'Failed to update. Try again.');
      }
    } catch (error) {
      setPersonalGenError(error.response?.data?.message || error.message || 'Something went wrong.');
    }
  };

  const handleSavePersonal = (e) => {
    e.preventDefault();
    const validationErrors = validatePersonal();
    if (Object.keys(validationErrors).length > 0) {
      setPersonalErrors(validationErrors);
      return;
    }
    setConfirmDialog({
      title: 'Confirm Profile Update',
      message: 'Are you sure you want to update your personal profile details?',
      confirmText: 'Yes, Save Profile',
      onConfirm: executeSavePersonal,
    });
  };

  // ── Handlers: Business ───────────────────────────────────────────
  const handleBusinessChange = (e) => {
    const { name, value } = e.target;
    setBusiness({ ...business, [name]: value });
    if (businessErrors[name]) {
      setBusinessErrors({ ...businessErrors, [name]: '' });
    }
    setBusinessSaved(false);
  };

  const executeSaveBusiness = async () => {
    try {
      let response;
      const { _id, ...bizPayload } = business;
      if (_id) {
        response = await axios.put(
          `http://localhost:5000/api/update-business/${_id}`,
          bizPayload,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token,
            },
          }
        );
      } else {
        response = await axios.post(
          'http://localhost:5000/api/add-business',
          bizPayload,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token,
            },
          }
        );
      }

      if (response.data.status === 1 && response.data.data) {
        const savedData = response.data.data;
        setBusiness({
          _id: savedData._id || '',
          businessName: savedData.businessName || '',
          businessCategory: savedData.businessCategory || '',
          businessDescription: savedData.businessDescription || '',
          location: savedData.location || '',
          phone: savedData.phone || '',
          email: savedData.email || '',
          businessGoal: savedData.businessGoal || '',
          targetAudience: savedData.targetAudience || '',
        });
        setBusinessesList((prev) =>
          prev.map((b) => (b._id === savedData._id ? savedData : b))
        );
        window.dispatchEvent(new CustomEvent('businessChanged', { detail: savedData }));
        setBusinessSaved(true);
        setTimeout(() => setBusinessSaved(false), 3000);
      } else {
        setBusinessErrors({ general: response.data.message || 'Failed to save business' });
      }
    } catch (err) {
      setBusinessErrors({
        general: err.response?.data?.message || err.message || 'Failed to save business to database',
      });
    }
  };

  const handleSaveBusiness = (e) => {
    e.preventDefault();
    const validationErrors = validateBusiness();
    if (Object.keys(validationErrors).length > 0) {
      setBusinessErrors(validationErrors);
      return;
    }
    setBusinessErrors({});
    setConfirmDialog({
      title: 'Confirm Business Details',
      message: `Are you sure you want to save changes to "${business.businessName || 'this business'}"?`,
      confirmText: 'Yes, Save Business',
      onConfirm: executeSaveBusiness,
    });
  };

  // ── Handlers: Password ───────────────────────────────────────────
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
    if (passwordErrors[name]) {
      setPasswordErrors({ ...passwordErrors, [name]: '' });
    }
    setPasswordMsg('');
  };

  const executeUpdatePassword = async () => {
    const decoded = decodeToken(token);
    if (!decoded?.id) {
      setPasswordErrors({ general: 'Session expired. Please log in again.' });
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/change-password/${decoded.id}`,
        {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        }
      );

      if (response.data.status === 1) {
        setPasswordMsg('Password updated successfully in database!');
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setPasswordMsg(''), 3000);
      } else {
        setPasswordErrors({ general: response.data.message || 'Failed to update password' });
      }
    } catch (err) {
      setPasswordErrors({
        general: err.response?.data?.message || err.message || 'Error updating password',
      });
    }
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    const validationErrors = validatePassword();
    if (Object.keys(validationErrors).length > 0) {
      setPasswordErrors(validationErrors);
      return;
    }
    setPasswordErrors({});
    setConfirmDialog({
      title: 'Confirm Password Change',
      message: 'Are you sure you want to change your account password?',
      confirmText: 'Yes, Update Password',
      onConfirm: executeUpdatePassword,
    });
  };

  // ── Input class helper ───────────────────────────────────────────
  const inputClass = (field, errObj = personalErrors) =>
    `w-full px-4 py-2.5 text-sm form-input ${errObj[field] ? 'border border-red-500' : ''}`;

  const bizInputClass = (field) =>
    `w-full px-4 py-2.5 text-sm form-input ${businessErrors[field] ? 'border border-red-500' : ''}`;

  const pwdInputClass = (field) =>
    `w-full px-4 py-2.5 text-sm form-input max-w-sm ${passwordErrors[field] ? 'border border-red-500' : ''}`;

  // ── JSX ──────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Page Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 logo-badge text-2xl">⚙️</div>
        <div>
          <h1 className="text-2xl font-black text-white">Settings</h1>
          <p className="text-sm text-slate-500">Manage your profile and account preferences</p>
        </div>
      </div>

      {/* ── Section 1: Personal Profile ─────────────────────────────── */}
      <div className="rounded-2xl p-6 card-purple-border">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
          <div className="w-12 h-12 logo-badge text-xl">
            {personal.name ? personal.name.charAt(0).toUpperCase() : '👤'}
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Personal Profile</h2>
            <p className="text-xs text-slate-500">Your name, email and contact info</p>
          </div>
        </div>

        {personalGenError && (
          <div className="mb-4 form-error-banner">❌ {personalGenError}</div>
        )}

        <form onSubmit={handleSavePersonal} className="grid grid-cols-1 md:grid-cols-2 gap-4" noValidate>
          {/* Name */}
          <div>
            <label className="form-label-xs">👤 Full Name</label>
            <input
              type="text"
              id="personal-name"
              name="name"
              value={personal.name}
              onChange={handlePersonalChange}
              placeholder="Your full name"
              className={inputClass('name')}
            />
            {personalErrors.name && <p className="text-red-500 text-sm mt-1">{personalErrors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="form-label-xs">📧 Email</label>
            <input
              type="email"
              id="personal-email"
              name="email"
              value={personal.email}
              onChange={handlePersonalChange}
              placeholder="your@email.com"
              className={inputClass('email')}
            />
            {personalErrors.email && <p className="text-red-500 text-sm mt-1">{personalErrors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="form-label-xs">📱 Mobile Number</label>
            <input
              type="tel"
              id="personal-phone"
              name="phone"
              value={personal.phone}
              onChange={handlePersonalChange}
              placeholder="+91 98765 43210"
              className={inputClass('phone')}
            />
            {personalErrors.phone && <p className="text-red-500 text-sm mt-1">{personalErrors.phone}</p>}
          </div>

          <div className="md:col-span-2 flex items-center gap-4 mt-2">
            <button type="submit" className="px-8 py-3 rounded-xl btn-primary">
              💾 Save Personal Info
            </button>
            {personalSaved && (
              <span className="text-sm font-medium text-emerald-400">✅ Personal info saved!</span>
            )}
          </div>
        </form>
      </div>

      {/* ── Section 2: Business Profile ─────────────────────────────── */}
      <div className="rounded-2xl p-6 card-purple-border">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
          <div className="w-12 h-12 logo-badge text-xl">🏢</div>
          <div>
            <h2 className="text-base font-bold text-white">Business Profile</h2>
            <p className="text-xs text-slate-500">Your business details, goals and target audience</p>
          </div>
        </div>



        <form onSubmit={handleSaveBusiness} className="grid grid-cols-1 md:grid-cols-2 gap-4" noValidate>
          {/* Business Name */}
          <div>
            <label className="form-label-xs">🏢 Business Name <span className="text-red-400">*</span></label>
            <input
              type="text"
              id="business-name"
              name="businessName"
              value={business.businessName}
              onChange={handleBusinessChange}
              placeholder="Your business name"
              className={bizInputClass('businessName')}
            />
            {businessErrors.businessName && <p className="text-red-500 text-sm mt-1">{businessErrors.businessName}</p>}
          </div>

          {/* Business Category */}
          <div>
            <label className="form-label-xs">🏷️ Business Category <span className="text-red-400">*</span></label>
            <input
              type="text"
              id="business-category"
              name="businessCategory"
              value={business.businessCategory}
              onChange={handleBusinessChange}
              placeholder="e.g. Jewellery, Cafe"
              className={bizInputClass('businessCategory')}
            />
            {businessErrors.businessCategory && <p className="text-red-500 text-sm mt-1">{businessErrors.businessCategory}</p>}
          </div>

          {/* Business Email */}
          <div>
            <label className="form-label-xs">✉️ Business Email</label>
            <input
              type="email"
              id="business-email"
              name="email"
              value={business.email}
              onChange={handleBusinessChange}
              placeholder="business@example.com"
              className={bizInputClass('email')}
            />
            {businessErrors.email && <p className="text-red-500 text-sm mt-1">{businessErrors.email}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="form-label-xs">📍 Location</label>
            <input
              type="text"
              id="business-location"
              name="location"
              value={business.location}
              onChange={handleBusinessChange}
              placeholder="City, State"
              className={bizInputClass('location')}
            />
          </div>

          {/* Business Phone */}
          <div>
            <label className="form-label-xs">📞 Business Phone</label>
            <input
              type="tel"
              id="business-phone"
              name="phone"
              value={business.phone}
              onChange={handleBusinessChange}
              placeholder="+91 9876543210"
              className={bizInputClass('phone')}
            />
            {businessErrors.phone && <p className="text-red-500 text-sm mt-1">{businessErrors.phone}</p>}
          </div>

          {/* Business Goal */}
          <div>
            <label className="form-label-xs">🎯 Business Goal</label>
            <select
              id="business-goal"
              name="businessGoal"
              value={business.businessGoal}
              onChange={handleBusinessChange}
              className="w-full px-4 py-2.5 text-sm form-input cursor-pointer"
            >
              <option value="">Select Goal</option>
              {businessGoals.map((g) => (
                <option key={g} value={g} className="bg-[#1e1e3a] text-white">
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Target Audience */}
          <div>
            <label className="form-label-xs">👥 Target Audience</label>
            <select
              id="business-audience"
              name="targetAudience"
              value={business.targetAudience}
              onChange={handleBusinessChange}
              className="w-full px-4 py-2.5 text-sm form-input cursor-pointer"
            >
              <option value="">Select Audience</option>
              {targetAudiences.map((a) => (
                <option key={a} value={a} className="bg-[#1e1e3a] text-white">
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* Business Description */}
          <div className="md:col-span-2">
            <label className="form-label-xs">📝 Business Description</label>
            <textarea
              id="business-description"
              name="businessDescription"
              value={business.businessDescription}
              onChange={handleBusinessChange}
              placeholder="Describe your business, products, services, and mission..."
              rows={3}
              className="w-full px-4 py-2.5 text-sm resize-none form-input"
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-4 mt-2">
            <button type="submit" className="px-8 py-3 rounded-xl btn-primary">
              💾 Save Business Info
            </button>
            {businessSaved && (
              <span className="text-sm font-medium text-emerald-400">✅ Business info saved to database!</span>
            )}
          </div>
        </form>
      </div>

      {/* ── Section 3: Security / Password ──────────────────────────── */}
      <div className="rounded-2xl p-6 card-red-border">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xl">🔐</span>
          <div>
            <h2 className="text-base font-bold text-white">Security</h2>
            <p className="text-xs text-slate-500">Update your account password</p>
          </div>
        </div>

        {passwordMsg && (
          <div className="mb-4 form-success-banner">✅ {passwordMsg}</div>
        )}

        {passwordErrors.general && (
          <div className="mb-4 form-error-banner">{passwordErrors.general}</div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4" noValidate>
          <div>
            <label className="form-label-xs">Current Password</label>
            <input
              type="password"
              id="current-password"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Enter current password"
              className={pwdInputClass('currentPassword')}
            />
            {passwordErrors.currentPassword && <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword}</p>}
          </div>

          <div>
            <label className="form-label-xs">New Password</label>
            <input
              type="password"
              id="new-password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              placeholder="Enter new password (min 8 chars)"
              className={pwdInputClass('newPassword')}
            />
            {passwords.newPassword && (
              <div className="grid grid-cols-2 gap-1 text-[11px] pt-1.5">
                <span className={passwords.newPassword.length >= 8 ? 'text-emerald-400 font-medium' : 'text-slate-500'}>
                  {passwords.newPassword.length >= 8 ? '✓' : '○'} 8+ characters
                </span>
                <span className={/[A-Z]/.test(passwords.newPassword) ? 'text-emerald-400 font-medium' : 'text-slate-500'}>
                  {/[A-Z]/.test(passwords.newPassword) ? '✓' : '○'} 1 Uppercase (A-Z)
                </span>
                <span className={/[a-z]/.test(passwords.newPassword) ? 'text-emerald-400 font-medium' : 'text-slate-500'}>
                  {/[a-z]/.test(passwords.newPassword) ? '✓' : '○'} 1 Lowercase (a-z)
                </span>
                <span className={/[0-9]/.test(passwords.newPassword) ? 'text-emerald-400 font-medium' : 'text-slate-500'}>
                  {/[0-9]/.test(passwords.newPassword) ? '✓' : '○'} 1 Number (0-9)
                </span>
                <span className={`col-span-2 ${/[^a-zA-Z0-9]/.test(passwords.newPassword) ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                  {/[^a-zA-Z0-9]/.test(passwords.newPassword) ? '✓' : '○'} 1 Special char (!@#$%^&*...)
                </span>
              </div>
            )}
            {passwordErrors.newPassword && <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword}</p>}
          </div>

          <div>
            <label className="form-label-xs">Confirm New Password</label>
            <input
              type="password"
              id="confirm-new-password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm new password"
              className={pwdInputClass('confirmPassword')}
            />
            {passwordErrors.confirmPassword && <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword}</p>}
          </div>

          <button type="submit" className="px-8 py-3 rounded-xl btn-danger">
            🔑 Update Password
          </button>
        </form>
      </div>

      {/* ── Section 4: Account Info ──────────────────────────────────── */}
      <div className="rounded-2xl p-6 card-glass-subtle">
        <h2 className="text-sm font-semibold text-white mb-4">Account Info</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Account Type', value: 'Business Owner', icon: '👤' },
            { label: 'Mobile / Phone', value: business.phone || 'Not added', icon: '📞' },
            { label: 'Member Since', value: new Date().getFullYear(), icon: '📅' },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-xl card-glass-subtle">
              <p className="text-xs mb-1 text-slate-500">{item.icon} {item.label}</p>
              <p className="text-sm font-semibold text-white truncate">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl p-6 card-glass border border-white/10 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-2xl flex items-center justify-center mx-auto">
              ✍️
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">{confirmDialog.title}</h3>
              <p className="text-sm text-slate-400">{confirmDialog.message}</p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold bg-white/5 hover:bg-white/10 text-slate-300 transition-colors border border-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const fn = confirmDialog.onConfirm;
                  setConfirmDialog(null);
                  fn();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold btn-primary text-white shadow-lg transition-all"
              >
                {confirmDialog.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Settings;
