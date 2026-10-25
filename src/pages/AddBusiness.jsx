import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};

const AddBusiness = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [formData, setFormData] = useState({
    businessName: '',
    businessCategory: '',
    businessDescription: '',
    location: '',
    email: '',
    businessGoal: '',
    targetAudience: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }
    if (!formData.businessCategory.trim()) {
      newErrors.businessCategory = 'Business category is required';
    }
    if (!formData.businessGoal) {
      newErrors.businessGoal = 'Please select a business goal';
    }
    if (!formData.targetAudience) {
      newErrors.targetAudience = 'Please select target audience';
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      if (!token) {
        setErrors({ general: 'Please login first to add a business.' });
        setTimeout(() => navigate('/login'), 1500);
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/add-business',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        }
      );

      if (response.data.status === 1 && response.data.data) {
        const savedBiz = response.data.data;
        window.dispatchEvent(new CustomEvent('businessChanged', { detail: savedBiz }));
        navigate('/user-dashboard');
      } else {
        setErrors({ general: response.data.message || 'Failed to save business.' });
      }
    } catch (error) {
      setErrors({
        general: error.response?.data?.message || error.message || 'Something went wrong.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page py-12">
      <div className="max-w-2xl mx-auto w-full">
        
        <div className="text-center mb-10">
          <div className="w-14 h-14 logo-badge text-2xl mx-auto mb-4 glow-purple">
            🏢
          </div>
          <h1 className="text-3xl font-black text-white mb-2">
            Let's Set Up Your Business
          </h1>
          <p className="text-sm max-w-md mx-auto text-slate-500">
            Tell us about your business so GrowthPilot AI can personalize your experience.
          </p>
        </div>

        <div className="rounded-3xl p-8 space-y-6 card-purple-border">
          {errors.general && (
            <div className="mb-4 form-error-banner">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="rounded-xl p-4 mb-2 form-section-box">
              <p className="text-xs font-semibold uppercase tracking-wider mb-3 text-indigo-400">
                Business Information
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label-xs">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="e.g. Triratna Jewels"
                    className={`w-full px-3 py-2.5 text-sm form-input ${errors.businessName ? 'border border-red-500' : ''}`}
                  />
                  {errors.businessName && (
                    <p className="mt-1 text-xs text-red-400">{errors.businessName}</p>
                  )}
                </div>

                <div>
                  <label className="form-label-xs">
                    Business Category *
                  </label>
                  <input
                    type="text"
                    name="businessCategory"
                    value={formData.businessCategory}
                    onChange={handleChange}
                    placeholder="e.g. Jewellery, Cafe, Fashion"
                    className={`w-full px-3 py-2.5 text-sm form-input ${errors.businessCategory ? 'border border-red-500' : ''}`}
                  />
                  {errors.businessCategory && (
                    <p className="mt-1 text-xs text-red-400">{errors.businessCategory}</p>
                  )}
                </div>

                <div>
                  <label className="form-label-xs">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Ahmedabad, Gujarat"
                    className="w-full px-3 py-2.5 text-sm form-input"
                  />
                </div>

                <div>
                  <label className="form-label-xs">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="business@example.com"
                    className="w-full px-3 py-2.5 text-sm form-input"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="form-label-xs">
                  Business Description
                </label>
                <textarea
                  name="businessDescription"
                  value={formData.businessDescription}
                  onChange={handleChange}
                  placeholder="Describe your business, products, and services..."
                  rows={3}
                  className="w-full px-3 py-2.5 text-sm resize-none form-input"
                />
              </div>
            </div>



            <div className="rounded-xl p-4 form-section-box">
              <p className="text-xs font-semibold uppercase tracking-wider mb-3 text-indigo-400">
                Business Goals
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label-xs">
                    Business Goal *
                  </label>
                  <select
                    name="businessGoal"
                    value={formData.businessGoal}
                    onChange={handleChange}
                    className={`w-full px-3 py-2.5 text-sm cursor-pointer form-input ${errors.businessGoal ? 'border border-red-500' : ''}`}
                  >
                    <option value="">Select Goal</option>
                    {businessGoals.map((g) => (
                      <option key={g} value={g} className="bg-[#1e1e3a] text-white">
                        {g}
                      </option>
                    ))}
                  </select>
                  {errors.businessGoal && (
                    <p className="mt-1 text-xs text-red-400">{errors.businessGoal}</p>
                  )}
                </div>
                <div>
                  <label className="form-label-xs">
                    Target Audience *
                  </label>
                  <select
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleChange}
                    className={`w-full px-3 py-2.5 text-sm cursor-pointer form-input ${errors.targetAudience ? 'border border-red-500' : ''}`}
                  >
                    <option value="">Select Audience</option>
                    {targetAudiences.map((a) => (
                      <option key={a} value={a} className="bg-[#1e1e3a] text-white">
                        {a}
                      </option>
                    ))}
                  </select>
                  {errors.targetAudience && (
                    <p className="mt-1 text-xs text-red-400">{errors.targetAudience}</p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-bold text-white text-base transition-all btn-primary hover:scale-[1.01] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? '⏳ Saving to Database...' : '🚀 Save Business & Go to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBusiness;
