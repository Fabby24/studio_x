import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { useAuthStore } from './store/authStore'
import { useThemeStore } from './store/themeStore'

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, 
    },
  },
})

function App() {
  const { initialize } = useAuthStore()
  const { theme, initialize: initializeTheme } = useThemeStore()
  
  useEffect(() => {
    // Initialize auth from localStorage
    initialize()
    
    // Initialize theme
    const defaultTheme = initializeTheme()
    if (theme === 'dark' || defaultTheme === 'dark') {
      document.documentElement.classList.add('dark')
    }
  }, [])
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            className: '!bg-card !text-foreground !border !border-border',
            style: {
              background: 'hsl(var(--card))',
              color: 'hsl(var(--card-foreground))',
              border: '1px solid hsl(var(--border))',
            },
            success: {
              iconTheme: {
                primary: '#22C55E',
                secondary: 'white',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: 'white',
              },
            },
          }}
        />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App