import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'light',
      
      setTheme: (theme) => {
        set({ theme })
        // Apply theme to document
        if (theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },
      
      toggleTheme: () => {
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light'
          // Apply theme to document
          if (newTheme === 'dark') {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
          return { theme: newTheme }
        })
      },
      
      initialize: () => {
        // Check system preference if no stored theme
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        const defaultTheme = prefersDark ? 'dark' : 'light'
        return defaultTheme
      },
    }),
    {
      name: 'theme-storage',
    }
  )
)