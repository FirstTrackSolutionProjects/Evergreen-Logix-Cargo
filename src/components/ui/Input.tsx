import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  requiredMark?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, requiredMark, className, id, ...rest }, ref) => {
    const inputId = id || rest.name;

    return (
      <div className={cn(styles.wrapper, className)}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
            {requiredMark && <span className={styles.required}>*</span>}
          </label>
        )}
        <div className={cn(styles.field, error && styles.fieldError, rest.disabled && styles.fieldDisabled)}>
          {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
          <input ref={ref} id={inputId} className={styles.input} {...rest} />
          {rightIcon && <span className={styles.icon}>{rightIcon}</span>}
        </div>
        {error ? (
          <span className={styles.errorText}>{error}</span>
        ) : hint ? (
          <span className={styles.hintText}>{hint}</span>
        ) : null}
      </div>
    );
  },
);

Input.displayName = 'Input';