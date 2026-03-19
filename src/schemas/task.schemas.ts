import * as v from "valibot";

export const createTaskSchema = v.object({
  title: v.pipe(
    v.string("El título debe ser un texto"),
    v.minLength(1, "El título es requerido"),
    v.maxLength(200, "El título no puede exceder 200 caracteres")
  ),
  description: v.optional(
    v.pipe(
      v.string("La descripción debe ser un texto"),
      v.maxLength(1000, "La descripción no puede exceder 1000 caracteres")
    )
  ),
});

type TaskStatusType = "PENDIENTE" | "HACIENDO" | "HECHO";

export const updateTaskSchema = v.object({
  id: v.pipe(v.string("El ID es requerido")),
  title: v.optional(
    v.pipe(
      v.string("El título debe ser un texto"),
      v.minLength(1, "El título es requerido"),
      v.maxLength(200, "El título no puede exceder 200 caracteres")
    )
  ),
  description: v.optional(
    v.pipe(
      v.string("La descripción debe ser un texto"),
      v.maxLength(1000, "La descripción no puede exceder 1000 caracteres")
    )
  ),
  status: v.optional(v.pipe(
    v.union([
      v.literal("PENDIENTE"),
      v.literal("HACIENDO"),
      v.literal("HECHO"),
    ]),
    v.transform((data) => data as TaskStatusType)
  )),
});

export type CreateTaskInput = v.InferInput<typeof createTaskSchema>;
export type UpdateTaskInput = v.InferInput<typeof updateTaskSchema>;

export const validateCreateTask = (data: unknown) => {
  return v.safeParse(createTaskSchema, data);
};

export const validateUpdateTask = (data: unknown) => {
  return v.safeParse(updateTaskSchema, data);
};
