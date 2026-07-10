import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from './ProtectedRoute';

// Lazy load pages
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));

const PageLoader = () => (
    <div className="flex h-screen items-center justify-center bg-[#0B132B]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2563EB] border-t-transparent" />
    </div>
);

const AppRoutes = () => {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['super_admin', 'org_admin', 'team_member']} />}>
                    <Route path="/dashboard/admin" element={<div>Admin Dashboard</div>} />
                    <Route path="/dashboard/team" element={<div>Team Dashboard</div>} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<div>404 - Page Not Found</div>} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;