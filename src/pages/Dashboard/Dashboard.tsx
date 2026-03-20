import React from "react";
import { MainLayout } from "../../templates/MainLayout/MainLayout";
import { TaskBoard } from "../../organisms/TaskBoard/TaskBoard";
import { TaskForm } from "../../molecules/TaskForm/TaskForm";
import { useTaskStore } from "../../store/taskStore";
import "./Dashboard.scss";

export const Dashboard: React.FC = () => {
  const { isFormOpen, openForm } = useTaskStore();
  
  return (
    <MainLayout onCreateTask={openForm}>
      <div className="page-dashboard">
        <TaskBoard />
      </div>
      {isFormOpen && <TaskForm />}
    </MainLayout>
  );
};
