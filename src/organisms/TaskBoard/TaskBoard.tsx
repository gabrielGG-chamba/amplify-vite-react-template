import React, { useMemo } from "react";
import type { Task, TaskStatus } from "../../@types/task.types";
import { StatusBadge } from "../../molecules/StatusBadge/StatusBadge";
import "./TaskBoard.scss";

interface TaskBoardProps {
  tasks: Task[];
  isLoading?: boolean;
}

interface Column {
  status: TaskStatus;
  tasks: Task[];
  count: number;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, isLoading }) => {
  const columns = useMemo(() => {
    const statuses: TaskStatus[] = ["PENDIENTE", "HACIENDO", "HECHO"];
    
    return statuses.map((status): Column => ({
      status,
      tasks: tasks.filter((task) => task.status === status),
      count: tasks.filter((task) => task.status === status).length,
    }));
  }, [tasks]);
  
  if (isLoading) {
    return (
      <div className="organism-task-board">
        {[1, 2, 3].map((i) => (
          <div key={i} className="organism-task-board__column">
            <div className="organism-task-board__skeleton-header" />
            <div className="organism-task-board__skeleton-cards">
              {[1, 2].map((j) => (
                <div key={j} className="organism-task-board__skeleton-card" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="organism-task-board">
      {columns.map((column) => (
        <div key={column.status} className="organism-task-board__column">
          <div className="organism-task-board__header">
            <div className="organism-task-board__header-content">
              <StatusBadge status={column.status} size="md" animated />
              <span className="organism-task-board__count">{column.count}</span>
            </div>
          </div>
          
          <div className="organism-task-board__cards">
            {column.tasks.length === 0 ? (
              <div className="organism-task-board__empty">
                <span>Sin tareas</span>
              </div>
            ) : (
              column.tasks.map((task) => (
                <div key={task.id} className="organism-task-board__card">
                  <h4 className="organism-task-board__card-title">{task.title}</h4>
                  {task.description && (
                    <p className="organism-task-board__card-description">
                      {task.description}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
