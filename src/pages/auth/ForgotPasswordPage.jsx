import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { authService } from '../../services/authService';

const forgotPasswordSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
});

const ForgotPasswordPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        clearErrors,
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: '' },
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        clearErrors();

        try {
            await authService.forgotPassword(data.email);
            setIsSuccess(true);
        } catch (error) {
            // Error handled in service
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

            {!isSuccess ? (
                <>
                    <div className="space-y-2">
                        <p className="text-xs font-semibold text-[#7C3AED] tracking-wide uppercase">Reset password</p>
                        <h2 className="text-2xl font-bold tracking-tight text-white">Forgot your password?</h2>
                        <p className="text-sm text-white/60">
                            Enter your email address and we'll send you a reset link
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-lg bg-gradient-to-r from-[#2563EB] to-[#7C3AED] py-3 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                'Send reset link'
                            )}
                        </button>

                        <Link
                            to="/login"
                            className="flex items-center justify-center text-sm text-white/60 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
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
                    <h3 className="text-xl font-bold text-white">Check your email</h3>
                    <p className="text-sm text-white/60">
                        If an account exists with this email, you will receive a password reset link.
                    </p>
                    <Link
                        to="/login"
                        className="flex items-center justify-center text-sm text-[#2563EB] hover:underline"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to login
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ForgotPasswordPage;