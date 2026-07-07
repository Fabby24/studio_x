import { api } from './client'

export const clientApi = {
    // Get all clients with pagination and filters
    getAll: (params = {}) => {
        const { page = 1, limit = 10, search = '', status = '', industry = '', priority = '', assigned_to = '' } = params
        const queryParams = new URLSearchParams()
        queryParams.append('page', page)
        queryParams.append('limit', limit)
        if (search) queryParams.append('search', search)
        if (status) queryParams.append('status', status)
        if (industry) queryParams.append('industry', industry)
        if (priority) queryParams.append('priority', priority)
        if (assigned_to) queryParams.append('assigned_to', assigned_to)
        
        return api.get(`/clients?${queryParams.toString()}`)
    },

    // Get single client
    getById: (id) => api.get(`/clients/${id}`),

    // Create new client
    create: (data) => api.post('/clients', data),

    // Update client
    update: (id, data) => api.put(`/clients/${id}`, data),

    // Update client status
    updateStatus: (id, status) => api.patch(`/clients/${id}/status`, { status }),

    // Archive client
    archive: (id) => api.delete(`/clients/${id}`),

    // Restore client
    restore: (id) => api.post(`/clients/${id}/restore`),

    // Permanently delete client
    delete: (id) => api.delete(`/clients/${id}/permanent`),

    // Get client statistics
    getStats: () => api.get('/clients/stats'),

    // Bulk actions
    bulkStatus: (ids, status) => api.post('/clients/bulk-status', { ids, status }),
    bulkArchive: (ids) => api.post('/clients/bulk-archive', { ids }),
    bulkDelete: (ids) => api.post('/clients/bulk-delete', { ids }),
}