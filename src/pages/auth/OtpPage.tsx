import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { KeyRound, Mail, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { authApi } from '@/api/auth.api';
import { resetPasswordSchema } from '@/validations/auth.validations';
import type { ResetPasswordFormValues } from '@/validations/auth.validations';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import styles from './OtpPage.module.css';

export function OtpPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
      otp: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const emailValue = watch('email');

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSendOtp = async () => {
    const email = getValues('email');
    if (!email) {
      toast.error('Enter your email first');
      return;
    }
    setIsSendingOtp(true);
    try {
      await authApi.sendResetPasswordOtp({ email });
      toast.success('OTP sent to your email');
      setResendTimer(60);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send OTP');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setIsLoading(true);
    try {
      await authApi.resetPassword(values);
      toast.success('Password reset successfully');
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Password reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <ShieldCheck size={28} />
        </div>

        <div className={styles.header}>
          <h1 className={styles.title}>Verify & Reset Password</h1>
          <p className={styles.subtitle}>
            Enter your email, request an OTP, then set a new password.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={styles.emailRow}>
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              leftIcon={<Mail size={16} />}
              error={errors.email?.message}
              requiredMark
              {...register('email')}
            />
            <Button
              type="button"
              variant="outline"
              size="md"
              isLoading={isSendingOtp}
              onClick={handleSendOtp}
              disabled={!emailValue || resendTimer > 0}
              className={styles.sendButton}
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Send OTP'}
            </Button>
          </div>

          <Input
            label="OTP Code"
            type="text"
            placeholder="6-digit code"
            inputMode="numeric"
            maxLength={6}
            leftIcon={<KeyRound size={16} />}
            error={errors.otp?.message}
            requiredMark
            {...register('otp')}
          />

          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
            autoComplete="new-password"
            error={errors.newPassword?.message}
            requiredMark
            {...register('newPassword')}
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Confirm new password"
            autoComplete="new-password"
            error={errors.confirmNewPassword?.message}
            requiredMark
            {...register('confirmNewPassword')}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            rightIcon={<ArrowRight size={16} />}
          >
            Reset Password
          </Button>
        </form>

        <Link to={ROUTES.LOGIN} className={styles.backLink}>
          <ArrowLeft size={14} />
          Back to Login
        </Link>
      </div>
    </div>
  );
}