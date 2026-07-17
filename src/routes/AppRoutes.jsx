import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from '../routes/ProtectedRoute';
import AuthLayout from '../components/layout/AuthLayout';

// Auth Pages
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));
const AuthCallbackPage = lazy(() => import('../pages/auth/AuthCallbackPage'));
const AcceptInvitePage = lazy(() => import('../pages/auth/AcceptInvitePage'));

// Dashboard Pages
const SuperAdminDashboard = lazy(() => import('../pages/dashboard/SuperAdminDashboardPage'));
const AdminDashboard = lazy(() => import('../pages/dashboard/AdminDashboardPage'));
const TeamDashboard = lazy(() => import('../pages/dashboard/TeamDashboardPage'));

//users page
const UsersPage = lazy(() => import('../pages/users/UsersPage'));
const ProjectsPage = lazy(() => import('../pages/projects/ProjectsPage'));
const ProjectDetailsPage = lazy(() => import('../pages/projects/ProjectDetailsPage'));


const PageLoader = () => (
    <div className="flex h-screen items-center justify-center bg-[#0B132B]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2563EB] border-t-transparent" />
    </div>
);

const AppRoutes = () => {
    return (
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

                {/* Auth Callback (no layout) */}
                <Route path="/auth/callback" element={<AuthCallbackPage />} />
                <Route path="/accept-invite" element={<AcceptInvitePage />} />
                

                {/* Protected Routes */}
                {/* Super Admin Only */}
                <Route
                    element={<ProtectedRoute allowedRoles={['super_admin']} />}
                >
                    <Route path="/dashboard/super-admin" element={<SuperAdminDashboard />} />
                    <Route path="/users" element={<UsersPage />} />
                </Route>

                {/* Organization Admin Only */}
                <Route
                    element={<ProtectedRoute allowedRoles={['org_admin']} />}
                >
                    <Route path="/dashboard/admin" element={<AdminDashboard />} />
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/projects/:id" element={<ProjectDetailsPage />} />
                </Route>

                {/* Team Member Only */}
                <Route
                    element={<ProtectedRoute allowedRoles={['team_member']} />}
                >
                    <Route path="/dashboard/team" element={<TeamDashboard />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/projects/:id" element={<ProjectDetailsPage />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<div className="text-white">404 - Page Not Found</div>} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;