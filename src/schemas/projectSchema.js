import { z } from 'zod';
import {
    PROJECT_STATUS,
    PROJECT_PRIORITY,
    PROJECT_TYPE,
    DEPARTMENT,
    HEALTH_STATUS,
} from '../config/projectConstants';

// Available options for dropdowns
export const projectStatusOptions = Object.values(PROJECT_STATUS);
export const projectPriorityOptions = Object.values(PROJECT_PRIORITY);
export const projectTypeOptions = Object.values(PROJECT_TYPE);
export const departmentOptions = Object.values(DEPARTMENT);
export const healthStatusOptions = Object.values(HEALTH_STATUS);

// Create project schema
export const createProjectSchema = z.object({
    name: z
        .string()
        .min(2, 'Project name must be at least 2 characters')
        .max(200, 'Project name must be less than 200 characters'),

    client_id: z
        .string()
        .nullable()
        .optional(),

    description: z
        .string()
        .max(5000, 'Description must be less than 5000 characters')
        .optional(),

    status: z
        .enum(projectStatusOptions)
        .default(PROJECT_STATUS.PLANNING),

    priority: z
        .enum(projectPriorityOptions)
        .default(PROJECT_PRIORITY.MEDIUM),

    project_type: z
        .enum(projectTypeOptions)
        .default(PROJECT_TYPE.WEB_DESIGN),

    department: z
        .enum(departmentOptions)
        .default(DEPARTMENT.DESIGN),

    health_status: z
        .enum(healthStatusOptions)
        .default(HEALTH_STATUS.ON_TRACK),

    start_date: z
        .string()
        .nullable()
        .optional(),

    due_date: z
        .string()
        .nullable()
        .optional(),

    delivery_date: z
        .string()
        .nullable()
        .optional(),

    estimated_hours: z
        .number()
        .min(0, 'Estimated hours must be positive')
        .nullable()
        .optional(),

    budget: z
        .number()
        .min(0, 'Budget must be positive')
        .nullable()
        .optional(),

    color: z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format')
        .default('#2563EB'),

    billable: z
        .boolean()
        .default(true),

    is_internal: z
        .boolean()
        .default(false),

    project_notes: z
        .string()
        .optional(),

    manager_id: z
        .string()
        .nullable()
        .optional(),

    team_member_ids: z
        .array(z.string())
        .default([]),
});

// Update project schema
export const updateProjectSchema = createProjectSchema.partial().extend({
    completion_percentage: z
        .number()
        .min(0, 'Completion must be at least 0%')
        .max(100, 'Completion must be at most 100%')
        .optional(),
});

// Bulk action schema
export const bulkActionSchema = z.object({
    projectIds: z
        .array(z.string())
        .min(1, 'Select at least one project'),
    action: z
        .enum(['archive', 'delete'], {
            required_error: 'Action is required',
        }),
});