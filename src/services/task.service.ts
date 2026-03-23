import type { TaskStatus, TaskVersion } from "../@types/task.types";

const STATUS_ORDER: TaskStatus[] = ["PENDIENTE", "HACIENDO", "HECHO"];

export const getNextStatus = (currentStatus: TaskStatus): TaskStatus => {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);
  if (currentIndex === -1 || currentIndex === STATUS_ORDER.length - 1) {
    return currentStatus;
  }
  return STATUS_ORDER[currentIndex + 1];
};

export const canTransitionTo = (
  from: TaskStatus,
  to: TaskStatus
): boolean => {
  const fromIndex = STATUS_ORDER.indexOf(from);
  const toIndex = STATUS_ORDER.indexOf(to);
  return toIndex === fromIndex + 1;
};

export const createVersion = (
  previousStatus: TaskStatus | null,
  newStatus: TaskStatus,
  userId: string
): TaskVersion => ({
  id: crypto.randomUUID(),
  previousStatus,
  newStatus,
  changedAt: new Date().toISOString(),
  changedBy: userId,
});

export const isValidStatus = (value: unknown): value is TaskStatus => {
  return typeof value === "string" && STATUS_ORDER.includes(value as TaskStatus);
};
