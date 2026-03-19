/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, useEffect, useRef } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";
import "./TaskBoard.scss";

const client = generateClient<Schema>();

interface Todo {
  id: string;
  content: string | null;
  createdAt?: string;
  updatedAt?: string;
  owner?: string | null;
}

interface TaskFormState {
  editingId: string | null;
  editValue: string;
}

export const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [draggedTask, setDraggedTask] = useState<Todo | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [formState, setFormState] = useState<TaskFormState>({ editingId: null, editValue: "" });
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const observable = client.models.Todo.observeQuery({
          authMode: "userPool",
        });
        
        subscriptionRef.current = observable.subscribe({
          next: (data: any) => {
            const mappedTasks: Todo[] = data.items.map((item: any): Todo => ({
              id: item.id,
              content: item.content ?? null,
              createdAt: item.createdAt ?? new Date().toISOString(),
              updatedAt: item.updatedAt ?? new Date().toISOString(),
              owner: item.owner,
            }));
            
            const uniqueTasks = mappedTasks.reduce((acc: Todo[], todo) => {
              const existing = acc.find(t => t.id === todo.id);
              if (!existing) {
                acc.push(todo);
              }
              return acc;
            }, []);
            
            setTasks(uniqueTasks);
            setIsLoading(false);
          },
          error: (err: Error) => {
            console.error("Error fetching tasks:", err);
            setIsLoading(false);
          },
        });
      } catch (err) {
        console.error("Error setting up subscription:", err);
        setIsLoading(false);
      }
    };

    fetchTasks();

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, []);

  const getTaskStatus = (content: string | null): "pendiente" | "haciendo" | "hecho" => {
    if (content?.startsWith("[HECHO]")) return "hecho";
    if (content?.startsWith("[HACIENDO]")) return "haciendo";
    return "pendiente";
  };

  const getDisplayContent = (content: string | null): string => {
    if (!content) return "Sin título";
    return content.replace(/^\[(PENDIENTE|HACIENDO|HECHO)\]\s*/, "");
  };

  const handleDragStart = (e: React.DragEvent, task: Todo) => {
    if (formState.editingId) return;
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", task.id);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, column: string) => {
    if (formState.editingId) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(column);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = useCallback(async (e: React.DragEvent, targetStatus: "pendiente" | "haciendo" | "hecho") => {
    e.preventDefault();
    setDragOverColumn(null);
    
    if (!draggedTask) return;
    
    const currentStatus = getTaskStatus(draggedTask.content);
    if (currentStatus === targetStatus) return;
    
    const statusPrefix: Record<string, string> = {
      pendiente: "[PENDIENTE]",
      haciendo: "[HACIENDO]",
      hecho: "[HECHO]",
    };
    
    const newContent = `${statusPrefix[targetStatus]} ${getDisplayContent(draggedTask.content)}`;
    
    try {
      await client.models.Todo.update({
        id: draggedTask.id,
        content: newContent,
        updatedAt: new Date().toISOString(),
      } as any, {
        authMode: "userPool",
      });
    } catch (err) {
      console.error("Error updating task:", err);
    }
  }, [draggedTask]);

  const handleEdit = (task: Todo) => {
    setFormState({ editingId: task.id, editValue: getDisplayContent(task.content) });
  };

  const handleSaveEdit = async () => {
    if (!formState.editingId || !formState.editValue.trim()) {
      setFormState({ editingId: null, editValue: "" });
      return;
    }

    const task = tasks.find(t => t.id === formState.editingId);
    if (!task) return;

    const statusPrefix: Record<string, string> = {
      pendiente: "[PENDIENTE]",
      haciendo: "[HACIENDO]",
      hecho: "[HECHO]",
    };
    const status = getTaskStatus(task.content);
    const newContent = `${statusPrefix[status]} ${formState.editValue.trim()}`;

    try {
      await client.models.Todo.update({
        id: formState.editingId,
        content: newContent,
        updatedAt: new Date().toISOString(),
      } as any, {
        authMode: "userPool",
      });
      setFormState({ editingId: null, editValue: "" });
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const handleCancelEdit = () => {
    setFormState({ editingId: null, editValue: "" });
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm("¿Estás seguro de eliminar esta tarea?")) return;
    
    try {
      await client.models.Todo.delete({ id: taskId } as any, {
        authMode: "userPool",
      });
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const columns = {
    pendiente: tasks.filter((t) => getTaskStatus(t.content) === "pendiente"),
    haciendo: tasks.filter((t) => getTaskStatus(t.content) === "haciendo"),
    hecho: tasks.filter((t) => getTaskStatus(t.content) === "hecho"),
  };

  const TaskCard = ({ task }: { task: Todo }) => {
    const isEditing = formState.editingId === task.id;
    const isDragging = draggedTask?.id === task.id;

    return (
      <div
        className={`organism-task-board__card ${isDragging ? "organism-task-board__card--dragging" : ""}`}
        draggable={!isEditing}
        onDragStart={(e) => handleDragStart(e, task)}
        onDragEnd={handleDragEnd}
      >
        <div className="organism-task-board__card-handle">⋮⋮</div>
        
        <div className="organism-task-board__card-content">
          {isEditing ? (
            <div className="organism-task-board__edit-form">
              <input
                type="text"
                className="organism-task-board__edit-input"
                value={formState.editValue}
                onChange={(e) => setFormState(prev => ({ ...prev, editValue: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveEdit();
                  if (e.key === "Escape") handleCancelEdit();
                }}
                autoFocus
              />
              <div className="organism-task-board__edit-actions">
                <button 
                  className="organism-task-board__btn organism-task-board__btn--save"
                  onClick={handleSaveEdit}
                  title="Guardar"
                >
                  ✓
                </button>
                <button 
                  className="organism-task-board__btn organism-task-board__btn--cancel"
                  onClick={handleCancelEdit}
                  title="Cancelar"
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <>
              <h4 className="organism-task-board__card-title">{getDisplayContent(task.content)}</h4>
              <div className="organism-task-board__card-actions">
                <button 
                  className="organism-task-board__btn"
                  onClick={() => handleEdit(task)}
                  title="Editar"
                >
                  ✎
                </button>
                <button 
                  className="organism-task-board__btn organism-task-board__btn--delete"
                  onClick={() => handleDelete(task.id)}
                  title="Eliminar"
                >
                  🗑
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

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
      <div
        className={`organism-task-board__column ${dragOverColumn === "pendiente" ? "organism-task-board__column--drag-over" : ""}`}
        onDragOver={(e) => handleDragOver(e, "pendiente")}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, "pendiente")}
      >
        <div className="organism-task-board__header">
          <div className="organism-task-board__header-content">
            <span className="organism-task-board__badge organism-task-board__badge--pendiente">○</span>
            <span className="organism-task-board__badge-label">Pendiente</span>
            <span className="organism-task-board__count">{columns.pendiente.length}</span>
          </div>
        </div>
        <div className="organism-task-board__cards">
          {columns.pendiente.length === 0 ? (
            <div className="organism-task-board__empty">Arrastra aquí</div>
          ) : (
            columns.pendiente.map((task) => <TaskCard key={task.id} task={task} />)
          )}
        </div>
      </div>

      <div
        className={`organism-task-board__column ${dragOverColumn === "haciendo" ? "organism-task-board__column--drag-over" : ""}`}
        onDragOver={(e) => handleDragOver(e, "haciendo")}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, "haciendo")}
      >
        <div className="organism-task-board__header">
          <div className="organism-task-board__header-content">
            <span className="organism-task-board__badge organism-task-board__badge--haciendo">◐</span>
            <span className="organism-task-board__badge-label">En Progreso</span>
            <span className="organism-task-board__count">{columns.haciendo.length}</span>
          </div>
        </div>
        <div className="organism-task-board__cards">
          {columns.haciendo.length === 0 ? (
            <div className="organism-task-board__empty">Arrastra aquí</div>
          ) : (
            columns.haciendo.map((task) => <TaskCard key={task.id} task={task} />)
          )}
        </div>
      </div>

      <div
        className={`organism-task-board__column ${dragOverColumn === "hecho" ? "organism-task-board__column--drag-over" : ""}`}
        onDragOver={(e) => handleDragOver(e, "hecho")}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, "hecho")}
      >
        <div className="organism-task-board__header">
          <div className="organism-task-board__header-content">
            <span className="organism-task-board__badge organism-task-board__badge--hecho">✓</span>
            <span className="organism-task-board__badge-label">Completado</span>
            <span className="organism-task-board__count">{columns.hecho.length}</span>
          </div>
        </div>
        <div className="organism-task-board__cards">
          {columns.hecho.length === 0 ? (
            <div className="organism-task-board__empty">Arrastra aquí</div>
          ) : (
            columns.hecho.map((task) => <TaskCard key={task.id} task={task} />)
          )}
        </div>
      </div>
    </div>
  );
};
