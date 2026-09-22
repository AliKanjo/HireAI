/**
 * HireAI API Service
 * Axios instance pre-configured with:
 *  - Base URL pointing at Laravel backend (port 8000)
 *  - Automatic Bearer token injection from localStorage
 *  - Laravel 422 validation-error normalizer
 */

import axios from 'axios';

// ─── Axios Instance ──────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false, // Sanctum token-based (not cookie-based) auth
});

// ─── Request Interceptor: Attach Saved Bearer Token ─────────────────────────

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hireai_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// ─── Response Interceptor: Normalize Errors ──────────────────────────────────
// Laravel returns 422 validation failures as:
//   { message: "...", errors: { field: ["msg1", "msg2"] } }
// We flatten these into a single human-readable string for the UI.

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 422) {
      const errors = error.response.data?.errors || {};
      const flat = Object.values(errors).flat().join(' ');
      error.uiMessage = flat || error.response.data?.message || 'Validation failed.';
    } else if (error.response?.status === 429) {
      error.uiMessage = 'Too many attempts. Please wait a moment and try again.';
    } else if (error.response?.status === 403) {
      error.uiMessage = error.response.data?.message || 'Access denied.';
    } else if (error.response?.status === 401) {
      error.uiMessage = 'Session expired. Please sign in again.';
      // Clear stale token
      localStorage.removeItem('hireai_token');
    } else if (!error.response) {
      error.uiMessage = 'Cannot reach the server. Check that the backend is running on port 8000.';
    } else {
      error.uiMessage = error.response.data?.message || 'An unexpected error occurred.';
    }
    return Promise.reject(error);
  }
);

// ─── Auth Helpers ─────────────────────────────────────────────────────────────

export const authApi = {
  /**
   * Register a new candidate or recruiter account.
   * @param {{ name: string, email: string, password: string, role: 'candidate'|'recruiter' }} data
   * @returns {{ user: object, token: string }}
   */
  register: async (data) => {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  /**
   * Log in with email + password.
   * @param {{ email: string, password: string }} data
   * @returns {{ user: object, token: string }}
   */
  login: async (data) => {
    const res = await api.post('/auth/login', data);
    return res.data;
  },

  /**
   * Fetch the currently authenticated user (for token rehydration on refresh).
   * @returns {object} user
   */
  me: async () => {
    const res = await api.get('/auth/user');
    return res.data;
  },

  /**
   * Revoke the current Sanctum token on the server.
   */
  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('hireai_token');
  },
};

export default api;
