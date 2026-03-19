import type { Task } from "../@types/task.types";

export const useTaskVersions = (task: Task) => {
  const sortedVersions = [...task.versions].sort(
    (a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
  );
  
  const getVersionStatus = (index: number): "initial" | "change" | "current" => {
    if (index === 0 && task.versions.length === 1) return "initial";
    if (index === task.versions.length - 1) return "current";
    return "change";
  };
  
  const getVersionMessage = (version: Task["versions"][0], index: number): string => {
    if (index === 0 && task.versions.length === 1) {
      return `Tarea creada con estado "${version.newStatus}"`;
    }
    
    if (index === task.versions.length - 1) {
      return `Estado actual: "${version.newStatus}"`;
    }
    
    return `Cambió de "${version.previousStatus}" a "${version.newStatus}"`;
  };
  
  return {
    versions: sortedVersions,
    totalVersions: task.versions.length,
    getVersionStatus,
    getVersionMessage,
  };
};
