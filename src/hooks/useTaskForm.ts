import { useState, useCallback, useMemo } from "react";
import { validateCreateTask } from "../schemas/task.schemas";
import type { CreateTaskInput } from "../schemas/task.schemas";

interface UseTaskFormReturn {
  title: string;
  description: string;
  errors: Record<string, string>;
  setTitle: (value: string) => void;
  setDescription: (value: string) => void;
  validate: () => boolean;
  reset: () => void;
  getValues: () => CreateTaskInput;
}

export const useTaskForm = (): UseTaskFormReturn => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validate = useCallback((): boolean => {
    const result = validateCreateTask({ title, description });
    
    if (result.success) {
      setErrors({});
      return true;
    }
    
    const newErrors: Record<string, string> = {};
    result.issues.forEach((issue) => {
      const path = issue.path?.[0];
      if (path && typeof path === "string") {
        newErrors[path] = issue.message;
      }
    });
    
    setErrors(newErrors);
    return false;
  }, [title, description]);
  
  const reset = useCallback(() => {
    setTitle("");
    setDescription("");
    setErrors({});
  }, []);
  
  const getValues = useCallback((): CreateTaskInput => {
    return {
      title: title.trim(),
      description: description.trim() || undefined,
    };
  }, [title, description]);
  
  return useMemo(() => ({
    title,
    description,
    errors,
    setTitle,
    setDescription,
    validate,
    reset,
    getValues,
  }), [title, description, errors, validate, reset, getValues]);
};
