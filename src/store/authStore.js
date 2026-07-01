import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { tokenService } from '../services/tokenService'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      
      // Actions
      setUser: (user) => {
        set({ user })
        if (user) {
          tokenService.setUser(user)
        }
      },
      
      setToken: (token) => {
        set({ token })
        if (token) {
          tokenService.setToken(token)
          set({ isAuthenticated: true })
        }
      },
      
      setLoading: (isLoading) => set({ isLoading }),
      
      login: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        })
        tokenService.setToken(token)
        tokenService.setUser(user)
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        })
        tokenService.clearAll()
      },
      
      updateUser: (user) => {
        set({ user })
        tokenService.setUser(user)
      },
      
      // Check if user has specific role
      hasRole: (role) => {
        const { user } = get()
        if (!user) return false
        return user.role === role
      },
      
      // Check if user is admin
      isAdmin: () => {
        const { user } = get()
        return user?.role === 'admin'
      },
      
      // Check if user is team member
      isTeamMember: () => {
        const { user } = get()
        return user?.role === 'team_member'
      },
      
      // Initialize auth from localStorage
      initialize: () => {
        const token = tokenService.getToken()
        const user = tokenService.getUser()
        
        if (token && user) {
          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
          })
          return true
        }
        return false
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)