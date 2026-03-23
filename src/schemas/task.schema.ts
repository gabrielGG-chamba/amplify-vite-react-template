import { pipe, object, string, minLength, maxLength, picklist } from "valibot";

export const TaskStatusEnum = picklist(["PENDIENTE", "HACIENDO", "HECHO"]);

export const CreateTaskSchema = object({
  content: pipe(
    string(),
    minLength(1, "El contenido es requerido"),
    maxLength(500, "El contenido no puede exceder 500 caracteres")
  ),
  status: pipe(
    string(),
    minLength(1, "El estado es requerido")
  ),
});

export const UpdateTaskSchema = object({
  id: pipe(
    string(),
    minLength(1, "El ID es requerido")
  ),
  content: pipe(
    string(),
    maxLength(500, "El contenido no puede exceder 500 caracteres")
  ),
  status: string(),
});

export type CreateTaskInput = {
  content: string;
  status: string;
};

export type UpdateTaskInput = {
  id: string;
  content?: string;
  status?: string;
};
