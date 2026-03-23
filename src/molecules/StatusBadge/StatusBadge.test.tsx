import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from './StatusBadge';

vi.mock('./StatusBadge.scss', () => ({}));

describe('StatusBadge', () => {
  it('renders PENDIENTE with correct icon and label', () => {
    render(<StatusBadge status="PENDIENTE" />);
    expect(screen.getByText('○')).toBeInTheDocument();
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
  });

  it('renders HACIENDO with correct icon and label', () => {
    render(<StatusBadge status="HACIENDO" />);
    expect(screen.getByText('◐')).toBeInTheDocument();
    expect(screen.getByText('En Progreso')).toBeInTheDocument();
  });

  it('renders HECHO with correct icon and label', () => {
    render(<StatusBadge status="HECHO" />);
    expect(screen.getByText('✓')).toBeInTheDocument();
    expect(screen.getByText('Completado')).toBeInTheDocument();
  });

  it('hides label when showLabel is false', () => {
    render(<StatusBadge status="PENDIENTE" showLabel={false} />);
    expect(screen.queryByText('Pendiente')).not.toBeInTheDocument();
    expect(screen.getByText('○')).toBeInTheDocument();
  });

  it('applies status class to container', () => {
    const { container } = render(<StatusBadge status="HACIENDO" />);
    expect(container.firstChild).toHaveClass('molecule-status-badge--haciendo');
  });

  it('applies size class', () => {
    const { container } = render(<StatusBadge status="HECHO" size="sm" />);
    expect(container.firstChild).toHaveClass('molecule-status-badge--sm');
  });

  it('applies animated class when animated is true', () => {
    const { container } = render(<StatusBadge status="PENDIENTE" animated />);
    const icon = container.querySelector('.molecule-status-badge__icon');
    expect(icon).toHaveClass('molecule-status-badge__icon--animated');
  });

  it('does not apply animated class by default', () => {
    const { container } = render(<StatusBadge status="PENDIENTE" />);
    const icon = container.querySelector('.molecule-status-badge__icon');
    expect(icon).not.toHaveClass('molecule-status-badge__icon--animated');
  });
});
