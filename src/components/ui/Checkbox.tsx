import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';
import styles from './Checkbox.module.css';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className, id, ...rest }, ref) => {
    const checkboxId = id || rest.name;

    return (
      <div className={cn(styles.wrapper, className)}>
        <label htmlFor={checkboxId} className={styles.label}>
          <input ref={ref} id={checkboxId} type="checkbox" className={styles.input} {...rest} />
          <span className={styles.box} aria-hidden="true" />
          {label && <span className={styles.text}>{label}</span>}
        </label>
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';