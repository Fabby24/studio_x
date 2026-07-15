import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, User, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { userService } from '../../services/userService';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';

const acceptInviteSchema = z.object({
    first_name: z.string().min(2, 'First name must be at least 2 characters').max(50),
    last_name: z.string().min(2, 'Last name must be at least 2 characters').max(50),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/\d/, 'Password must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

const AcceptInvitePage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const { login } = useAuthStore();
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isTokenValid, setIsTokenValid] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors,
    } = useForm({
        resolver: zodResolver(acceptInviteSchema),
        defaultValues: {
            first_name: '',
            last_name: '',
            password: '',
            confirmPassword: '',
        },
    });

    useEffect(() => {
        if (!token) {
            setIsTokenValid(false);
        }
    }, [token]);

    const onSubmit = async (data) => {
        if (!token) {
            setIsTokenValid(false);
            return;
        }

        setIsLoading(true);
        clearErrors();

        try {
            const user = await userService.acceptInvite({
                token,
                password: data.password,
                first_name: data.first_name,
                last_name: data.last_name,
            });

            // Auto-login after accepting invitation
            const result = await authService.login(user.email, data.password);
            login(result.user, result.token, result.organization);
            
            setIsSuccess(true);

            setTimeout(() => {
                const role = result.user.role;
                const dashboardRoute = role === 'org_admin' 
                    ? '/dashboard/admin' 
                    : '/dashboard/team';
                navigate(dashboardRoute, { replace: true });
            }, 2000);

        } catch (error) {
            const message = error.response?.data?.message || 'Invalid or expired invitation';
            if (message.includes('Invalid') || message.includes('expired')) {
                setIsTokenValid(false);
            } else {
                setError('root', { message });
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!isTokenValid) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0B132B] p-4">
                <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 shadow-2xl text-center max-w-md">
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-red-500/10 p-4">
                            <AlertCircle className="h-12 w-12 text-red-400" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Invalid Invitation</h2>
                    <p className="text-sm text-white/60 mt-2">
                        This invitation link is invalid or has expired.
                    </p>
                    <p className="text-sm text-white/40 mt-2">
                        Please contact your organization admin for a new invitation.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0B132B] p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED]">
                                <span className="text-xl font-bold text-white">SX</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">STUDIO X</h1>
                                <p className="text-[8px] text-white/40 tracking-[0.2em]">TRAFFIC MANAGEMENT</p>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-white">Accept Invitation</h2>
                        <p className="text-sm text-white/60 mt-1">
                            Create your account to join the organization
                        </p>
                    </div>

                    {!isSuccess ? (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {errors.root && (
                                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
                                    {errors.root.message}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/80">First Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                                        <input
                                            type="text"
                                            placeholder="John"
                                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 pl-10 text-white placeholder:text-white/40 focus:border-[#2563EB]/50 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                                            {...register('first_name')}
                                            disabled={isLoading}
                                        />
                                    </div>
                                    {errors.first_name && (
                                        <p className="text-sm text-red-400">{errors.first_name.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/80">Last Name</label>
                                    <input
                                        type="text"
                                        placeholder="Doe"
                                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-white placeholder:text-white/40 focus:border-[#2563EB]/50 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                                        {...register('last_name')}
                                        disabled={isLoading}
                                    />
                                    {errors.last_name && (
                                        <p className="text-sm text-red-400">{errors.last_name.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Create a strong password"
                                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 pl-10 pr-10 text-white placeholder:text-white/40 focus:border-[#2563EB]/50 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                                        {...register('password')}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
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
                                <label className="text-sm font-medium text-white/80">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Confirm your password"
                                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 pl-10 pr-10 text-white placeholder:text-white/40 focus:border-[#2563EB]/50 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                                        {...register('confirmPassword')}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
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
                                    'Accept Invitation'
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center space-y-4 py-8">
                            <div className="flex justify-center">
                                <div className="rounded-full bg-green-500/10 p-4">
                                    <CheckCircle className="h-12 w-12 text-green-400" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white">Welcome to Studio X!</h3>
                            <p className="text-sm text-white/60">
                                Your account has been created successfully.
                            </p>
                            <p className="text-xs text-white/40">
                                Redirecting to dashboard...
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default AcceptInvitePage;