const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY
const USER_KEY = import.meta.env.VITE_USER_KEY 

export const tokenService = {
  // Get token from localStorage
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY)
  },
  
  // Set token in localStorage
  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token)
  },
  
  // Remove token from localStorage
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY)
  },
  
  // Get user from localStorage
  getUser: () => {
    const userStr = localStorage.getItem(USER_KEY)
    try {
      return userStr ? JSON.parse(userStr) : null
    } catch {
      return null
    }
  },
  
  // Set user in localStorage
  setUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },
  
  // Remove user from localStorage
  removeUser: () => {
    localStorage.removeItem(USER_KEY)
  },
  
  // Clear all auth data
  clearAll: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },
  
  // Check if token exists and is valid
  hasToken: () => {
    return !!localStorage.getItem(TOKEN_KEY)
  },
}