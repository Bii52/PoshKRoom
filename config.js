/**
 * API Configuration
 * Sử dụng environment variable nếu có, nếu không sử dụng localhost
 */

// Lấy API URL từ localStorage, window config, hoặc environment
const getApiUrl = () => {
  // 1. Check localStorage
  const stored = localStorage.getItem('API_URL');
  if (stored) return stored;

  // 2. Check window config
  if (window.API_CONFIG?.API_URL) return window.API_CONFIG.API_URL;

  // 3. Check window variable
  if (window.BACKEND_URL) return window.BACKEND_URL;

  // 4. Development vs Production
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3000';
  }

  // 5. Production: try to use same domain
  return window.location.origin;
};

const API_URL = getApiUrl();

console.log('Using API_URL:', API_URL);

// Helper function để construct full URL
function buildApiUrl(path) {
  // Nếu path đã là full URL, dùng luôn
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Nếu path bắt đầu với /, remove nó
  const cleanPath = path.startsWith('/') ? path : '/' + path;
  
  return API_URL + cleanPath;
}

// Wrap fetch để tự động thêm API_URL
const originalFetch = window.fetch;
window.fetch = function(...args) {
  const [resource, config] = args;
  
  // Nếu resource là relative path, thêm API URL
  if (typeof resource === 'string' && (resource.startsWith('/api') || resource.startsWith('api'))) {
    args[0] = buildApiUrl(resource);
  }
  
  return originalFetch.apply(this, args);
};

console.log('✓ API Configuration loaded');
