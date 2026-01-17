import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data)
};

// Campaigns API
export const campaignsAPI = {
    getAll: (params) => api.get('/campaigns', { params }),
    getFeatured: () => api.get('/campaigns/featured'),
    getById: (id) => api.get(`/campaigns/${id}`),
    create: (data) => api.post('/campaigns', data),
    update: (id, data) => api.put(`/campaigns/${id}`, data),
    delete: (id) => api.delete(`/campaigns/${id}`),
    getMyCampaigns: () => api.get('/campaigns/user/my-campaigns')
};

// Donations API
export const donationsAPI = {
    createOrder: (data) => api.post('/donations/create-order', data),
    verifyPayment: (data) => api.post('/donations/verify-payment', data),
    getByCampaign: (campaignId, params) => api.get(`/donations/campaign/${campaignId}`, { params }),
    getMyDonations: () => api.get('/donations/my-donations')
};

// Admin API
export const adminAPI = {
    getStats: () => api.get('/admin/stats'),
    getUsers: (params) => api.get('/admin/users', { params }),
    updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
    getCampaigns: (params) => api.get('/admin/campaigns', { params }),
    updateCampaignStatus: (id, status) => api.put(`/admin/campaigns/${id}/status`, { status }),
    toggleFeatured: (id) => api.put(`/admin/campaigns/${id}/featured`),
    getDonations: (params) => api.get('/admin/donations', { params })
};

export default api;
