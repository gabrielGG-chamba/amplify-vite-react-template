import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Card } from './Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies default variant and padding classes', () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.firstChild).toHaveClass('atom-card--default', 'atom-card--padding-md');
  });

  it('applies elevated variant class', () => {
    const { container } = render(<Card variant="elevated">Content</Card>);
    expect(container.firstChild).toHaveClass('atom-card--elevated');
  });

  it('applies outlined variant class', () => {
    const { container } = render(<Card variant="outlined">Content</Card>);
    expect(container.firstChild).toHaveClass('atom-card--outlined');
  });

  it('applies padding class', () => {
    const { container } = render(<Card padding="lg">Content</Card>);
    expect(container.firstChild).toHaveClass('atom-card--padding-lg');
  });

  it('applies hoverable class when hoverable is true', () => {
    const { container } = render(<Card hoverable>Content</Card>);
    expect(container.firstChild).toHaveClass('atom-card--hoverable');
  });

  it('applies clickable class and role when onClick is provided', () => {
    const { container } = render(<Card onClick={vi.fn()}>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('atom-card--clickable');
    expect(card).toHaveAttribute('role', 'button');
    expect(card).toHaveAttribute('tabindex', '0');
  });

  it('has no role or tabindex without onClick', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).not.toHaveAttribute('role');
    expect(card).not.toHaveAttribute('tabindex');
  });

  it('calls onClick when clicked', async () => {
    const handler = vi.fn();
    render(<Card onClick={handler}>Click me</Card>);
    await userEvent.click(screen.getByText('Click me'));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('calls onClick on Enter key', async () => {
    const handler = vi.fn();
    render(<Card onClick={handler}>Press Enter</Card>);
    const card = screen.getByRole('button');
    card.focus();
    await userEvent.keyboard('{Enter}');
    expect(handler).toHaveBeenCalledOnce();
  });

  it('calls onClick on Space key', async () => {
    const handler = vi.fn();
    render(<Card onClick={handler}>Press Space</Card>);
    const card = screen.getByRole('button');
    card.focus();
    await userEvent.keyboard(' ');
    expect(handler).toHaveBeenCalledOnce();
  });

  it('applies additional className', () => {
    const { container } = render(<Card className="custom">Content</Card>);
    expect(container.firstChild).toHaveClass('custom');
  });
});
