import React, { useCallback } from "react";
import { Input } from "../../atoms/Input/Input";
import { Button } from "../../atoms/Button/Button";
import { Card } from "../../atoms/Card/Card";
import { useTaskForm } from "../../hooks/useTaskForm";
import { useTaskStore } from "../../store/taskStore";
import { useTasks } from "../../hooks/useTasks";
import "./TaskForm.scss";

export const TaskForm: React.FC = () => {
  const { title, description, errors, setTitle, setDescription, validate, reset, getValues } = useTaskForm();
  const { closeForm } = useTaskStore();
  const { createTask, isCreating } = useTasks();
  
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      await createTask(getValues());
      reset();
      closeForm();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  }, [validate, getValues, createTask, reset, closeForm]);
  
  const handleClose = (): void => {
    reset();
    closeForm();
  };
  
  return (
    <div className="molecule-task-form__overlay" onClick={handleClose}>
      <Card 
        className="molecule-task-form" 
        padding="lg"
        onClick={() => {}}
      >
        <form onSubmit={handleSubmit} className="molecule-task-form__form">
          <h2 className="molecule-task-form__title">Nueva Tarea</h2>
          
          <Input
            label="Título"
            placeholder="Ingresa el título de la tarea"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
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
            {errors.description && (
              <span className="molecule-task-form__error">{errors.description}</span>
            )}
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
  );
};
