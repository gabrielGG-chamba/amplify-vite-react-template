import { create } from "zustand";
import type { TaskStatus, TaskFilter } from "../@types/task.types";

interface TaskStore {
  selectedTaskId: string | null;
  filter: TaskFilter;
  isFormOpen: boolean;
  isHistoryOpen: boolean;
  searchQuery: string;
  
  setSelectedTaskId: (id: string | null) => void;
  setFilter: (filter: TaskFilter) => void;
  setStatusFilter: (status: TaskStatus | undefined) => void;
  openForm: () => void;
  closeForm: () => void;
  openHistory: (taskId: string) => void;
  closeHistory: () => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  selectedTaskId: null,
  filter: {},
  isFormOpen: false,
  isHistoryOpen: false,
  searchQuery: "",
  
  setSelectedTaskId: (id) => set({ selectedTaskId: id }),
  
  setFilter: (filter) => set({ filter }),
  
  setStatusFilter: (status) =>
    set((state) => ({
      filter: { ...state.filter, status },
    })),
  
  openForm: () => set({ isFormOpen: true }),
  
  closeForm: () => set({ isFormOpen: false }),
  
  openHistory: (taskId) =>
    set({ isHistoryOpen: true, selectedTaskId: taskId }),
  
  closeHistory: () =>
    set({ isHistoryOpen: false, selectedTaskId: null }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  resetFilters: () =>
    set({ filter: {}, searchQuery: "" }),
}));
