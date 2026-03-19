import { useCallback } from "react";
import { useTasks } from "./useTasks";
import type { Task, TaskStatus } from "../@types/task.types";
import { getNextStatus, canTransitionTo } from "../services/task.service";

export const useTaskStatus = (task: Task, userId: string = "user") => {
  const { updateTask, isUpdating } = useTasks();
  
  const nextStatus = getNextStatus(task.status);
  
  const canAdvance = task.status !== "HECHO";
  
  const advanceStatus = useCallback(async () => {
    if (!canAdvance) return;
    
    const newVersion = {
      id: crypto.randomUUID(),
      previousStatus: task.status,
      newStatus: nextStatus,
      changedAt: new Date().toISOString(),
      changedBy: userId,
    };
    
    await updateTask({
      id: task.id,
      status: nextStatus,
      versions: [...task.versions, newVersion],
    });
  }, [task, nextStatus, userId, updateTask, canAdvance]);
  
  const changeToStatus = useCallback(async (newStatus: TaskStatus) => {
    if (!canTransitionTo(task.status, newStatus)) {
      return;
    }
    
    const newVersion = {
      id: crypto.randomUUID(),
      previousStatus: task.status,
      newStatus,
      changedAt: new Date().toISOString(),
      changedBy: userId,
    };
    
    await updateTask({
      id: task.id,
      status: newStatus,
      versions: [...task.versions, newVersion],
    });
  }, [task, userId, updateTask]);
  
  return {
    nextStatus,
    canAdvance,
    advanceStatus,
    changeToStatus,
    isTransitioning: isUpdating,
  };
};
