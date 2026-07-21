import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Alert } from './Alert';

describe('Alert', () => {
  it('renders with default variant', () => {
    render(<Alert>Message</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('alert');
    expect(alert).toHaveAttribute('data-variant', 'info');
    expect(screen.getByText('Message')).toBeInTheDocument();
  });

  it('renders with title and description', () => {
    render(<Alert variant="success" title="Done">Operation completed</Alert>);
    expect(screen.getByText('Done')).toBeInTheDocument();
    expect(screen.getByText('Operation completed')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveAttribute('data-variant', 'success');
  });

  it('renders all variants', () => {
    const variants = ['info', 'success', 'warning', 'error'] as const;
    variants.forEach(v => {
      const { unmount } = render(<Alert variant={v}>{v}</Alert>);
      expect(screen.getByRole('alert')).toHaveAttribute('data-variant', v);
      unmount();
    });
  });

  it('dismisses when close button is clicked', () => {
    const onDismiss = vi.fn();
    render(<Alert dismissible onDismiss={onDismiss}>Dismiss me</Alert>);
    const closeBtn = screen.getByLabelText('Dismiss');
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('does not show close button when not dismissible', () => {
    render(<Alert>No close</Alert>);
    expect(screen.queryByLabelText('Dismiss')).not.toBeInTheDocument();
  });
});
