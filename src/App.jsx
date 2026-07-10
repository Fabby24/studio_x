import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';
import AuthLayout from './components/layout/AuthLayout';
import ProtectedRoute from './routes/ProtectedRoute';

// Lazy load pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000,
        },
    },
});

const PageLoader = () => (
    <div className="flex h-screen items-center justify-center bg-[#0B132B]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2563EB] border-t-transparent" />
    </div>
);

function App() {
    const { initialize } = useAuthStore();

    useEffect(() => {
        initialize();
    }, [initialize]);

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        {/* Auth Routes with AuthLayout */}
                        <Route element={<AuthLayout />}>
                            <Route path="/" element={<Navigate to="/login" replace />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                            <Route path="/reset-password" element={<ResetPasswordPage />} />
                        </Route>

                        {/* Protected Routes */}
                        <Route element={<ProtectedRoute allowedRoles={['super_admin', 'org_admin', 'team_member']} />}>
                            <Route path="/dashboard/admin" element={<div className="text-white">Admin Dashboard</div>} />
                            <Route path="/dashboard/team" element={<div className="text-white">Team Dashboard</div>} />
                        </Route>

                        {/* Fallback */}
                        <Route path="*" element={<div className="text-white">404 - Page Not Found</div>} />
                    </Routes>
                </Suspense>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#0B132B',
                            color: '#FFFFFF',
                            border: '1px solid rgba(255,255,255,0.1)',
                        },
                        success: {
                            iconTheme: {
                                primary: '#22C55E',
                                secondary: '#0B132B',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#EF4444',
                                secondary: '#0B132B',
                            },
                        },
                    }}
                />
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;