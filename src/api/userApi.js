import apiClient from './client';

export const usersApi = {
    // Get all users in organization
    getAll: (params = {}) => {
        const { page = 1, limit = 10, search = '', role = '', status = '' } = params;
        const queryParams = new URLSearchParams();
        queryParams.append('page', page);
        queryParams.append('limit', limit);
        if (search) queryParams.append('search', search);
        if (role) queryParams.append('role', role);
        if (status) queryParams.append('status', status);
        
        return apiClient.get(`/users?${queryParams.toString()}`);
    },

    // Get single user
    getById: (id) => apiClient.get(`/users/${id}`),

    // Invite team member
    invite: (data) => apiClient.post('/users/invite', data),

    // Accept invitation
    acceptInvite: (data) => apiClient.post('/users/accept-invite', data),

    // Update user
    update: (id, data) => apiClient.put(`/users/${id}`, data),

    // Update user status
    updateStatus: (id, status) => apiClient.patch(`/users/${id}/status`, { status }),

    // Delete user
    delete: (id) => apiClient.delete(`/users/${id}`),

    // Bulk status update
    bulkStatus: (userIds, status) => apiClient.post('/users/bulk-status', { userIds, status }),

    // Bulk delete
    bulkDelete: (userIds) => apiClient.post('/users/bulk-delete', { userIds }),
};