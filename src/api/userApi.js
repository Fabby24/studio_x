import { api } from './client'

export const userApi = {
  // Get all users with pagination and filters
  getAll: (params = {}) => {
    const { page = 1, limit = 10, search = '', role = '', status = '' } = params
    const queryParams = new URLSearchParams()
    queryParams.append('page', page)
    queryParams.append('limit', limit)
    if (search) queryParams.append('search', search)
    if (role) queryParams.append('role', role)
    if (status) queryParams.append('status', status)
    
    return api.get(`/users?${queryParams.toString()}`)
  },

  // Get single user by ID
  getById: (id) => api.get(`/users/${id}`),

  // Create new user
  create: (data) => api.post('/users', data),

  // Update user
  update: (id, data) => api.put(`/users/${id}`, data),

  // Update user status
  updateStatus: (id, status) => api.patch(`/users/${id}/status`, { status }),

  // Update user role
  updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }),

  // Delete user
  delete: (id) => api.delete(`/users/${id}`),

  // Invite user via email
  invite: (data) => api.post('/users/invite', data),

  // Bulk status update
  bulkStatus: (userIds, status) => api.post('/users/bulk-status', { userIds, status }),

  // Bulk delete
  bulkDelete: (userIds) => api.post('/users/bulk-delete', { userIds }),
}