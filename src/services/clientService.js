import { clientApi } from '../api/clientApi'
import toast from 'react-hot-toast'

export const clientService = {
    // Get all clients
    getAll: async (params) => {
        const response = await clientApi.getAll(params)
        return response.data.data
    },

    // Get client by ID
    getById: async (id) => {
        const response = await clientApi.getById(id)
        return response.data.data.client
    },

    // Create client
    create: async (data) => {
        const response = await clientApi.create(data)
        toast.success('Client created successfully!')
        return response.data.data.client
    },

    // Update client
    update: async (id, data) => {
        const response = await clientApi.update(id, data)
        toast.success('Client updated successfully!')
        return response.data.data.client
    },

    // Update client status
    updateStatus: async (id, status) => {
        const response = await clientApi.updateStatus(id, status)
        toast.success(`Client ${status === 'active' ? 'activated' : 'deactivated'} successfully!`)
        return response.data.data.client
    },

    // Archive client
    archive: async (id) => {
        await clientApi.archive(id)
        toast.success('Client archived successfully!')
    },

    // Restore client
    restore: async (id) => {
        const response = await clientApi.restore(id)
        toast.success('Client restored successfully!')
        return response.data.data.client
    },

    // Permanently delete client
    delete: async (id) => {
        await clientApi.delete(id)
        toast.success('Client deleted permanently!')
    },

    // Get client statistics
    getStats: async () => {
        const response = await clientApi.getStats()
        return response.data.data
    },

    // Bulk actions
    bulkStatus: async (ids, status) => {
        const response = await clientApi.bulkStatus(ids, status)
        toast.success(response.data.message)
        return response.data.data
    },

    bulkArchive: async (ids) => {
        const response = await clientApi.bulkArchive(ids)
        toast.success(response.data.message)
        return response.data.data
    },

    bulkDelete: async (ids) => {
        const response = await clientApi.bulkDelete(ids)
        toast.success(response.data.message)
        return response.data.data
    },
}