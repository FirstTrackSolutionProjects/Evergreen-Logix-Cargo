import { cn } from '@/utils/cn';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  rounded?: boolean;
}

export function Skeleton({ width, height, className, rounded = true }: SkeletonProps) {
  return (
    <span
      className={cn(styles.skeleton, rounded && styles.rounded, className)}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}