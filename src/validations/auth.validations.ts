import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({ error: 'Email is required' })
    .trim()
    .min(1, 'Email is required')
    .max(250, 'Email cannot be longer than 250 characters')
    .email('Please provide a valid email address'),
  password: z
    .string({ error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters long')
    .max(128, 'Password cannot be longer than 128 characters'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const sendResetOtpSchema = z.object({
  email: z
    .string({ error: 'Email is required' })
    .trim()
    .min(1, 'Email is required')
    .max(250, 'Email cannot be longer than 250 characters')
    .email('Please provide a valid email address'),
});

export type SendResetOtpFormValues = z.infer<typeof sendResetOtpSchema>;

const strongPassword = z
  .string({ error: 'Password is required' })
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password cannot be longer than 128 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  );

export const resetPasswordSchema = z
  .object({
    email: z
      .string({ error: 'Email is required' })
      .trim()
      .min(1, 'Email is required')
      .email('Please provide a valid email address'),
    otp: z
      .string({ error: 'OTP is required' })
      .trim()
      .length(6, 'OTP must be 6 digits')
      .regex(/^[0-9]{6}$/, 'OTP must be a 6 digit number'),
    newPassword: strongPassword,
    confirmNewPassword: z
      .string({ error: 'Confirm password is required' })
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
      .string({ error: 'Current password is required' })
      .min(8, 'Password must be at least 8 characters long')
      .max(128, 'Password cannot be longer than 128 characters'),
    newPassword: strongPassword,
    confirmNewPassword: z
      .string({ error: 'Confirm password is required' })
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
    .string({ error: 'OTP is required' })
    .trim()
    .length(6, 'OTP must be 6 digits')
    .regex(/^[0-9]{6}$/, 'OTP must be a 6 digit number'),
});

export type OtpOnlyFormValues = z.infer<typeof otpOnlySchema>;