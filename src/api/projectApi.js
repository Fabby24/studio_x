import apiClient from './client';

export const projectApi = {
    // Get all projects with pagination, filters, and sorting
    getAll: (params = {}) => {
        const {
            page = 1,
            limit = 10,
            search = '',
            status = '',
            priority = '',
            projectType = '',
            department = '',
            healthStatus = '',
            managerId = '',
            clientId = '',
            assignedToMe = false,
            sortBy = 'created_at',
            sortOrder = 'desc',
            includeArchived = false,
        } = params;

        const queryParams = new URLSearchParams();
        queryParams.append('page', page);
        queryParams.append('limit', limit);
        if (search) queryParams.append('search', search);
        if (status) queryParams.append('status', status);
        if (priority) queryParams.append('priority', priority);
        if (projectType) queryParams.append('projectType', projectType);
        if (department) queryParams.append('department', department);
        if (healthStatus) queryParams.append('healthStatus', healthStatus);
        if (managerId) queryParams.append('managerId', managerId);
        if (clientId) queryParams.append('clientId', clientId);
        if (assignedToMe) queryParams.append('assignedToMe', 'true');
        if (sortBy) queryParams.append('sortBy', sortBy);
        if (sortOrder) queryParams.append('sortOrder', sortOrder);
        if (includeArchived) queryParams.append('includeArchived', 'true');

        return apiClient.get(`/projects?${queryParams.toString()}`);
    },

    // Get single project by ID
    getById: (id) => apiClient.get(`/projects/${id}`),

    // Get project statistics
    getStats: () => apiClient.get('/projects/stats'),

    // Create new project
    create: (data) => apiClient.post('/projects', data),

    // Update project
    update: (id, data) => apiClient.put(`/projects/${id}`, data),

    // Archive project
    archive: (id) => apiClient.patch(`/projects/${id}/archive`),

    // Restore project
    restore: (id) => apiClient.patch(`/projects/${id}/restore`),

    // Delete project (soft delete)
    delete: (id) => apiClient.delete(`/projects/${id}`),

    // Bulk archive projects
    bulkArchive: (projectIds) => apiClient.post('/projects/bulk-archive', { projectIds }),

    // Bulk delete projects
    bulkDelete: (projectIds) => apiClient.post('/projects/bulk-delete', { projectIds }),
};