import React from "react";
import type { Task } from "../../@types/task.types";
import { StatusBadge } from "../../molecules/StatusBadge/StatusBadge";
import "./VersionHistory.scss";

interface VersionHistoryProps {
  task: Task;
  onClose: () => void;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({ task, onClose }) => {
  const sortedVersions = [...task.versions].sort(
    (a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
  );
  
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };
  
  return (
    <div className="organism-version-history__overlay" onClick={onClose}>
      <div className="organism-version-history" onClick={(e) => e.stopPropagation()}>
        <div className="organism-version-history__header">
          <h2 className="organism-version-history__title">Historial de Cambios</h2>
          <button className="organism-version-history__close" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="organism-version-history__task-info">
          <h3 className="organism-version-history__task-title">{task.title}</h3>
          <StatusBadge status={task.status} size="sm" />
        </div>
        
        <div className="organism-version-history__timeline">
          {sortedVersions.map((version, index) => (
            <div 
              key={version.id} 
              className={`organism-version-history__item organism-version-history__item--${index === 0 ? "latest" : "past"}`}
            >
              <div className="organism-version-history__dot" />
              <div className="organism-version-history__content">
                <div className="organism-version-history__status">
                  {index === 0 && sortedVersions.length > 1 ? (
                    <span className="organism-version-history__current-status">
                      Estado actual: <StatusBadge status={version.newStatus} size="sm" />
                    </span>
                  ) : version.previousStatus ? (
                    <span>
                      <StatusBadge status={version.previousStatus} size="sm" showLabel={false} />
                      <span className="organism-version-history__arrow">→</span>
                      <StatusBadge status={version.newStatus} size="sm" showLabel={false} />
                    </span>
                  ) : (
                    <StatusBadge status={version.newStatus} size="sm" />
                  )}
                </div>
                <span className="organism-version-history__date">
                  {formatDate(version.changedAt)}
                </span>
                <span className="organism-version-history__user">
                  Por: {version.changedBy}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="organism-version-history__footer">
          <span className="organism-version-history__count">
            {task.versions.length} {task.versions.length === 1 ? "cambio" : "cambios"} registrados
          </span>
        </div>
      </div>
    </div>
  );
};
