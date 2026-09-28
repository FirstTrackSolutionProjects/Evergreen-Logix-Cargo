import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import styles from './Select.module.css';

interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  requiredMark?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder, requiredMark, className, id, ...rest }, ref) => {
    const selectId = id || rest.name;

    return (
      <div className={cn(styles.wrapper, className)}>
        {label && (
          <label htmlFor={selectId} className={styles.label}>
            {label}
            {requiredMark && <span className={styles.required}>*</span>}
          </label>
        )}
        <div className={cn(styles.field, error && styles.fieldError, rest.disabled && styles.fieldDisabled)}>
          <select ref={ref} id={selectId} className={styles.select} {...rest}>
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className={styles.chevron} />
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

Select.displayName = 'Select';