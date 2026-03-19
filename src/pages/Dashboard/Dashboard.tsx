import React, { useMemo } from "react";
import { MainLayout } from "../../templates/MainLayout/MainLayout";
import { TaskBoard } from "../../organisms/TaskBoard/TaskBoard";
import { TaskForm } from "../../molecules/TaskForm/TaskForm";
import { VersionHistory } from "../../organisms/VersionHistory/VersionHistory";
import { useTasks } from "../../hooks/useTasks";
import { useTaskStore } from "../../store/taskStore";
import type { TaskStatus } from "../../@types/task.types";
import "./Dashboard.scss";

export const Dashboard: React.FC = () => {
  const { tasks, isLoading } = useTasks();
  const { isFormOpen, openForm, isHistoryOpen, selectedTaskId, closeHistory, searchQuery, setSearchQuery, filter, setStatusFilter } = useTaskStore();
  
  const filteredTasks = useMemo(() => {
    let result = tasks;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query)
      );
    }
    
    if (filter.status) {
      result = result.filter((task) => task.status === filter.status);
    }
    
    return result;
  }, [tasks, searchQuery, filter.status]);
  
  const selectedTask = useMemo(() => {
    return tasks.find((task) => task.id === selectedTaskId);
  }, [tasks, selectedTaskId]);
  
  const stats = useMemo(() => {
    const statuses: TaskStatus[] = ["PENDIENTE", "HACIENDO", "HECHO"];
    return statuses.map((status) => ({
      status,
      count: tasks.filter((task) => task.status === status).length,
    }));
  }, [tasks]);
  
  return (
    <MainLayout
      onCreateTask={openForm}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <div className="page-dashboard">
        <div className="page-dashboard__header">
          <div className="page-dashboard__stats">
            {stats.map((stat) => (
              <button
                key={stat.status}
                className={`page-dashboard__stat ${filter.status === stat.status ? "page-dashboard__stat--active" : ""}`}
                onClick={() => setStatusFilter(filter.status === stat.status ? undefined : stat.status)}
              >
                <span className={`page-dashboard__stat-indicator page-dashboard__stat-indicator--${stat.status.toLowerCase()}`} />
                <span className="page-dashboard__stat-label">
                  {stat.status === "PENDIENTE" && "Pendientes"}
                  {stat.status === "HACIENDO" && "En Progreso"}
                  {stat.status === "HECHO" && "Completadas"}
                </span>
                <span className="page-dashboard__stat-count">{stat.count}</span>
              </button>
            ))}
          </div>
        </div>
        
        <TaskBoard tasks={filteredTasks} isLoading={isLoading} />
      </div>
      
      {isFormOpen && <TaskForm />}
      
      {isHistoryOpen && selectedTask && (
        <VersionHistory task={selectedTask} onClose={closeHistory} />
      )}
    </MainLayout>
  );
};
