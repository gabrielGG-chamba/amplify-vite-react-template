export type TaskStatus = "PENDIENTE" | "HACIENDO" | "HECHO";

export interface TaskVersion {
  id: string;
  previousStatus: TaskStatus | null;
  newStatus: TaskStatus;
  changedAt: string;
  changedBy: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  versions: TaskVersion[];
  createdAt: string;
  updatedAt: string;
  owner?: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
}

export interface UpdateTaskInput {
  id: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  versions?: TaskVersion[];
}

export interface TaskFilter {
  status?: TaskStatus;
  search?: string;
}

export const TASK_STATUS_ORDER: TaskStatus[] = ["PENDIENTE", "HACIENDO", "HECHO"];

export const TASK_STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; icon: string }> = {
  PENDIENTE: {
    label: "Pendiente",
    color: "#f59e0b",
    icon: "○",
  },
  HACIENDO: {
    label: "En Progreso",
    color: "#3b82f6",
    icon: "◐",
  },
  HECHO: {
    label: "Completado",
    color: "#10b981",
    icon: "✓",
  },
};
