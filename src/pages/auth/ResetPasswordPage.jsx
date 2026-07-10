import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Lock, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { authService } from '../../services/authService';

const resetPasswordSchema = z.object({
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

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

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
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
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
            await authService.resetPassword(token, data.password);
            setIsSuccess(true);

            setTimeout(() => {
                navigate('/login', {
                    state: { message: 'Password reset successful! Please login with your new password.' }
                });
            }, 3000);

        } catch (error) {
            const message = error.response?.data?.message || 'Invalid or expired reset token';
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
            <div className="w-full text-center space-y-4 py-8">
                <div className="flex justify-center">
                    <div className="rounded-full bg-red-500/10 p-4">
                        <AlertCircle className="h-12 w-12 text-red-400" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-white">Invalid Reset Link</h2>
                <p className="text-sm text-white/60">
                    This password reset link is invalid or has expired.
                </p>
                <Link
                    to="/forgot-password"
                    className="inline-block text-[#2563EB] hover:underline"
                >
                    Request a new reset link
                </Link>
            </div>
        );
    }

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

            {!isSuccess ? (
                <>
                    <div className="space-y-2">
                        <p className="text-xs font-semibold text-[#7C3AED] tracking-wide uppercase">Reset password</p>
                        <h2 className="text-2xl font-bold tracking-tight text-white">Create new password</h2>
                        <p className="text-sm text-white/60">
                            Enter your new password below
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {errors.root && (
                            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
                                {errors.root.message}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">New password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter new password"
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 pl-10 pr-10 text-white placeholder:text-white/40 focus:border-[#2563EB]/50 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition-all duration-200"
                                    {...register('password')}
                                    disabled={isLoading}
                                    autoFocus
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
                            <label className="text-sm font-medium text-white/80">Confirm new password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm your new password"
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
                                    Resetting...
                                </>
                            ) : (
                                'Reset password'
                            )}
                        </button>

                        <Link
                            to="/login"
                            className="flex items-center justify-center text-sm text-white/60 hover:text-white transition-colors"
                        >
                            Back to login
                        </Link>
                    </form>
                </>
            ) : (
                <div className="text-center space-y-4 py-8">
                    <div className="flex justify-center">
                        <div className="rounded-full bg-green-500/10 p-4">
                            <CheckCircle className="h-12 w-12 text-green-400" />
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-white">Password reset successful!</h3>
                    <p className="text-sm text-white/60">
                        Your password has been updated successfully.
                    </p>
                    <p className="text-xs text-white/40">
                        Redirecting to login...
                    </p>
                    <Link
                        to="/login"
                        className="inline-block text-[#2563EB] hover:underline"
                    >
                        Go to login
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ResetPasswordPage;