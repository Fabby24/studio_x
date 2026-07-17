import { projectApi } from '../api/projectApi';
import toast from 'react-hot-toast';

export const projectService = {
    // Get all projects
    getAll: async (params) => {
        const response = await projectApi.getAll(params);
        return response.data.data;
    },

    // Get project by ID
    getById: async (id) => {
        const response = await projectApi.getById(id);
        return response.data.data.project;
    },

    // Get project statistics
    getStats: async () => {
        const response = await projectApi.getStats();
        return response.data.data;
    },

    // Create project
    create: async (data) => {
        const response = await projectApi.create(data);
        toast.success('Project created successfully!');
        return response.data.data.project;
    },

    // Update project
    update: async (id, data) => {
        const response = await projectApi.update(id, data);
        toast.success('Project updated successfully!');
        return response.data.data.project;
    },

    // Archive project
    archive: async (id) => {
        await projectApi.archive(id);
        toast.success('Project archived successfully!');
    },

    // Restore project
    restore: async (id) => {
        await projectApi.restore(id);
        toast.success('Project restored successfully!');
    },

    // Delete project
    delete: async (id) => {
        await projectApi.delete(id);
        toast.success('Project deleted successfully!');
    },

    // Bulk archive projects
    bulkArchive: async (projectIds) => {
        const response = await projectApi.bulkArchive(projectIds);
        toast.success(`${response.data.data.count} projects archived successfully!`);
        return response.data.data;
    },

    // Bulk delete projects
    bulkDelete: async (projectIds) => {
        const response = await projectApi.bulkDelete(projectIds);
        toast.success(`${response.data.data.count} projects deleted successfully!`);
        return response.data.data;
    },
};