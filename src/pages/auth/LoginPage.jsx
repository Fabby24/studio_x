import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/authService';
import GoogleButton from '../../components/ui/GoogleButton';

const loginSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional(),
});

const LoginPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors,
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
    });

    useEffect(() => {
        if (isAuthenticated && user) {
            const dashboardRoute = user.role === 'super_admin' || user.role === 'org_admin'
                ? '/dashboard/admin'
                : '/dashboard/team';
            navigate(dashboardRoute, { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        clearErrors();

        try {
            await authService.login(data.email, data.password);

            const store = useAuthStore.getState();
            const user = store.user;
            const userRole = user?.role;
            
            let dashboardRoute;
            if (userRole === 'super_admin') {
                dashboardRoute = '/dashboard/super-admin';
            } else if (userRole === 'org_admin') {
                dashboardRoute = '/dashboard/admin';
            } else {
                dashboardRoute = '/dashboard/team';
            }

            
            setTimeout(() => {
                navigate(dashboardRoute, { replace: true });
            }, 500);

        } catch (error) {
            setError('root', {
                message: error.response?.data?.message || 'Invalid email or password',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full space-y-6 font-poppins">
            {/* Mobile Logo - only visible on mobile */}
            <div className="lg:hidden text-center">
                <div className="flex items-center justify-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED]">
                        <span className="text-xl font-bold text-white">SX</span>
                    </div>
                    <div className="text-left">
                        <h1 className="text-xl font-bold tracking-tight text-white">STUDIO X</h1>
                        <p className="text-[8px] text-white/40 tracking-wider">TRAFFIC MANAGEMENT</p>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-xs font-semibold text-[#7C3AED] tracking-wide uppercase">Welcome back</p>
                <h2 className="text-2xl font-bold tracking-tight text-white">Sign in to your account</h2>
                <p className="text-sm text-white/60">
                    Access your projects, tasks and team in one place.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {errors.root && (
                    <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
                        {errors.root.message}
                    </div>
                )}

                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-white/80">Email address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                        <input
                            id="email"
                            type="email"
                            placeholder="name@company.com"
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 pl-10 text-white placeholder:text-white/40 focus:border-[#2563EB]/50 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition-all duration-200"
                            {...register('email')}
                            disabled={isLoading}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-sm text-red-400">{errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label htmlFor="password" className="text-sm font-medium text-white/80">Password</label>
                        <Link
                            to="/forgot-password"
                            className="text-sm text-[#2563EB] hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 pl-10 pr-10 text-white placeholder:text-white/40 focus:border-[#2563EB]/50 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition-all duration-200"
                            {...register('password')}
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-sm text-red-400">{errors.password.message}</p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="rememberMe"
                        className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#2563EB] focus:ring-[#2563EB]/20"
                        {...register('rememberMe')}
                        disabled={isLoading}
                    />
                    <label htmlFor="rememberMe" className="text-sm text-white/60 cursor-pointer">
                        Remember me
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-lg bg-gradient-to-r from-[#2563EB] to-[#7C3AED] py-3 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                            Signing in...
                        </>
                    ) : (
                        <>
                            Sign in
                            <ArrowRight className="ml-2 inline h-4 w-4" />
                        </>
                    )}
                </button>
            </form>
            <div className="relative">
    <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-white/10" />
    </div>
    <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-[#0B132B] px-2 text-white/40">OR CONTINUE WITH</span>
    </div>
</div>

<GoogleButton isLoading={isLoading} />

            <p className="text-center text-sm text-white/60">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-[#2563EB] hover:underline">
                    Create account
                </Link>
            </p>
        </div>
    );
};

export default LoginPage;