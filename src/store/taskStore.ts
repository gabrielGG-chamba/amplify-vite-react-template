import { create } from "zustand";

interface TaskStore {
  isFormOpen: boolean;
  openForm: () => void;
  closeForm: () => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  isFormOpen: false,
  openForm: () => set({ isFormOpen: true }),
  closeForm: () => set({ isFormOpen: false }),
}));
