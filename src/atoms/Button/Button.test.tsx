import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders children text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies default variant and size classes', () => {
    const { container } = render(<Button>Test</Button>);
    const btn = container.querySelector('button')!;
    expect(btn).toHaveClass('atom-button--primary', 'atom-button--md');
  });

  it('applies custom variant class', () => {
    const { container } = render(<Button variant="danger">Delete</Button>);
    expect(container.querySelector('button')).toHaveClass('atom-button--danger');
  });

  it('applies custom size class', () => {
    const { container } = render(<Button size="lg">Big</Button>);
    expect(container.querySelector('button')).toHaveClass('atom-button--lg');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows spinner and is disabled when isLoading', () => {
    const { container } = render(<Button isLoading>Save</Button>);
    const btn = container.querySelector('button')!;
    expect(btn).toBeDisabled();
    expect(btn).toHaveClass('atom-button--loading');
    expect(container.querySelector('.atom-button__spinner')).toBeInTheDocument();
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
  });

  it('renders leftIcon when provided', () => {
    render(<Button leftIcon={<span data-testid="left-icon" />}>Go</Button>);
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
  });

  it('renders rightIcon when provided', () => {
    render(<Button rightIcon={<span data-testid="right-icon" />}>Go</Button>);
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handler = vi.fn();
    render(<Button onClick={handler}>Click</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', async () => {
    const handler = vi.fn();
    render(<Button onClick={handler} disabled>Click</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(handler).not.toHaveBeenCalled();
  });

  it('applies additional className', () => {
    const { container } = render(<Button className="extra">Test</Button>);
    expect(container.querySelector('button')).toHaveClass('extra');
  });
});
