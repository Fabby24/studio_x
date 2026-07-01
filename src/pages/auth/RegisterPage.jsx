import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

import { registerSchema } from '../../schemas/authSchema'
import { authService } from '../../services/authService'
import { useAuthStore } from '../../store/authStore'
import { ROUTES } from '../../config/routes'

import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardRoute = user.role === 'admin'
        ? ROUTES.ADMIN_DASHBOARD
        : ROUTES.TEAM_DASHBOARD
      navigate(dashboardRoute, { replace: true })
    }
  }, [isAuthenticated, user, navigate])

  const onSubmit = async (data) => {
    setIsLoading(true)
    clearErrors()

    try {
      await authService.register({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password: data.password,
      })

      toast.success('Account created successfully! Redirecting to dashboard...')

      setTimeout(() => {
        const store = useAuthStore.getState()
        const userRole = store.user?.role
        const dashboardRoute = userRole === 'admin'
          ? ROUTES.ADMIN_DASHBOARD
          : ROUTES.TEAM_DASHBOARD
        navigate(dashboardRoute, { replace: true })
      }, 1000)

    } catch (error) {
      if (error.message === 'Email already registered') {
        setError('email', {
          message: 'This email is already registered. Please login or use a different email.',
        })
      } else {
        toast.error(error.message || 'Registration failed. Please try again.')
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

  return (
    <div className="w-full max-w-md space-y-6 font-poppins">
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

      {/* Header */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-[#7C3AED] tracking-wide uppercase">Get started</p>
        <h2 className="text-2xl font-bold tracking-tight">Create your account</h2>
        <p className="text-sm text-muted-foreground">
          Join Studio X and start managing your projects efficiently.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Root error message */}
        {errors.root && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive"
          >
            {errors.root.message}
          </motion.div>
        )}

        {/* First Name & Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="firstName"
                type="text"
                placeholder="John"
                className="pl-9"
                {...register('firstName')}
                onChange={() => handleFieldChange('firstName')}
                disabled={isLoading}
                aria-invalid={!!errors.firstName}
              />
            </div>
            {errors.firstName && (
              <p className="text-sm text-destructive">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Doe"
              {...register('lastName')}
              onChange={() => handleFieldChange('lastName')}
              disabled={isLoading}
              aria-invalid={!!errors.lastName}
            />
            {errors.lastName && (
              <p className="text-sm text-destructive">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Email field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="name@company.com"
              className="pl-9"
              {...register('email')}
              onChange={() => handleFieldChange('email')}
              disabled={isLoading}
              aria-invalid={!!errors.email}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Password field */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              className="pl-9 pr-10"
              {...register('password')}
              onChange={() => handleFieldChange('password')}
              disabled={isLoading}
              aria-invalid={!!errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Must be at least 8 characters with uppercase, lowercase, and a number
          </p>
        </div>

        {/* Confirm Password field */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
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
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
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
              Creating account...
            </>
          ) : (
            <>
              Create account
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* Sign in link */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link
          to={ROUTES.LOGIN}
          className="font-medium text-[#2563EB] hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default RegisterPage