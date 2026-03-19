import React from "react";
import type { TaskStatus } from "../../@types/task.types";
import "./StatusBadge.scss";

interface StatusBadgeProps {
  status: TaskStatus;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  showLabel = true,
  size = "md",
  animated = false,
}) => {
  return (
    <div className={`molecule-status-badge molecule-status-badge--${status.toLowerCase()} molecule-status-badge--${size}`}>
      <span className={`molecule-status-badge__icon ${animated ? "molecule-status-badge__icon--animated" : ""}`}>
        {status === "PENDIENTE" && "○"}
        {status === "HACIENDO" && "◐"}
        {status === "HECHO" && "✓"}
      </span>
      {showLabel && (
        <span className="molecule-status-badge__label">
          {status === "PENDIENTE" && "Pendiente"}
          {status === "HACIENDO" && "En Progreso"}
          {status === "HECHO" && "Completado"}
        </span>
      )}
    </div>
  );
};
