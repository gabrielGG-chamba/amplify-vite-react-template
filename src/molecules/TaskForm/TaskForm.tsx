import React, { useCallback, useState } from "react";
import { Input } from "../../atoms/Input/Input";
import { Button } from "../../atoms/Button/Button";
import { Card } from "../../atoms/Card/Card";
import { useTaskStore } from "../../store/taskStore";
import { useTasks } from "../../hooks/useTasks";
import "./TaskForm.scss";

export const TaskForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  
  const { closeForm } = useTaskStore();
  const { createTask, isCreating } = useTasks();
  
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!title.trim()) {
      setError("El título es requerido");
      return;
    }
    
    if (title.length > 200) {
      setError("El título no puede exceder 200 caracteres");
      return;
    }
    
    try {
      await createTask(title.trim());
      setTitle("");
      setDescription("");
      setError("");
      closeForm();
    } catch (err) {
      console.error("Error creating task:", err);
      setError("Error al crear la tarea");
    }
  }, [title, createTask, closeForm]);
  
  const handleClose = useCallback(() => {
    setTitle("");
    setDescription("");
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
              placeholder="Ingresa el título de la tarea"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError("");
              }}
              error={error}
              disabled={isCreating}
            />
            
            <div className="molecule-task-form__textarea-wrapper">
              <label className="molecule-task-form__label">Descripción</label>
              <textarea
                className="molecule-task-form__textarea"
                placeholder="Ingresa una descripción (opcional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isCreating}
                rows={4}
              />
            </div>
            
            <div className="molecule-task-form__actions">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                disabled={isCreating}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isCreating}
              >
                Crear Tarea
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
