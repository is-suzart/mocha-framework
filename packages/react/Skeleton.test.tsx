import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('renders with default props', () => {
    const { container } = render(<Skeleton />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass('skeleton');
    expect(el).toHaveAttribute('data-variant', 'text');
    expect(el).toHaveAttribute('data-size', 'md');
    expect(el).toHaveAttribute('data-full', 'true');
    expect(el).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders with custom variant', () => {
    const { container } = render(<Skeleton variant="circle" />);
    expect(container.firstChild).toHaveAttribute('data-variant', 'circle');
  });

  it('renders with custom size', () => {
    const { container } = render(<Skeleton size="lg" />);
    expect(container.firstChild).toHaveAttribute('data-size', 'lg');
  });

  it('renders without animation', () => {
    const { container } = render(<Skeleton animated={false} />);
    expect(container.firstChild).toHaveAttribute('data-animated', 'false');
  });

  it('renders with custom width and height', () => {
    const { container } = render(<Skeleton width="100px" height="50px" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe('100px');
    expect(el.style.height).toBe('50px');
  });

  it('renders multiple skeletons with count', () => {
    const { container } = render(<Skeleton count={3} />);
    const group = container.firstChild as HTMLElement;
    expect(group.children.length).toBe(3);
  });

  it('renders children', () => {
    render(<Skeleton><span data-testid="child">content</span></Skeleton>);
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
