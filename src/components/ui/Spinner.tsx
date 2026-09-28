import styles from './Spinner.module.css';
import { cn } from '@/utils/cn';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return <span className={cn(styles.spinner, styles[size], className)} role="status" aria-label="Loading" />;
}