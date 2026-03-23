import React from "react";
import { cn } from "../../utils/cn";

interface CardProps {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "outlined";
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  padding = "md",
  className,
  onClick,
  hoverable = false,
}) => {
  return (
    <div
      className={cn(
        "atom-card",
        `atom-card--${variant}`,
        `atom-card--padding-${padding}`,
        hoverable && "atom-card--hoverable",
        onClick && "atom-card--clickable",
        className
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {children}
    </div>
  );
};
