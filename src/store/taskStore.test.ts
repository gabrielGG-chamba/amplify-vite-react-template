import { describe, it, expect, beforeEach } from 'vitest';
import { useTaskStore } from './taskStore';

describe('useTaskStore', () => {
  beforeEach(() => {
    useTaskStore.setState({ isFormOpen: false });
  });

  it('initial state has isFormOpen as false', () => {
    expect(useTaskStore.getState().isFormOpen).toBe(false);
  });

  it('openForm sets isFormOpen to true', () => {
    useTaskStore.getState().openForm();
    expect(useTaskStore.getState().isFormOpen).toBe(true);
  });

  it('closeForm sets isFormOpen to false', () => {
    useTaskStore.setState({ isFormOpen: true });
    useTaskStore.getState().closeForm();
    expect(useTaskStore.getState().isFormOpen).toBe(false);
  });

  it('openForm then closeForm returns to false', () => {
    useTaskStore.getState().openForm();
    useTaskStore.getState().closeForm();
    expect(useTaskStore.getState().isFormOpen).toBe(false);
  });
});
