import { z } from 'zod'

// Create user schema
export const createUserSchema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s\-']+$/, 'First name contains invalid characters'),
  
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s\-']+$/, 'Last name contains invalid characters'),
  
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .optional(),
  
  role: z
    .enum(['admin', 'team_member'], {
      required_error: 'Role is required',
    }),
  
  status: z
    .enum(['active', 'inactive'])
    .default('active'),
})

// Update user schema
export const updateUserSchema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s\-']+$/, 'First name contains invalid characters'),
  
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s\-']+$/, 'Last name contains invalid characters'),
  
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  
  role: z
    .enum(['admin', 'team_member'], {
      required_error: 'Role is required',
    }),
  
  status: z
    .enum(['active', 'inactive'])
    .default('active'),
})

// Invite user schema
export const inviteUserSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  
  role: z
    .enum(['admin', 'team_member'], {
      required_error: 'Role is required',
    }),
})

// Bulk action schema
export const bulkActionSchema = z.object({
  userIds: z
    .array(z.number())
    .min(1, 'Select at least one user'),
  
  action: z
    .enum(['activate', 'deactivate', 'delete'], {
      required_error: 'Action is required',
    }),
})