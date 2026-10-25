import axios from 'axios';

// Central API Base URL configuration
// In production on Vercel, set VITE_API_URL in Vercel Project Settings > Environment Variables
export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

// Global Axios Interceptor to dynamically redirect http://localhost:5000 to API_BASE_URL
axios.interceptors.request.use((config) => {
  if (config.url && config.url.startsWith('http://localhost:5000')) {
    config.url = config.url.replace('http://localhost:5000', API_BASE_URL);
  }
  return config;
});

// Global Fetch Interceptor to dynamically redirect http://localhost:5000 to API_BASE_URL
if (typeof window !== 'undefined' && window.fetch) {
  const originalFetch = window.fetch;
  window.fetch = function (resource, init) {
    if (typeof resource === 'string' && resource.startsWith('http://localhost:5000')) {
      resource = resource.replace('http://localhost:5000', API_BASE_URL);
    }
    return originalFetch(resource, init);
  };
}

export default API_BASE_URL;
