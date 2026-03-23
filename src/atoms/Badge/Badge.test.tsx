import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders PENDIENTE label and icon', () => {
    render(<Badge status="PENDIENTE" />);
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
    expect(screen.getByText('○')).toBeInTheDocument();
  });

  it('renders HACIENDO label and icon', () => {
    render(<Badge status="HACIENDO" />);
    expect(screen.getByText('En Progreso')).toBeInTheDocument();
    expect(screen.getByText('◐')).toBeInTheDocument();
  });

  it('renders HECHO label and icon', () => {
    render(<Badge status="HECHO" />);
    expect(screen.getByText('Completado')).toBeInTheDocument();
    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('hides icon when showIcon is false', () => {
    render(<Badge status="PENDIENTE" showIcon={false} />);
    expect(screen.queryByText('○')).not.toBeInTheDocument();
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
  });

  it('applies status-based CSS class', () => {
    const { container } = render(<Badge status="PENDIENTE" />);
    expect(container.firstChild).toHaveClass('atom-badge--pendiente');
  });

  it('applies size class', () => {
    const { container } = render(<Badge status="HECHO" size="lg" />);
    expect(container.firstChild).toHaveClass('atom-badge--lg');
  });

  it('defaults to md size', () => {
    const { container } = render(<Badge status="HECHO" />);
    expect(container.firstChild).toHaveClass('atom-badge--md');
  });
});
