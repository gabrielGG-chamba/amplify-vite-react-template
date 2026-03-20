/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, useMemo, memo } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";
import { useTasks, type Todo } from "../../hooks/useTasks";
import "./TaskBoard.scss";

const client = generateClient<Schema>();

const STATUS_MAP = {
  pendiente: "pendiente",
  haciendo: "haciendo",
  hecho: "hecho",
} as const;

const STATUS_PREFIX: Record<string, string> = {
  pendiente: "[PENDIENTE]",
  haciendo: "[HACIENDO]",
  hecho: "[HECHO]",
};

const getStatus = (content: string | null): keyof typeof STATUS_MAP => {
  if (content?.startsWith("[HECHO]")) return "hecho";
  if (content?.startsWith("[HACIENDO]")) return "haciendo";
  return "pendiente";
};

const getContent = (content: string | null): string => {
  return content?.replace(/^\[(PENDIENTE|HACIENDO|HECHO)\]\s*/, "") || "Sin título";
};

interface TaskCardProps {
  task: Todo;
  isEditing: boolean;
  isDragging: boolean;
  editValue: string;
  onDragStart: (e: React.DragEvent, task: Todo) => void;
  onEdit: (task: Todo) => void;
  onDelete: (id: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (value: string) => void;
}

const TaskCard = memo<TaskCardProps>(({
  task, isEditing, isDragging, editValue,
  onDragStart, onEdit, onDelete, onSave, onCancel, onChange
}) => (
  <div
    className={`organism-task-board__card ${isDragging ? "organism-task-board__card--dragging" : ""}`}
    draggable={!isEditing}
    onDragStart={(e) => onDragStart(e, task)}
    onClick={() => !isEditing && onEdit(task)}
  >
    <div className="organism-task-board__card-handle">⋮⋮</div>
    <div className="organism-task-board__card-content">
      {isEditing ? (
        <div className="organism-task-board__edit-form" onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            className="organism-task-board__edit-input"
            value={editValue}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") onSave(); if (e.key === "Escape") onCancel(); }}
            autoFocus
          />
          <div className="organism-task-board__edit-actions">
            <button className="organism-task-board__btn organism-task-board__btn--save" onClick={(e) => { e.stopPropagation(); onSave(); }}>✓</button>
            <button className="organism-task-board__btn organism-task-board__btn--cancel" onClick={(e) => { e.stopPropagation(); onCancel(); }}>✕</button>
          </div>
        </div>
      ) : (
        <>
          <h4 className="organism-task-board__card-title">{getContent(task.content)}</h4>
          <div className="organism-task-board__card-actions">
            <button className="organism-task-board__btn" onClick={(e) => { e.stopPropagation(); onEdit(task); }}>✎</button>
            <button className="organism-task-board__btn --delete" onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}>🗑</button>
          </div>
        </>
      )}
    </div>
  </div>
));

interface ColumnProps {
  status: keyof typeof STATUS_MAP;
  tasks: Todo[];
  draggedTask: Todo | null;
  editingId: string | null;
  editValue: string;
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragStart: (e: React.DragEvent, task: Todo) => void;
  onEdit: (task: Todo) => void;
  onDelete: (id: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (value: string) => void;
}

const Column = memo<ColumnProps>(({
  status, tasks, draggedTask, editingId, editValue, isDragOver,
  onDragOver, onDragLeave, onDrop, onDragStart, onEdit, onDelete, onSave, onCancel, onChange
}) => (
  <div
    className={`organism-task-board__column ${isDragOver ? "organism-task-board__column--drag-over" : ""}`}
    onDragOver={onDragOver}
    onDragLeave={onDragLeave}
    onDrop={onDrop}
  >
    <div className="organism-task-board__header">
      <div className="organism-task-board__header-content">
        <span className={`organism-task-board__badge --${status}`}>
          {status === "pendiente" ? "○" : status === "haciendo" ? "◐" : "✓"}
        </span>
        <span className="organism-task-board__badge-label">
          {status === "pendiente" ? "Pendiente" : status === "haciendo" ? "En Progreso" : "Completado"}
        </span>
        <span className="organism-task-board__count">{tasks.length}</span>
      </div>
    </div>
    <div className="organism-task-board__cards">
      {tasks.length === 0 ? (
        <div className="organism-task-board__empty">
          <span>Arrastra aquí</span>
          <span>{status === "pendiente" ? "las tareas pendientes" : status === "haciendo" ? "las tareas en progreso" : "las tareas completadas"}</span>
        </div>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            isEditing={editingId === task.id}
            isDragging={draggedTask?.id === task.id}
            editValue={editValue}
            onDragStart={onDragStart}
            onEdit={onEdit}
            onDelete={onDelete}
            onSave={onSave}
            onCancel={onCancel}
            onChange={onChange}
          />
        ))
      )}
    </div>
  </div>
));

