import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import styles from './Badge.module.css';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
  dot?: boolean;
}

export function Badge({ variant = 'neutral', children, className, dot = false }: BadgeProps) {
  return (
    <span className={cn(styles.badge, styles[variant], className)}>
      {dot && <span className={styles.dot} />}
      {children}
    </span>
  );
}