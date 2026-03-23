import React, { useCallback, useState } from "react";
import { Input } from "../../atoms/Input/Input";
import { Button } from "../../atoms/Button/Button";
import { Card } from "../../atoms/Card/Card";
import { useTaskStore } from "../../store/taskStore";
import { useTasks } from "../../hooks/useTasks";
import "./TaskForm.scss";

export const TaskForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const { closeForm } = useTaskStore();
  const { createTask, isCreating } = useTasks();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("El título es requerido");
      return;
    }
    try {
      await createTask(title.trim(), "PENDIENTE");
      closeForm();
    } catch (err) {
      setError("Error al crear la tarea");
    }
  }, [title, createTask, closeForm]);

  const handleClose = useCallback(() => {
    setTitle("");
    setError("");
    closeForm();
  }, [closeForm]);

  return (
    <div className="molecule-task-form__overlay" onClick={handleClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <Card className="molecule-task-form" padding="lg">
          <form onSubmit={handleSubmit} className="molecule-task-form__form">
            <h2 className="molecule-task-form__title">Nueva Tarea</h2>
            <Input
              label="Título"
              placeholder="¿Qué necesitas hacer?"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(""); }}
              error={error}
              disabled={isCreating}
            />
            <div className="molecule-task-form__actions">
              <Button type="button" variant="ghost" onClick={handleClose} disabled={isCreating}>Cancelar</Button>
              <Button type="submit" variant="primary" isLoading={isCreating}>Crear Tarea</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
