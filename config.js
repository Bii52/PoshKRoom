/**
 * API Configuration
 * Auto-detect backend URL từ environment
 */

const getApiUrl = () => {
  // 1. Check localStorage (user can set manually)
  const stored = localStorage.getItem('API_URL');
  if (stored) {
    console.log('✓ Using API_URL from localStorage:', stored);
    return stored;
  }

  // 2. Check environment variable (Netlify inject này)
  if (window.REACT_APP_BACKEND_URL) {
    console.log('✓ Using API_URL from environment (REACT_APP_BACKEND_URL):', window.REACT_APP_BACKEND_URL);
    return window.REACT_APP_BACKEND_URL;
  }

  // 3. Check window config
  if (window.API_CONFIG?.API_URL) {
    console.log('✓ Using API_URL from window.API_CONFIG:', window.API_CONFIG.API_URL);
    return window.API_CONFIG.API_URL;
  }

  // 4. Check window.BACKEND_URL
  if (window.BACKEND_URL) {
    console.log('✓ Using API_URL from window.BACKEND_URL:', window.BACKEND_URL);
    return window.BACKEND_URL;
  }

  // 5. Development - localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('✓ Using localhost backend');
    return 'http://localhost:3000';
  }

  // 6. Production fallback - same origin (not ideal)
  console.warn('⚠️ REACT_APP_BACKEND_URL not set! Falling back to same origin.');
  console.warn('⚠️ To fix: Set REACT_APP_BACKEND_URL in Netlify Environment Variables');
  const sameOrigin = window.location.origin;
  console.log('ℹ️  Using:', sameOrigin);
  return sameOrigin;
};

const API_URL = getApiUrl();

console.log('🌐 API Configuration loaded');
console.log('📍 Current Site:', window.location.href);
console.log('📍 Hostname:', window.location.hostname);
console.log('🔗 API URL:', API_URL);

// Helper function để construct full URL
function buildApiUrl(path) {
  // Nếu path đã là full URL, dùng luôn
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Nếu path bắt đầu với /, remove nó
  const cleanPath = path.startsWith('/') ? path : '/' + path;
  
  const fullUrl = API_URL + cleanPath;
  return fullUrl;
}

// Wrap fetch để tự động thêm API_URL và logging
const originalFetch = window.fetch;
window.fetch = function(...args) {
  const [resource, config] = args;
  
  // Nếu resource là relative path liên quan API, thêm API URL
  if (typeof resource === 'string' && (resource.startsWith('/api') || resource.startsWith('api'))) {
    const fullUrl = buildApiUrl(resource);
    console.log('📡 API Request:', resource, '→', fullUrl);
    args[0] = fullUrl;
  }
  
  return originalFetch.apply(this, args)
    .then(response => {
      if (!response.ok) {
        console.warn(`⚠️  API Response [${response.status}]:`, resource);
      }
      return response;
    })
    .catch(error => {
      console.error('❌ API Fetch Error:', resource, error);
      throw error;
    });
};

console.log('✓ API wrapper loaded');
