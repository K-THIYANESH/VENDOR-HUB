import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';

// Target local or deployed backend dynamically
const baseURL = import.meta.env.VITE_API_URL || (
  window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://vendor-hub-93o2.onrender.com'
);

// Axios Instance with secure credentials sharing enabled
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Concurrency safe token refreshing queue
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const addToast = useToastStore.getState().addToast;
    const logout = useAuthStore.getState().logout;
    
    // Intercept 401 to attempt silent refresh via HttpOnly refresh cookie
    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      useAuthStore.getState().isAuthenticated
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(`${baseURL}/api/auth/refresh`, {}, { withCredentials: true });
        const { token } = refreshResponse.data;
        
        useAuthStore.setState({ token });
        originalRequest.headers.Authorization = `Bearer ${token}`;
        processQueue(null, token);
        isRefreshing = false;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        logout();
        addToast('Session expired. Please log in again.', 'warning');
        return Promise.reject(refreshError);
      }
    }

    const msg = error.response?.data?.error || error.response?.data?.message || 'Something went wrong';
    if (error.response?.status !== 401) {
      addToast(msg, 'error');
    }
    
    return Promise.reject(error);
  }
);

export default api;