export const TaskBoard: React.FC = () => {
  const { tasks, isLoading } = useTasks();
  const [draggedTask, setDraggedTask] = useState<Todo | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<keyof typeof STATUS_MAP | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const columns = useMemo(() => ({
    pendiente: tasks.filter((t) => getStatus(t.content) === "pendiente"),
    haciendo: tasks.filter((t) => getStatus(t.content) === "haciendo"),
    hecho: tasks.filter((t) => getStatus(t.content) === "hecho"),
  }), [tasks]);

  const handleDragStart = useCallback((e: React.DragEvent, task: Todo) => {
    if (editingId) return;
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
    navigator.vibrate?.(50);
  }, [editingId]);

  const handleDragOver = useCallback((e: React.DragEvent, column: keyof typeof STATUS_MAP) => {
    if (editingId) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(column);
  }, [editingId]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
      setDragOverColumn(null);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent, targetStatus: keyof typeof STATUS_MAP) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverColumn(null);
    if (!draggedTask || getStatus(draggedTask.content) === targetStatus) return;

    const content = getContent(draggedTask.content);
    try {
      await client.models.Todo.update({ id: draggedTask.id, content: `${STATUS_PREFIX[targetStatus]} ${content}` } as any, { authMode: "userPool" });
      navigator.vibrate?.([30, 50, 30]);
    } catch (err) {
      console.error("Error updating task:", err);
    }
  }, [draggedTask]);

  const handleEdit = useCallback((task: Todo) => {
    setEditingId(task.id);
    setEditValue(getContent(task.content));
  }, []);

  const handleSave = useCallback(async () => {
    if (!editingId || !editValue.trim()) {
      setEditingId(null);
      setEditValue("");
      return;
    }
    const task = tasks.find((t) => t.id === editingId);
    if (!task) return;

    try {
      await client.models.Todo.update({
        id: editingId,
        content: `${STATUS_PREFIX[getStatus(task.content)]} ${editValue.trim()}`,
      } as any, { authMode: "userPool" });
      setEditingId(null);
      setEditValue("");
    } catch (err) {
      console.error("Error updating task:", err);
    }
  }, [editingId, editValue, tasks]);

  const handleCancel = useCallback(() => {
    setEditingId(null);
    setEditValue("");
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("¿Eliminar esta tarea?")) return;
    try {
      await client.models.Todo.delete({ id } as any, { authMode: "userPool" });
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="organism-task-board">
        {[1, 2, 3].map((i) => (
          <div key={i} className="organism-task-board__column">
            <div className="organism-task-board__skeleton-header" />
            <div className="organism-task-board__skeleton-cards">
              {[1, 2].map((j) => <div key={j} className="organism-task-board__skeleton-card" />)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="organism-task-board">
      {(["pendiente", "haciendo", "hecho"] as const).map((status) => (
        <Column
          key={status}
          status={status}
          tasks={columns[status]}
          draggedTask={draggedTask}
          editingId={editingId}
          editValue={editValue}
          isDragOver={dragOverColumn === status}
          onDragOver={(e) => handleDragOver(e, status)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, status)}
          onDragStart={handleDragStart}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSave={handleSave}
          onCancel={handleCancel}
          onChange={setEditValue}
        />
      ))}
    </div>
  );
};
