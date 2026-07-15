import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';
import AuthLayout from './components/layout/AuthLayout';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './routes/ProtectedRoute';

// Lazy load pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));
const AuthCallbackPage = lazy(() => import('./pages/auth/AuthCallbackPage'));
const AcceptInvitePage = lazy(() => import('./pages/auth/AcceptInvitationPage'));

// Dashboard Pages
const SuperAdminDashboard = lazy(() => import('./pages/dashboard/SuperAdminDashboardPage'));
const AdminDashboard = lazy(() => import('./pages/dashboard/AdminDashboardPage'));
const TeamDashboard = lazy(() => import('./pages/dashboard/TeamDashboardPage'));

// User Management Pages
const UsersPage = lazy(() => import('./pages/users/UsersPage'));

// Organization Management (Super Admin only)
const OrganizationsPage = lazy(() => import('./pages/organizations/OrganizationsPage'));

// Error Pages
const NotFoundPage = lazy(() => import('./pages/errors/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('./pages/errors/UnauthorizedPage'));

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

                        {/* Auth Callback & Invite (no layout) */}
                        <Route path="/auth/callback" element={<AuthCallbackPage />} />
                        <Route path="/accept-invite" element={<AcceptInvitePage />} />

                        
                        <Route element={<ProtectedRoute allowedRoles={['super_admin']} />}>
                            <Route element={<MainLayout />}>
                                {/* Super Admin Dashboard */}
                                <Route path="/dashboard/super-admin" element={<SuperAdminDashboard />} />
                                
                                {/* Organization Management - Super Admin only */}
                                <Route path="/organizations" element={<OrganizationsPage />} />
                                
                                {/* Platform Users - Super Admin can see all users across orgs */}
                                <Route path="/platform-users" element={<UsersPage />} />
                            </Route>
                        </Route>

                        
                        <Route element={<ProtectedRoute allowedRoles={['org_admin']} />}>
                            <Route element={<MainLayout />}>
                                {/* Organization Admin Dashboard */}
                                <Route path="/dashboard/admin" element={<AdminDashboard />} />
                                
                                {/* Team Members - Org Admin sees only their organization's users */}
                                <Route path="/users" element={<UsersPage />} />
                                
                                {/* Additional org admin routes will go here */}
                                {/* <Route path="/clients" element={<ClientsPage />} /> */}
                                {/* <Route path="/projects" element={<ProjectsPage />} /> */}
                                {/* <Route path="/tasks" element={<TasksPage />} /> */}
                            </Route>
                        </Route>

                        
                        <Route element={<ProtectedRoute allowedRoles={['team_member']} />}>
                            <Route element={<MainLayout />}>
                                {/* Team Member Dashboard */}
                                <Route path="/dashboard/team" element={<TeamDashboard />} />
                                
                                {/* Team members can see their own tasks */}
                                {/* <Route path="/my-tasks" element={<MyTasksPage />} /> */}
                                {/* <Route path="/time-tracking" element={<TimeTrackingPage />} /> */}
                            </Route>
                        </Route>

                       
                        <Route path="/unauthorized" element={<UnauthorizedPage />} />
                        <Route path="*" element={<NotFoundPage />} />
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