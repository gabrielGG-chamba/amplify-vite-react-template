import React from "react";
import type { Task } from "../../@types/task.types";
import { Badge } from "../../atoms/Badge/Badge";
import { Button } from "../../atoms/Button/Button";
import { Card } from "../../atoms/Card/Card";
import { useTaskStatus } from "../../hooks/useTaskStatus";
import { useTaskStore } from "../../store/taskStore";
import { formatRelativeTime } from "../../utils/formatDate";
import { cn } from "../../utils/cn";
import "./TaskCard.scss";

interface TaskCardProps {
  task: Task;
  className?: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, className }) => {
  const { advanceStatus, isTransitioning, canAdvance } = useTaskStatus(task);
  const { openHistory } = useTaskStore();
  
  return (
    <Card className={cn("molecule-task-card", className)} padding="md">
      <div className="molecule-task-card__header">
        <Badge status={task.status} size="md" />
        <span className="molecule-task-card__date">
          {formatRelativeTime(task.createdAt)}
        </span>
      </div>
      
      <h3 className="molecule-task-card__title">{task.title}</h3>
      
      {task.description && (
        <p className="molecule-task-card__description">{task.description}</p>
      )}
      
      <div className="molecule-task-card__footer">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => openHistory(task.id)}
          disabled={task.versions.length === 0}
        >
          Historial ({task.versions.length})
        </Button>
        
        <Button
          variant="primary"
          size="sm"
          onClick={advanceStatus}
          disabled={!canAdvance || isTransitioning}
          isLoading={isTransitioning}
        >
          {task.status === "PENDIENTE" && "Iniciar"}
          {task.status === "HACIENDO" && "Completar"}
          {task.status === "HECHO" && "Completado"}
        </Button>
      </div>
    </Card>
  );
};
