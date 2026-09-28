import { z } from 'zod';

export const createRoleSchema = z.object({
  title: z
    .string({ error: 'Role name is required' })
    .trim()
    .min(1, 'Role name cannot be empty')
    .max(255, 'Role name cannot be more than 255 characters'),
  permissions: z.array(z.string()).min(1, 'Select at least one permission'),
});

export type CreateRoleFormValues = z.infer<typeof createRoleSchema>;

export const updateRoleSchema = z.object({
  title: z
    .string({ error: 'Role name is required' })
    .trim()
    .min(1, 'Role name cannot be empty')
    .max(255, 'Role name cannot be more than 255 characters'),
  permissions: z.array(z.string()).min(1, 'Select at least one permission'),
});

export type UpdateRoleFormValues = z.infer<typeof updateRoleSchema>;