import { userApi } from '../api/userApi';
import toast from 'react-hot-toast';

export const userService = {
  // Get all users
  getAll: async (params) => {
    const response = await userApi.getAll(params)
    return response.data.data
  },

  // Get user by ID
  getById: async (id) => {
    const response = await userApi.getById(id)
    return response.data.data.user
  },

  // Create user
  create: async (data) => {
    const response = await userApi.create(data)
    toast.success('User created successfully!')
    return response.data.data.user
  },

  // Update user
  update: async (id, data) => {
    const response = await userApi.update(id, data)
    toast.success('User updated successfully!')
    return response.data.data.user
  },

  // Update user status
  updateStatus: async (id, status) => {
    const response = await userApi.updateStatus(id, status)
    toast.success(`User ${status === 'active' ? 'activated' : 'deactivated'} successfully!`)
    return response.data.data.user
  },

  // Update user role
  updateRole: async (id, role) => {
    const response = await userApi.updateRole(id, role)
    toast.success(`User role updated to ${role}!`)
    return response.data.data.user
  },

  // Delete user
  delete: async (id) => {
    await userApi.delete(id)
    toast.success('User deleted successfully!')
  },

  // Invite user
  invite: async (data) => {
    const response = await userApi.invite(data)
    toast.success(`Invitation sent to ${data.email}!`)
    return response.data
  },

  // Bulk status update
  bulkStatus: async (userIds, status) => {
    const response = await userApi.bulkStatus(userIds, status)
    toast.success(`${userIds.length} users ${status === 'active' ? 'activated' : 'deactivated'}!`)
    return response.data
  },

  // Bulk delete
  bulkDelete: async (userIds) => {
    await userApi.bulkDelete(userIds)
    toast.success(`${userIds.length} users deleted successfully!`)
  },
}