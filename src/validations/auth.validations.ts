import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({
      error: (issue) => {
        if (issue.input === undefined) return 'Email is required';
        if (issue.code === 'invalid_type') return 'Email must be a string';
        return 'Invalid email';
      },
    })
    .trim()
    .max(250, 'Email cannot be longer than 250 characters')
    .check(
      z.email({
        error: (issue) => {
          if (issue.code === 'invalid_format') {
            return 'Please provide a valid email address';
          }
        },
      }),
    ),
  password: z
    .string({
      error: (issue) => {
        if (issue.input === undefined) return 'Password is required';
        if (issue.code === 'invalid_type') return 'Password must be a string';
        return 'Invalid password';
      },
    })
    .min(8, 'Password must be at least 8 characters long')
    .max(128, 'Password cannot be longer than 128 characters'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const sendResetOtpSchema = z.object({
  email: z
    .string({
      error: (issue) => {
        if (issue.input === undefined) return 'Email is required';
        if (issue.code === 'invalid_type') return 'Email must be a string';
        return 'Invalid email';
      },
    })
    .trim()
    .max(250, 'Email cannot be longer than 250 characters')
    .check(
      z.email({
        error: (issue) => {
          if (issue.code === 'invalid_format') {
            return 'Please provide a valid email address';
          }
        },
      }),
    ),
});

export type SendResetOtpFormValues = z.infer<typeof sendResetOtpSchema>;

const strongPassword = z
  .string({
    error: (issue) => {
      if (issue.input === undefined) return 'Password is required';
      if (issue.code === 'invalid_type') return 'Password must be a string';
      return 'Invalid password';
    },
  })
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password cannot be longer than 128 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  );

export const resetPasswordSchema = z
  .object({
    email: z
      .string({
        error: (issue) => {
          if (issue.input === undefined) return 'Email is required';
          if (issue.code === 'invalid_type') return 'Email must be a string';
          return 'Invalid email';
        },
      })
      .trim()
      .max(250, 'Email cannot be longer than 250 characters')
      .check(
        z.email({
          error: (issue) => {
            if (issue.code === 'invalid_format') {
              return 'Please provide a valid email address';
            }
          },
        }),
      ),
    otp: z
      .string({
        error: (issue) => {
          if (issue.input === undefined) return 'OTP is required';
          if (issue.code === 'invalid_type') return 'OTP must be a string';
          return 'Invalid OTP';
        },
      })
      .trim()
      .min(6, 'OTP must be at least 6 characters long')
      .max(6, 'OTP cannot be longer than 6 characters')
      .regex(/^[0-9]{6}$/, 'OTP must be a 6 digit number'),
    newPassword: strongPassword,
    confirmNewPassword: z
      .string({
        error: (issue) => {
          if (issue.input === undefined) return 'Confirm password is required';
          if (issue.code === 'invalid_type') return 'Confirm password must be a string';
          return 'Invalid confirm password';
        },
      })
      .min(8, 'Confirm password must be at least 8 characters long')
      .max(128, 'Confirm password cannot be longer than 128 characters'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'New password and confirm new password do not match',
    path: ['confirmNewPassword'],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z
  .object({
    oldPassword: z
      .string({
        error: (issue) => {
          if (issue.input === undefined) return 'Current password is required';
          if (issue.code === 'invalid_type') return 'Password must be a string';
          return 'Invalid password';
        },
      })
      .min(8, 'Password must be at least 8 characters long')
      .max(128, 'Password cannot be longer than 128 characters'),
    newPassword: strongPassword,
    confirmNewPassword: z
      .string({
        error: (issue) => {
          if (issue.input === undefined) return 'Confirm password is required';
          if (issue.code === 'invalid_type') return 'Confirm password must be a string';
          return 'Invalid confirm password';
        },
      })
      .min(8, 'Confirm password must be at least 8 characters long')
      .max(128, 'Confirm password cannot be longer than 128 characters'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'New password and confirm new password do not match',
    path: ['confirmNewPassword'],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export const otpOnlySchema = z.object({
  otp: z
    .string({
      error: (issue) => {
        if (issue.input === undefined) return 'OTP is required';
        if (issue.code === 'invalid_type') return 'OTP must be a string';
        return 'Invalid OTP';
      },
    })
    .trim()
    .min(6, 'OTP must be at least 6 characters long')
    .max(6, 'OTP cannot be longer than 6 characters')
    .regex(/^[0-9]{6}$/, 'OTP must be a 6 digit number'),
});

export type OtpOnlyFormValues = z.infer<typeof otpOnlySchema>;