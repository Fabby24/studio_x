import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User, Building2, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/authService';
import GoogleButton from '../../components/ui/GoogleButton';

const registerSchema = z.object({
    first_name: z.string().min(2, 'First name must be at least 2 characters').max(50),
    last_name: z.string().min(2, 'Last name must be at least 2 characters').max(50),
    email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/\d/, 'Password must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    organization_name: z.string().min(2, 'Organization name must be at least 2 characters').max(100),
    organization_slug: z.string()
        .min(2, 'Organization slug must be at least 2 characters')
        .max(100)
        .regex(/^[a-z0-9\-]+$/, 'Slug can only contain lowercase letters, numbers and hyphens'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

const RegisterPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors,
        watch,
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            confirmPassword: '',
            organization_name: '',
            organization_slug: '',
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
            await authService.register({
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                password: data.password,
                organization_name: data.organization_name,
                organization_slug: data.organization_slug,
            });

            const store = useAuthStore.getState();
            const userRole = store.user?.role;
            const dashboardRoute = userRole === 'super_admin' || userRole === 'org_admin'
                ? '/dashboard/admin'
                : '/dashboard/team';

            setTimeout(() => {
                navigate(dashboardRoute, { replace: true });
            }, 1000);

        } catch (error) {
            setError('root', {
                message: error.response?.data?.message || 'Registration failed. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full space-y-6 font-poppins">
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
                <p className="text-xs font-semibold text-[#7C3AED] tracking-wide uppercase">Get started</p>
                <h2 className="text-2xl font-bold tracking-tight text-white">Create your account</h2>
                <p className="text-sm text-white/60">
                    Join Studio X and start managing your projects efficiently.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {errors.root && (
                    <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
                        {errors.root.message}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">First name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                            <input
                                type="text"
                                placeholder="John"
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 pl-10 text-white placeholder:text-white/40 focus:border-[#2563EB]/50 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition-all duration-200"
                                {...register('first_name')}
                                disabled={isLoading}
                            />
                        </div>
                        {errors.first_name && (
                            <p className="text-sm text-red-400">{errors.first_name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Last name</label>
                        <input
                            type="text"
                            placeholder="Doe"
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-white placeholder:text-white/40 focus:border-[#2563EB]/50 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition-all duration-200"
                            {...register('last_name')}
                            disabled={isLoading}
                        />
                        {errors.last_name && (
                            <p className="text-sm text-red-400">{errors.last_name.message}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Email address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                        <input
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
                    <label className="text-sm font-medium text-white/80">Organization name</label>
                    <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                        <input
                            type="text"
                            placeholder="My Agency"
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 pl-10 text-white placeholder:text-white/40 focus:border-[#2563EB]/50 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition-all duration-200"
                            {...register('organization_name')}
                            disabled={isLoading}
                        />
                    </div>
                    {errors.organization_name && (
                        <p className="text-sm text-red-400">{errors.organization_name.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">
                        Organization slug <span className="text-white/40 text-xs">(URL-friendly name)</span>
                    </label>
                    <input
                        type="text"
                        placeholder="my-agency"
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-white placeholder:text-white/40 focus:border-[#2563EB]/50 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition-all duration-200"
                        {...register('organization_slug')}
                        disabled={isLoading}
                    />
                    <p className="text-xs text-white/40">Use lowercase letters, numbers, and hyphens only</p>
                    {errors.organization_slug && (
                        <p className="text-sm text-red-400">{errors.organization_slug.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create a strong password"
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
                    <p className="text-xs text-white/40">
                        Must be at least 8 characters with uppercase, lowercase, and a number
                    </p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Confirm password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm your password"
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 pl-10 pr-10 text-white placeholder:text-white/40 focus:border-[#2563EB]/50 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition-all duration-200"
                            {...register('confirmPassword')}
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                        >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-sm text-red-400">{errors.confirmPassword.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-lg bg-gradient-to-r from-[#2563EB] to-[#7C3AED] py-3 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                            Creating account...
                        </>
                    ) : (
                        'Create account'
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

<GoogleButton isLoading={isLoading} variant="inline" />

            <p className="text-center text-sm text-white/60">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-[#2563EB] hover:underline">
                    Sign in
                </Link>
            </p>
        </div>
    );
};

export default RegisterPage;