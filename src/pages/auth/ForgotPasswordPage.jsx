import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

import { forgotPasswordSchema } from '../../schemas/authSchema'
import { authService } from '../../services/authService'
import { ROUTES } from '../../config/routes'

import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    clearErrors()

    try {
      await authService.forgotPassword({
        email: data.email,
      })

      setSubmittedEmail(data.email)
      setIsSuccess(true)
      toast.success('Password reset email sent!')

    } catch (error) {
      if (error.message === 'User not found') {
        setSubmittedEmail(data.email)
        setIsSuccess(true)
        toast.success('If an account exists with this email, you will receive a reset link.')
      } else {
        toast.error(error.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleFieldChange = () => {
    if (errors.email) {
      clearErrors('email')
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

      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#7C3AED] tracking-wide uppercase">Reset password</p>
              <h2 className="text-2xl font-bold tracking-tight">Forgot your password?</h2>
              <p className="text-sm text-muted-foreground">
                Enter your email address and we'll send you a reset link
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
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    className="pl-9"
                    {...register('email')}
                    onChange={handleFieldChange}
                    disabled={isLoading}
                    aria-invalid={!!errors.email}
                    autoFocus
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
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
                    Sending reset link...
                  </>
                ) : (
                  'Send reset link'
                )}
              </Button>

              <Link
                to={ROUTES.LOGIN}
                className="flex items-center justify-center text-sm text-muted-foreground hover:text-white transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Link>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="rounded-full bg-green-500/10 p-4">
                  <CheckCircle className="h-12 w-12 text-green-400" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Check your email</h3>
                <p className="text-sm text-muted-foreground">
                  We've sent a password reset link to{' '}
                  <span className="font-medium text-white">{submittedEmail}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  The link will expire in 24 hours
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <Button
                variant="outline"
                className="w-full border-white/10 hover:bg-white/5"
                onClick={() => {
                  setIsSuccess(false)
                  setSubmittedEmail('')
                }}
              >
                Resend email
              </Button>

              <Link
                to={ROUTES.LOGIN}
                className="flex items-center justify-center text-sm text-muted-foreground hover:text-white transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ForgotPasswordPage