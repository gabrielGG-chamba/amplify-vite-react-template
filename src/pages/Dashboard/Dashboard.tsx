import React, { useMemo } from "react";
import { MainLayout } from "../../templates/MainLayout/MainLayout";
import { TaskBoard } from "../../organisms/TaskBoard/TaskBoard";
import { TaskForm } from "../../molecules/TaskForm/TaskForm";
import { useTaskStore } from "../../store/taskStore";
import { useTasks } from "../../hooks/useTasks";
import "./Dashboard.scss";

export const Dashboard: React.FC = () => {
  const { tasks } = useTasks();
  const { isFormOpen, openForm, searchQuery, setSearchQuery, filter, setStatusFilter } = useTaskStore();
  
  const stats = useMemo(() => {
    return {
      pendiente: tasks.filter((t) => !t.content?.startsWith("[HACIENDO]") && !t.content?.startsWith("[HECHO]")).length,
      haciendo: tasks.filter((t) => t.content?.startsWith("[HACIENDO]")).length,
      hecho: tasks.filter((t) => t.content?.startsWith("[HECHO]")).length,
    };
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
            <button
              className={`page-dashboard__stat ${filter.status === "PENDIENTE" ? "page-dashboard__stat--active" : ""}`}
              onClick={() => setStatusFilter(filter.status === "PENDIENTE" ? undefined : "PENDIENTE")}
            >
              <span className="page-dashboard__stat-indicator page-dashboard__stat-indicator--pendiente" />
              <span className="page-dashboard__stat-label">Pendientes</span>
              <span className="page-dashboard__stat-count">{stats.pendiente}</span>
            </button>
            
            <button
              className={`page-dashboard__stat ${filter.status === "HACIENDO" ? "page-dashboard__stat--active" : ""}`}
              onClick={() => setStatusFilter(filter.status === "HACIENDO" ? undefined : "HACIENDO")}
            >
              <span className="page-dashboard__stat-indicator page-dashboard__stat-indicator--haciendo" />
              <span className="page-dashboard__stat-label">En Progreso</span>
              <span className="page-dashboard__stat-count">{stats.haciendo}</span>
            </button>
            
            <button
              className={`page-dashboard__stat ${filter.status === "HECHO" ? "page-dashboard__stat--active" : ""}`}
              onClick={() => setStatusFilter(filter.status === "HECHO" ? undefined : "HECHO")}
            >
              <span className="page-dashboard__stat-indicator page-dashboard__stat-indicator--hecho" />
              <span className="page-dashboard__stat-label">Completadas</span>
              <span className="page-dashboard__stat-count">{stats.hecho}</span>
            </button>
          </div>
        </div>
        
        <TaskBoard />
      </div>
      
      {isFormOpen && <TaskForm />}
    </MainLayout>
  );
};
