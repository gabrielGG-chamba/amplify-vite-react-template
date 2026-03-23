import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
  it('renders without label', () => {
    const { container } = render(<Input placeholder="Enter text" />);
    expect(container.querySelector('input')).toBeInTheDocument();
    expect(container.querySelector('label')).not.toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<Input label="Username" />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });

  it('label is associated with input via htmlFor', () => {
    render(<Input label="Email" id="email-input" />);
    const label = screen.getByText('Email');
    expect(label).toHaveAttribute('for', 'email-input');
  });

  it('shows error message and applies error class', () => {
    const { container } = render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('atom-input--error');
  });

  it('shows helper text when no error', () => {
    render(<Input helperText="Max 100 chars" />);
    expect(screen.getByText('Max 100 chars')).toBeInTheDocument();
  });

  it('hides helper text when error is present', () => {
    render(<Input error="Required" helperText="Max 100 chars" />);
    expect(screen.queryByText('Max 100 chars')).not.toBeInTheDocument();
  });

  it('renders left icon', () => {
    render(<Input leftIcon={<span data-testid="left-icon" />} />);
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
  });

  it('renders right icon', () => {
    render(<Input rightIcon={<span data-testid="right-icon" />} />);
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('applies icon modifier classes on input field', () => {
    const { container } = render(
      <Input leftIcon={<span />} rightIcon={<span />} />
    );
    const input = container.querySelector('input')!;
    expect(input).toHaveClass('atom-input__field--has-left-icon', 'atom-input__field--has-right-icon');
  });

  it('calls onChange when typing', async () => {
    const handler = vi.fn();
    render(<Input onChange={handler} />);
    await userEvent.type(screen.getByRole('textbox'), 'hello');
    expect(handler).toHaveBeenCalled();
  });

  it('is disabled when disabled prop is passed', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('forwards ref to the input element', () => {
    const ref = vi.fn();
    render(<Input ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement));
  });
});
