import React, { forwardRef, useId } from "react";
import { cn } from "../../utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    
    return (
      <div className={cn("atom-input", error && "atom-input--error", className)}>
        {label && (
          <label htmlFor={inputId} className="atom-input__label">
            {label}
          </label>
        )}
        <div className="atom-input__wrapper">
          {leftIcon && (
            <span className="atom-input__icon atom-input__icon--left">{leftIcon}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "atom-input__field",
              leftIcon && "atom-input__field--has-left-icon",
              rightIcon && "atom-input__field--has-right-icon"
            )}
            {...props}
          />
          {rightIcon && (
            <span className="atom-input__icon atom-input__icon--right">{rightIcon}</span>
          )}
        </div>
        {error && <span className="atom-input__error">{error}</span>}
        {helperText && !error && (
          <span className="atom-input__helper">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
