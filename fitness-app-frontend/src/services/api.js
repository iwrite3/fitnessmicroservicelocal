import axios from 'axios';

// 1. Point this to your API GATEWAY port (assuming it is 8080).
// If your gateway is on a different port, change 8080 to that port.
const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  if (userId) {
    config.headers['X-User-ID'] = userId;
  }
  
  return config;
});

// 2. This now correctly resolves to http://localhost:8080/api/activities
// ... existing interceptor code stays the same ...

export const getActivities = () => api.get('/activities');
export const addActivity = (activity) => api.post('/activities', activity);

// 1. Fetch the core activity data from the ActivityController
export const getActivityDetail = (id) => api.get(`/activities/${id}`);

// 2. Fetch the AI data from the RecommendationController
export const getActivityRecommendation = (id) => api.get(`/recommendations/activity/${id}`);