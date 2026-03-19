import React from "react";
import type { Task } from "../../@types/task.types";
import { TaskCard } from "../../molecules/TaskCard/TaskCard";
import "./TaskList.scss";

interface TaskListProps {
  tasks: Task[];
  isLoading?: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, isLoading }) => {
  if (isLoading) {
    return (
      <div className="organism-task-list">
        <div className="organism-task-list__loading">
          {[1, 2, 3].map((i) => (
            <div key={i} className="organism-task-list__skeleton" />
          ))}
        </div>
      </div>
    );
  }
  
  if (tasks.length === 0) {
    return (
      <div className="organism-task-list">
        <div className="organism-task-list__empty">
          <span className="organism-task-list__empty-icon">📋</span>
          <h3 className="organism-task-list__empty-title">No hay tareas</h3>
          <p className="organism-task-list__empty-text">
            Crea tu primera tarea para comenzar
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="organism-task-list">
      <div className="organism-task-list__grid">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};
