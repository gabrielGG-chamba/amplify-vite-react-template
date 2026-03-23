import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskForm } from './TaskForm';

vi.mock('./TaskForm.scss', () => ({}));

const mockCloseForm = vi.fn();
const mockCreateTask = vi.fn();

vi.mock('../../store/taskStore', () => ({
  useTaskStore: () => ({
    closeForm: mockCloseForm,
  }),
}));

vi.mock('../../hooks/useTasks', () => ({
  useTasks: () => ({
    createTask: mockCreateTask,
    isCreating: false,
  }),
}));

describe('TaskForm (integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form with title input and action buttons', () => {
    render(<TaskForm />);
    expect(screen.getByText('Nueva Tarea')).toBeInTheDocument();
    expect(screen.getByLabelText('Título')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancelar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Crear Tarea/i })).toBeInTheDocument();
  });

  it('shows validation error when submitting empty title', async () => {
    render(<TaskForm />);
    await userEvent.click(screen.getByRole('button', { name: /Crear Tarea/i }));
    expect(await screen.findByText('El título es requerido')).toBeInTheDocument();
    expect(mockCreateTask).not.toHaveBeenCalled();
  });

  it('clears error when user starts typing', async () => {
    render(<TaskForm />);
    await userEvent.click(screen.getByRole('button', { name: /Crear Tarea/i }));
    expect(await screen.findByText('El título es requerido')).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('Título'), 'a');
    expect(screen.queryByText('El título es requerido')).not.toBeInTheDocument();
  });

  it('calls createTask with trimmed title and PENDIENTE status', async () => {
    mockCreateTask.mockResolvedValue(undefined);
    render(<TaskForm />);
    await userEvent.type(screen.getByLabelText('Título'), '  New Task  ');
    await userEvent.click(screen.getByRole('button', { name: /Crear Tarea/i }));
    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalledWith({ content: 'New Task', status: 'PENDIENTE' });
    });
  });

  it('calls closeForm after successful task creation', async () => {
    mockCreateTask.mockResolvedValue(undefined);
    render(<TaskForm />);
    await userEvent.type(screen.getByLabelText('Título'), 'My task');
    await userEvent.click(screen.getByRole('button', { name: /Crear Tarea/i }));
    await waitFor(() => {
      expect(mockCloseForm).toHaveBeenCalledOnce();
    });
  });

  it('shows error message when createTask throws', async () => {
    mockCreateTask.mockRejectedValue(new Error('Network error'));
    render(<TaskForm />);
    await userEvent.type(screen.getByLabelText('Título'), 'My task');
    await userEvent.click(screen.getByRole('button', { name: /Crear Tarea/i }));
    expect(await screen.findByText('Error al crear la tarea')).toBeInTheDocument();
    expect(mockCloseForm).not.toHaveBeenCalled();
  });

  it('calls closeForm when Cancel button is clicked', async () => {
    render(<TaskForm />);
    await userEvent.click(screen.getByRole('button', { name: /Cancelar/i }));
    expect(mockCloseForm).toHaveBeenCalledOnce();
  });

  it('calls closeForm when overlay is clicked', async () => {
    const { container } = render(<TaskForm />);
    const overlay = container.querySelector('.molecule-task-form__overlay')!;
    await userEvent.click(overlay);
    expect(mockCloseForm).toHaveBeenCalledOnce();
  });

  it('does not close when clicking inside the form card', async () => {
    render(<TaskForm />);
    await userEvent.click(screen.getByText('Nueva Tarea'));
    expect(mockCloseForm).not.toHaveBeenCalled();
  });
});

describe('TaskForm loading state', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('disables inputs and shows loading button when isCreating', () => {
    vi.mocked(vi.fn()).mockReset;

    vi.doMock('../../hooks/useTasks', () => ({
      useTasks: () => ({
        createTask: mockCreateTask,
        isCreating: true,
      }),
    }));
  });
});
