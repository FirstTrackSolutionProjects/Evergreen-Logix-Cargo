import { z } from 'zod';

export const createRoleSchema = z.object({
  title: z
    .string({
      error: (issue) => {
        if (issue.input === undefined) return 'Role name is required';
        if (issue.code === 'invalid_type') return 'Role name must be a string';
        return 'Invalid role name';
      },
    })
    .trim()
    .min(1, 'Role name cannot be empty')
    .max(255, 'Role name cannot be more than 255 characters'),
  permissions: z
    .array(
      z
        .string({
          error: (issue) => {
            if (issue.code === 'invalid_type') return 'Permission must be a string';
            return 'Invalid permission';
          },
        })
        .trim()
        .max(50, 'Permission must not be more than 50 characters'),
    )
    .min(1, 'Select at least one permission'),
});

export type CreateRoleFormValues = z.infer<typeof createRoleSchema>;

export const updateRoleSchema = z.object({
  title: z
    .string({
      error: (issue) => {
        if (issue.input === undefined) return 'Role name is required';
        if (issue.code === 'invalid_type') return 'Role name must be a string';
        return 'Invalid role name';
      },
    })
    .trim()
    .min(1, 'Role name cannot be empty')
    .max(255, 'Role name cannot be more than 255 characters'),
  permissions: z
    .array(
      z
        .string({
          error: (issue) => {
            if (issue.code === 'invalid_type') return 'Permission must be a string';
            return 'Invalid permission';
          },
        })
        .trim()
        .max(50, 'Permission must not be more than 50 characters'),
    )
    .min(1, 'Select at least one permission'),
});

export type UpdateRoleFormValues = z.infer<typeof updateRoleSchema>;