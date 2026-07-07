import { z } from 'zod'

// Available options
export const INDUSTRIES = [
    'Technology',
    'Media',
    'Finance',
    'Healthcare',
    'Retail',
    'Manufacturing',
    'Education',
    'Nonprofit',
    'Government',
    'Real Estate',
    'Hospitality',
    'Food & Beverage',
    'Fashion',
    'Automotive',
    'Aerospace',
    'Energy',
    'Telecommunications',
    'Consulting',
    'Marketing',
    'Other'
]

export const PRIORITIES = ['low', 'medium', 'high']
export const CONTACT_METHODS = ['email', 'phone', 'whatsapp', 'teams', 'slack']
export const CLIENT_TAGS = ['VIP', 'Retainer', 'One-time', 'High Priority', 'Marketing', 'Branding', 'Internal']

// Create client schema
export const createClientSchema = z.object({
    name: z
        .string()
        .min(1, 'Client name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters'),
    
    company: z
        .string()
        .max(100, 'Company name must be less than 100 characters')
        .optional(),
    
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    
    phone: z
        .string()
        .max(20, 'Phone number must be less than 20 characters')
        .optional(),
    
    website: z
        .string()
        .url('Please enter a valid URL')
        .optional()
        .or(z.literal('')),
    
    industry: z
        .string()
        .optional(),
    
    logo: z
        .string()
        .optional(),
    
    tags: z
        .array(z.string())
        .default([]),
    
    status: z
        .enum(['active', 'inactive'])
        .default('active'),
    
    priority: z
        .enum(['low', 'medium', 'high'])
        .default('medium'),
    
    preferred_contact: z
        .enum(['email', 'phone', 'whatsapp', 'teams', 'slack'])
        .default('email'),
    
    timezone: z
        .string()
        .default('UTC'),
    
    notes: z
        .string()
        .optional(),
    
    billing_contact: z
        .string()
        .max(100, 'Billing contact must be less than 100 characters')
        .optional(),
    
    payment_terms: z
        .string()
        .max(50, 'Payment terms must be less than 50 characters')
        .optional(),
    
    currency: z
        .string()
        .default('USD'),
    
    tax_number: z
        .string()
        .max(50, 'Tax number must be less than 50 characters')
        .optional(),
    
    assigned_to: z
        .union([
            z.string().optional(),
            z.number().optional(),
            z.null()
        ])
        .default(null)
        .transform((val) => {
            // If it's a string, try to convert to number or null
            if (val === '' || val === null || val === undefined) return null;
            if (typeof val === 'string') {
                const num = parseInt(val);
                return isNaN(num) ? null : num;
            }
            return val;
        }),
})

// Update client schema
export const updateClientSchema = createClientSchema.partial().extend({
    name: z
        .string()
        .min(1, 'Client name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters')
        .optional(),
    
    company: z
        .string()
        .max(100, 'Company name must be less than 100 characters')
        .optional()
        .default(''),
    
    email: z
        .string()
        .email('Please enter a valid email address')
        .optional(),
    
    phone: z
        .string()
        .max(20, 'Phone number must be less than 20 characters')
        .optional()
        .default(''),
    
    website: z
        .string()
        .url('Please enter a valid URL')
        .optional()
        .or(z.literal(''))
        .default(''),
    
    industry: z
        .string()
        .optional()
        .default(''),
    
    logo: z
        .string()
        .optional()
        .nullable(),
    
    tags: z
        .array(z.string())
        .default([]),
    
    status: z
        .enum(['active', 'inactive'])
        .default('active'),
    
    priority: z
        .enum(['low', 'medium', 'high'])
        .default('medium'),
    
    preferred_contact: z
        .enum(['email', 'phone', 'whatsapp', 'teams', 'slack'])
        .default('email'),
    
    timezone: z
        .string()
        .default('UTC'),
    
    notes: z
        .string()
        .optional()
        .default(''),
    
    billing_contact: z
        .string()
        .max(100, 'Billing contact must be less than 100 characters')
        .optional()
        .default(''),
    
    payment_terms: z
        .string()
        .max(50, 'Payment terms must be less than 50 characters')
        .optional()
        .default(''),
    
    currency: z
        .string()
        .default('USD'),
    
    tax_number: z
        .string()
        .max(50, 'Tax number must be less than 50 characters')
        .optional()
        .default(''),
        
    assigned_to: z
        .union([
            z.string().optional(),
            z.number().optional(),
            z.null()
        ])
        .default(null)
        .transform((val) => {
            if (val === '' || val === null || val === undefined) return null;
            if (typeof val === 'string') {
                const num = parseInt(val);
                return isNaN(num) ? null : num;
            }
            return val;
        }),
})

// Bulk action schema
export const bulkActionSchema = z.object({
    ids: z
        .array(z.number())
        .min(1, 'Select at least one client'),
    action: z
        .enum(['activate', 'deactivate', 'archive', 'delete'], {
            required_error: 'Action is required',
        }),
})