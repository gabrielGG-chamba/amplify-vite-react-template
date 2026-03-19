import React from "react";
import type { TaskStatus } from "../../@types/task.types";
import { TASK_STATUS_CONFIG } from "../../@types/task.types";
import { cn } from "../../utils/cn";

interface BadgeProps {
  status: TaskStatus;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  size = "md",
  showIcon = true,
}) => {
  const config = TASK_STATUS_CONFIG[status];
  
  return (
    <span
      className={cn(
        "atom-badge",
        `atom-badge--${status.toLowerCase()}`,
        `atom-badge--${size}`
      )}
    >
      {showIcon && (
        <span className="atom-badge__icon">{config.icon}</span>
      )}
      <span className="atom-badge__label">{config.label}</span>
    </span>
  );
};
