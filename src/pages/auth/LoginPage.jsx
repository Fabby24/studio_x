import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

import { loginSchema } from '../../schemas/authSchema'
import { authService } from '../../services/authService'
import { useAuthStore } from '../../store/authStore'
import { ROUTES } from '../../config/routes'

import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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
      await authService.login({
        email: data.email,
        password: data.password,
      })

      toast.success('Welcome back! Redirecting to dashboard...')

      setTimeout(() => {
        const store = useAuthStore.getState()
        const userRole = store.user?.role
        const dashboardRoute = userRole === 'admin'
          ? ROUTES.ADMIN_DASHBOARD
          : ROUTES.TEAM_DASHBOARD
        navigate(dashboardRoute, { replace: true })
      }, 1000)

    } catch (error) {
      if (error.response?.status === 401) {
        setError('root', {
          message: 'Invalid email or password. Please try again.',
        })
      } else if (error.message === 'Account is inactive. Please contact admin.') {
        setError('root', {
          message: 'Your account is inactive. Please contact the administrator.',
        })
      } else {
        toast.error(error.message || 'Login failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = () => {
    if (errors.root) {
      clearErrors('root')
    }
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

      {/* Header */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-[#7C3AED] tracking-wide uppercase">Welcome back</p>
        <h2 className="text-2xl font-bold tracking-tight">Sign in to your account</h2>
        <p className="text-sm text-muted-foreground">
          Access your projects, tasks and team in one place.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errors.root && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive"
          >
            {errors.root.message}
          </motion.div>
        )}

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
              onChange={handleInputChange}
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-sm text-[#2563EB] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className="pl-9 pr-10"
              {...register('password')}
              onChange={handleInputChange}
              disabled={isLoading}
              aria-invalid={!!errors.password}
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
        </div>

        {/* Remember me */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="rememberMe"
            className="h-4 w-4 rounded border-border text-[#2563EB] focus:ring-[#2563EB]"
            {...register('rememberMe')}
            disabled={isLoading}
          />
          <Label htmlFor="rememberMe" className="text-sm font-normal cursor-pointer">
            Remember me
          </Label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:opacity-90 transition-opacity"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* Sign up link */}
      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link
          to={ROUTES.REGISTER}
          className="font-medium text-[#2563EB] hover:underline"
        >
          Create account
        </Link>
      </p>
    </div>
  )
}

export default LoginPage