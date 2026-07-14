import apiClient from './client';

export const dashboardApi = {
    // Super Admin Dashboard
    getSuperAdminStats: () => apiClient.get('/dashboard/super-admin'),

    // Organization Admin Dashboard
    getAdminStats: () => apiClient.get('/dashboard/admin'),

    // Team Member Dashboard
    getTeamStats: () => apiClient.get('/dashboard/team'),
};