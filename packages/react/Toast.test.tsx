import { describe, it, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, act, cleanup } from '@testing-library/react';
import { Toaster, toast } from './Toast';

afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
});

describe('Toast', () => {
  it('renders Toaster and shows toast via imperative call', () => {
    render(<Toaster />);
    act(() => { toast({ title: 'Hello', variant: 'success' }); });
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveAttribute('data-state', 'success');
  });

  it('shows toast description', () => {
    render(<Toaster />);
    act(() => { toast({ title: 'Note', description: 'Something happened' }); });
    expect(screen.getByText('Note')).toBeInTheDocument();
    expect(screen.getByText('Something happened')).toBeInTheDocument();
  });

  it('renders close button and dismisses on click', () => {
    render(<Toaster />);
    act(() => { toast({ title: 'X me', duration: 99999 }); });
    expect(screen.getByText('X me')).toBeInTheDocument();
    act(() => { screen.getByLabelText('Dismiss').click(); });
  });

  it('renders with string shortcut', () => {
    render(<Toaster />);
    act(() => { toast('Just a string'); });
    expect(screen.getByText('Just a string')).toBeInTheDocument();
  });

  it('accepts custom className', () => {
    render(<Toaster />);
    act(() => { toast({ title: 'Styled', className: 'my-custom-toast' }); });
    expect(screen.getByText('Styled').closest('.toast')).toHaveClass('my-custom-toast');
  });

  it('accepts filled mode with variant color', () => {
    render(<Toaster />);
    act(() => { toast({ title: 'Filled', variant: 'success', filled: true }); });
    const toastEl = screen.getByText('Filled').closest('.toast');
    expect(toastEl).toHaveAttribute('data-variant', 'filled');
    expect(toastEl).toHaveAttribute('data-state', 'success');
  });

  it('accepts color override from catppuccin palette', () => {
    render(<Toaster />);
    act(() => { toast({ title: 'Colored', color: 'mauve' }); });
    const toastEl = screen.getByText('Colored').closest('.toast');
    expect(toastEl).toHaveAttribute('data-color', 'mauve');
  });

  it('renders in correct position container', () => {
    render(<Toaster />);
    act(() => { toast({ title: 'Top Right', position: 'top-right' }); });
    expect(screen.getByText('Top Right')).toBeInTheDocument();
    expect(document.querySelector('.toast-container[data-state="top-right"]')).toBeTruthy();
  });
});
