import { usersApi } from '../api/userApi';
import toast from 'react-hot-toast';

export const userService = {
    // Get all users
    getAll: async (params) => {
        const response = await usersApi.getAll(params);
        return response.data.data;
    },

    // Get user by ID
    getById: async (id) => {
        const response = await usersApi.getById(id);
        return response.data.data.user;
    },

    // Invite team member
    invite: async (data) => {
        const response = await usersApi.invite(data);
        toast.success('Invitation sent successfully!');
        return response.data.data;
    },

    // Accept invitation
    acceptInvite: async (data) => {
        const response = await usersApi.acceptInvite(data);
        toast.success('Invitation accepted! Welcome to Studio X!');
        return response.data.data.user;
    },

    // Update user
    update: async (id, data) => {
        const response = await usersApi.update(id, data);
        toast.success('User updated successfully!');
        return response.data.data.user;
    },

    // Update user status
    updateStatus: async (id, status) => {
        const response = await usersApi.updateStatus(id, status);
        toast.success(`User ${status === 'active' ? 'activated' : 'deactivated'} successfully!`);
        return response.data.data.user;
    },

    // Delete user
    delete: async (id) => {
        await usersApi.delete(id);
        toast.success('User deleted successfully!');
    },

    // Bulk status update
    bulkStatus: async (userIds, status) => {
        const response = await usersApi.bulkStatus(userIds, status);
        toast.success(`${response.data.data.count} users ${status === 'active' ? 'activated' : 'deactivated'}!`);
        return response.data.data;
    },

    // Bulk delete
    bulkDelete: async (userIds) => {
        const response = await usersApi.bulkDelete(userIds);
        toast.success(`${response.data.data.count} users deleted successfully!`);
        return response.data.data;
    },
};