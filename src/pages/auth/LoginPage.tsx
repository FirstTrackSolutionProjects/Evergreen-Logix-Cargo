import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/useAuth';
import { loginSchema } from '@/validations/auth.validations';
import type { LoginFormValues } from '@/validations/auth.validations';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import styles from './LoginPage.module.css';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      await login(values);
      toast.success('Welcome back!');
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.brandPanel}>
        <div className={styles.brandContent}>
          <div className={styles.brandMark} />
          <h1 className={styles.brandTitle}>
            Evergreen <span className={styles.brandAccent}>Logix Cargo</span>
          </h1>
          <p className={styles.brandTagline}>
            Manage your courier operations — shipments, delivery partners, and logistics in one place.
          </p>
          <div className={styles.brandFeatures}>
            <div className={styles.feature}>
              <span className={styles.featureDot} />
              Real-time shipment tracking
            </div>
            <div className={styles.feature}>
              <span className={styles.featureDot} />
              Bulk upload via Excel
            </div>
            <div className={styles.feature}>
              <span className={styles.featureDot} />
              Complete role-based access control
            </div>
          </div>
        </div>
      </div>

      <div className={styles.formPanel}>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Welcome back</h2>
            <p className={styles.formSubtitle}>Sign in to your admin account</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
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

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              leftIcon={<Lock size={16} />}
              error={errors.password?.message}
              requiredMark
              togglePassword
              {...register('password')}
            />

            <div className={styles.formExtras}>
              <Link to={ROUTES.VERIFY_OTP} className={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              rightIcon={<ArrowRight size={16} />}
            >
              Sign In
            </Button>
          </form>

          <p className={styles.footerNote}>
            Protected by Evergreen Logix Cargo. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}