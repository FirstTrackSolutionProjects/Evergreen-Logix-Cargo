import { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import styles from './Textarea.module.css';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  requiredMark?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, requiredMark, className, id, ...rest }, ref) => {
    const textareaId = id || rest.name;

    return (
      <div className={cn(styles.wrapper, className)}>
        {label && (
          <label htmlFor={textareaId} className={styles.label}>
            {label}
            {requiredMark && <span className={styles.required}>*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(styles.textarea, error && styles.error)}
          {...rest}
        />
        {error ? (
          <span className={styles.errorText}>{error}</span>
        ) : hint ? (
          <span className={styles.hintText}>{hint}</span>
        ) : null}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';