import React from "react";
import { Button } from "../../atoms/Button/Button";
import { useAuthenticator } from "@aws-amplify/ui-react";
import "./MainLayout.scss";

interface MainLayoutProps {
  children: React.ReactNode;
  onCreateTask?: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  onCreateTask,
}) => {
  const { user, signOut } = useAuthenticator();
  
  return (
    <div className="template-main-layout">
      <header className="template-main-layout__header">
        <div className="template-main-layout__header-content">
          <div className="template-main-layout__brand">
            <span className="template-main-layout__logo">✓</span>
            <h1 className="template-main-layout__title">TaskFlow</h1>
          </div>
          
          <div className="template-main-layout__actions">
            <Button variant="primary" onClick={onCreateTask}>
              + Nueva Tarea
            </Button>
            <div className="template-main-layout__user">
              <span className="template-main-layout__user-avatar">
                {user?.signInDetails?.loginId?.charAt(0).toUpperCase() || "U"}
              </span>
              <Button variant="ghost" size="sm" onClick={signOut}>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="template-main-layout__main">
        <div className="template-main-layout__container">
          {children}
        </div>
      </main>
      
      <footer className="template-main-layout__footer">
        <p>TaskFlow Pro © 2024 - Sistema de Gestión de Tareas</p>
      </footer>
    </div>
  );
};
