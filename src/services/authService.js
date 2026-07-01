import { authApi } from '../api/authApi'
import { useAuthStore } from '../store/authStore'

export const authService = {
  // Register user
  register: async (data) => {
    const response = await authApi.register(data)
    const { user, token } = response.data.data
    
    // Auto-login after registration
    const store = useAuthStore.getState()
    store.login(user, token)
    
    return { user, token }
  },
  
  // Login user
  login: async (data) => {
    const response = await authApi.login(data)
    const { user, token } = response.data.data
    
    const store = useAuthStore.getState()
    store.login(user, token)
    
    return { user, token }
  },
  
  // Logout user
  logout: () => {
    const store = useAuthStore.getState()
    store.logout()
    
    queryClient.clear()
  },
  
  // Forgot password
  forgotPassword: async (data) => {
    const response = await authApi.forgotPassword(data)
    return response.data
  },
  
  // Reset password
  resetPassword: async (data) => {
    const response = await authApi.resetPassword(data)
    return response.data
  },
  
  // Get current user profile
  getProfile: async () => {
    const response = await authApi.getProfile()
    const user = response.data.data.user
    
    const store = useAuthStore.getState()
    store.setUser(user)
    
    return user
  },
  
  // Update profile
  updateProfile: async (data) => {
    const response = await authApi.updateProfile(data)
    const user = response.data.data.user
    
    const store = useAuthStore.getState()
    store.updateUser(user)
    
    return user
  },
}