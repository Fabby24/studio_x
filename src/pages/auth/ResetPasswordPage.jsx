import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

import { resetPasswordSchema } from '../../schemas/authSchema'
import { authService } from '../../services/authService'
import { ROUTES } from '../../config/routes'

import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'

const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isTokenValid, setIsTokenValid] = useState(true)

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
  })

  useEffect(() => {
    if (!token) {
      setIsTokenValid(false)
      toast.error('Invalid or missing reset token')
    }
  }, [token])

  const onSubmit = async (data) => {
    if (!token) {
      toast.error('Invalid reset token')
      return
    }

    setIsLoading(true)
    clearErrors()

    try {
      await authService.resetPassword({
        token: token,
        new_password: data.password,
      })

      setIsSuccess(true)
      toast.success('Password reset successful!')

      setTimeout(() => {
        navigate(ROUTES.LOGIN, { 
          state: { message: 'Password reset successful. Please login with your new password.' }
        })
      }, 3000)

    } catch (error) {
      if (error.message === 'Invalid or expired token') {
        setError('root', {
          message: 'This reset link is invalid or has expired. Please request a new one.',
        })
        setIsTokenValid(false)
      } else {
        toast.error(error.message || 'Password reset failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleFieldChange = (field) => {
    if (errors[field]) {
      clearErrors(field)
    }
  }

  if (!isTokenValid) {
    return (
      <div className="w-full max-w-md space-y-8 font-poppins">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-destructive/10 p-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Invalid Reset Link</h3>
            <p className="text-sm text-muted-foreground">
              This password reset link is invalid or has expired
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Link to={ROUTES.FORGOT_PASSWORD}>
            <Button className="w-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:opacity-90 transition-opacity">
              Request new reset link
            </Button>
          </Link>
          <Link
            to={ROUTES.LOGIN}
            className="flex items-center justify-center text-sm text-muted-foreground hover:text-white transition-colors"
          >
            Back to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md space-y-8 font-poppins">
      {/* Mobile Logo */}
      <div className="lg:hidden text-center">
        <div className="flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED]">
            <span className="text-xl font-bold text-white">SX</span>
          </div>
          <div className="text-left">
            <h1 className="text-xl font-bold tracking-tight">STUDIO X</h1>
            <p className="text-[8px] text-muted-foreground tracking-wider">TRAFFIC MANAGEMENT</p>
          </div>
        </div>
      </div>

      {!isSuccess ? (
        <div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#7C3AED] tracking-wide uppercase">Reset password</p>
            <h2 className="text-2xl font-bold tracking-tight">Create new password</h2>
            <p className="text-sm text-muted-foreground">
              Enter your new password below
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            {errors.root && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive"
              >
                {errors.root.message}
              </motion.div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  className="pl-9 pr-10"
                  {...register('password')}
                  onChange={() => handleFieldChange('password')}
                  disabled={isLoading}
                  aria-invalid={!!errors.password}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters with uppercase, lowercase, and a number
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm new password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your new password"
                  className="pl-9 pr-10"
                  {...register('confirmPassword')}
                  onChange={() => handleFieldChange('confirmPassword')}
                  disabled={isLoading}
                  aria-invalid={!!errors.confirmPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting password...
                </>
              ) : (
                'Reset password'
              )}
            </Button>

            <Link
              to={ROUTES.LOGIN}
              className="flex items-center justify-center text-sm text-muted-foreground hover:text-white transition-colors"
            >
              Back to login
            </Link>
          </form>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-500/10 p-4">
              <CheckCircle className="h-12 w-12 text-green-400" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Password reset successful!</h3>
            <p className="text-sm text-muted-foreground">
              Your password has been updated successfully.
            </p>
            <p className="text-xs text-muted-foreground">
              Redirecting to login page...
            </p>
          </div>

          <Link to={ROUTES.LOGIN}>
            <Button className="w-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:opacity-90 transition-opacity">
              Go to login
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default ResetPasswordPage