import React from "react";
import { cn } from "../../utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      className={cn(
        "atom-button",
        `atom-button--${variant}`,
        `atom-button--${size}`,
        isLoading && "atom-button--loading",
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="atom-button__loader">
          <svg className="atom-button__spinner" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="none" strokeWidth="3" />
          </svg>
        </span>
      ) : (
        <>
          {leftIcon && <span className="atom-button__icon atom-button__icon--left">{leftIcon}</span>}
          {children && <span className="atom-button__text">{children}</span>}
          {rightIcon && <span className="atom-button__icon atom-button__icon--right">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
