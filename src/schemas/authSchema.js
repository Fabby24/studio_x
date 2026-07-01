import { z } from 'zod'

// Password validation rules
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')

// Login schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

// Register schema
export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, 'First name is required')
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name must be less than 50 characters')
      .regex(/^[a-zA-Z\s\-']+$/, 'First name contains invalid characters'),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name must be less than 50 characters')
      .regex(/^[a-zA-Z\s\-']+$/, 'Last name contains invalid characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
})

// Reset password schema
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

// Update profile schema
export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s\-']+$/, 'First name contains invalid characters')
    .optional(),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s\-']+$/, 'Last name contains invalid characters')
    .optional(),
})

// Change password schema
export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmNewPassword: z
      .string()
      .min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ['confirmNewPassword'],
  })