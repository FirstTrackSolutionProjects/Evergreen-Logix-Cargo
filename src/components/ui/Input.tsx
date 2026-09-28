import { forwardRef, useState } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/utils/cn';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  requiredMark?: boolean;
  /**
   * When true, renders a show/hide toggle at the right side of the field
   * and toggles the input's `type` between "password" and "text".
   */
  togglePassword?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      requiredMark,
      togglePassword = false,
      type,
      className,
      id,
      ...rest
    },
    ref,
  ) => {
    const inputId = id || rest.name;
    const [isRevealed, setIsRevealed] = useState(false);

    const resolvedType = togglePassword
      ? isRevealed
        ? 'text'
        : 'password'
      : type;

    const trailingIcon = togglePassword ? (
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setIsRevealed((v) => !v)}
        aria-label={isRevealed ? 'Hide password' : 'Show password'}
        aria-pressed={isRevealed}
        tabIndex={-1}
      >
        {isRevealed ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    ) : (
      rightIcon && <span className={styles.icon}>{rightIcon}</span>
    );

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
          <input ref={ref} id={inputId} type={resolvedType} className={styles.input} {...rest} />
          {trailingIcon}
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