import axios from 'axios'
import toast from 'react-hot-toast'

// Get base URL from environment
const API_URL = import.meta.env.VITE_API_URL

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Request interceptor - Add token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(import.meta.env.VITE_TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error
    
    // Handle specific error codes
    if (response) {
      switch (response.status) {
        case 401:
          // Unauthorized - Clear token and redirect to login
          localStorage.removeItem(import.meta.env.VITE_TOKEN_KEY )
          localStorage.removeItem(import.meta.env.VITE_USER_KEY)
          toast.error('Session expired. Please login again.')
          
          // Redirect to login if not already there
          if (window.location.pathname !== '/login') {
            window.location.href = '/login'
          }
          break
          
        case 403:
          toast.error('You do not have permission to perform this action')
          break
          
        case 404:
          toast.error('Resource not found')
          break
          
        case 422:
          // Validation error - handled by component
          break
          
        case 500:
          toast.error('Server error. Please try again later.')
          break
          
        default:
          if (response.data?.message) {
            toast.error(response.data.message)
          } else {
            toast.error('An error occurred. Please try again.')
          }
      }
    } else if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please try again.')
    } else if (error.message === 'Network Error') {
      toast.error('Network error. Please check your connection.')
    }
    
    return Promise.reject(error)
  }
)

// Helper methods
export const api = {
  get: (url, config) => apiClient.get(url, config),
  post: (url, data, config) => apiClient.post(url, data, config),
  put: (url, data, config) => apiClient.put(url, data, config),
  patch: (url, data, config) => apiClient.patch(url, data, config),
  delete: (url, config) => apiClient.delete(url, config),
}