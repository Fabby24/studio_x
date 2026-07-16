import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/authService';
import { authApi } from '../../api/authApi';
import { Loader2 } from 'lucide-react';

const AuthCallbackPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login, setLoading } = useAuthStore();
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleCallback = async () => {
            const token = searchParams.get('token');
            const errorParam = searchParams.get('error');

            if (errorParam) {
                setError('Google authentication failed. Please try again.');
                setTimeout(() => navigate('/login'), 3000);
                return;
            }

            if (!token) {
                setError('No authentication token received.');
                setTimeout(() => navigate('/login'), 3000);
                return;
            }

            try {
                setLoading(true);
                
                // Store token
                localStorage.setItem('token', token);

                const repsonse = await authApi.getProfile({
                    headers: { Authorization: `Bearer ${token}` }
                })
                
                // Fetch user profile
                const { user, tenant } = repsonse.data.data;
                
                // Set auth state
                login(user, token, tenant);
                
                // Redirect to appropriate dashboard
                const role = user?.role;
                let dashboardRoute = '/dashboard/team';
                
                if (role === 'super_admin') {
                    dashboardRoute = '/dashboard/super-admin';
                } else if (role === 'org_admin') {
                    dashboardRoute = '/dashboard/admin';
                }
                
                navigate(dashboardRoute, { replace: true });
                
            } catch (error) {
                console.error('Auth callback error:', error);
                localStorage.removeItem('token');
                setError('Failed to authenticate. Please try again.');
                setTimeout(() => navigate('/login'), 3000);
            } finally {
                setLoading(false);
            }
        };

        handleCallback();
    }, [searchParams, navigate, login, setLoading]);

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0B132B]">
                <div className="text-center">
                    <div className="mb-4 text-red-400 text-lg">⚠️</div>
                    <p className="text-red-400">{error}</p>
                    <p className="text-white/40 text-sm mt-2">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen items-center justify-center bg-[#0B132B]">
            <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#2563EB] mx-auto" />
                <p className="mt-4 text-white/60">Authenticating with Google...</p>
            </div>
        </div>
    );
};

export default AuthCallbackPage;