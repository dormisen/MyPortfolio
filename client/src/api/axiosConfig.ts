import axios from 'axios';

const API_BASE_URL = (import.meta.env?.VITE_API_URL as string) || '/api';

// Enhanced axios instance with better error handling
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true
});

// Plain axios instance for auth calls
const plainAxios = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000
});

// Request interceptor
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Enhanced headers
    config.headers = config.headers || {};
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    config.headers['X-Request-ID'] = generateRequestId();
    
    if (!config.headers['Content-Type'] && !(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
  } catch (e) {
    console.warn('Error setting request headers:', e);
  }
  return config;
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Enhanced response interceptor with better token refresh
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;
let requestQueue: Array<(token: string | null) => void> = [];

const processQueue = (token: string | null) => {
  requestQueue.forEach(cb => cb(token));
  requestQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const isAuthEndpoint = originalRequest.url?.includes('/admin/');

    // Only handle 401 for non-auth endpoints
    if (status === 401 && !isAuthEndpoint && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        refreshPromise = (async () => {
          try {
            const refreshResponse = await plainAxios.post('/admin/refresh', {}, {
              headers: {
                'X-Request-ID': generateRequestId()
              },
              timeout: 10000
            });

            const newToken = refreshResponse.data?.token;
            if (newToken) {
              localStorage.setItem('adminToken', newToken);
              return newToken;
            }
            return null;
          } catch (refreshError) {
            console.warn('Token refresh failed:', refreshError);
            
            // Clear tokens and redirect to login on refresh failure
            localStorage.removeItem('adminToken');
            localStorage.removeItem('loginTime');
            window.dispatchEvent(new Event('tokenRefreshFailed'));
            
            return null;
          } finally {
            isRefreshing = false;
          }
        })();
      }

      return new Promise((resolve, reject) => {
        requestQueue.push((token: string | null) => {
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          } else {
            reject(error);
          }
        });

        refreshPromise!.then((newToken) => {
          processQueue(newToken);
        }).catch(() => {
          processQueue(null);
        });
      });
    }

    // Enhanced error handling
    if (status === 403) {
      console.error('Access forbidden - insufficient permissions');
    } else if (status === 429) {
      console.warn('Rate limit exceeded');
    } else if (status >= 500) {
      console.error('Server error:', status);
    }

    return Promise.reject(error);
  }
);

// Global token refresh failure handler
if (typeof window !== 'undefined') {
  window.addEventListener('tokenRefreshFailed', () => {
    // This can be used by components to show login modal or redirect
    console.log('Token refresh failed - user should reauthenticate');
  });
}

// Helper: generate request-id
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export default api;
export { plainAxios };