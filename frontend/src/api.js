import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

// Har request ke saath JWT token automatically attach karo
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Token expire/invalid ho to logout karke login page par bhejo
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && localStorage.getItem('token')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Backend ke error se readable message nikalo
export const errMsg = (e) =>
  e.response?.data?.message ||
  e.response?.data?.errors?.[0]?.msg ||
  e.message ||
  'Something went wrong';

export default api;
