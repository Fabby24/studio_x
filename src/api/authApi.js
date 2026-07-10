import apiClient from './client';

export const authApi = {
    // Register new user with organization
    register: (data) => apiClient.post('/auth/register', data),

    // Login user
    login: (data) => apiClient.post('/auth/login', data),

    // Get current user profile
    getProfile: () => apiClient.get('/auth/profile'),

    // Request password reset
    forgotPassword: (data) => apiClient.post('/auth/forgot-password', data),

    // Reset password with token
    resetPassword: (data) => apiClient.post('/auth/reset-password', data),

    // Change password
    changePassword: (data) => apiClient.post('/auth/change-password', data),

    // Logout
    logout: () => apiClient.post('/auth/logout'),
};