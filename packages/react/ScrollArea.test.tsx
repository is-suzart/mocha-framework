import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScrollArea } from './ScrollArea';

describe('ScrollArea', () => {
  it('renders children', () => {
    render(<ScrollArea><p data-testid="content">Scrolled</p></ScrollArea>);
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.getByText('Scrolled')).toBeInTheDocument();
  });

  it('has correct class', () => {
    const { container } = render(<ScrollArea>Content</ScrollArea>);
    expect(container.firstChild).toHaveClass('scroll-area');
  });
});
