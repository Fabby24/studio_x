import { api } from './client'

export const authApi = {
  // Register new user
  register: (data) => api.post('/auth/register', data),
  
  // Login user
  login: (data) => api.post('/auth/login', data),
  
  // Request password reset
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  
  // Reset password with token
  resetPassword: (data) => api.post('/auth/reset-password', data),
  
  // Get current user profile
  getProfile: () => api.get('/auth/profile'),
  
  // Update user profile
  updateProfile: (data) => api.put('/auth/profile', data),
}

export const userApi = {
  // Get all users (admin only)
  getAllUsers: () => api.get('/users'),
  
  // Get user by ID (admin only)
  getUserById: (id) => api.get(`/users/${id}`),
  
  // Update user status (admin only)
  updateUserStatus: (id, status) => api.patch(`/users/${id}/status`, { status }),
  
  // Update user role (admin only)
  updateUserRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
  
  // Delete user (admin only)
  deleteUser: (id) => api.delete(`/users/${id}`),
}