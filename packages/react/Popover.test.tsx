import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Popover } from './Popover';

describe('Popover', () => {
  it('renders trigger', () => {
    render(
      <Popover>
        <button data-testid="trigger">Open</button>
        <div>Popover content</div>
      </Popover>
    );
    expect(screen.getByTestId('trigger')).toBeInTheDocument();
  });

  it('shows content when trigger is clicked', () => {
    render(
      <Popover>
        <button data-testid="trigger">Open</button>
        <div>Popover content</div>
      </Popover>
    );
    expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId('trigger'));
    expect(screen.getByText('Popover content')).toBeInTheDocument();
  });

  it('closes when clicking outside', () => {
    render(
      <div>
        <Popover>
          <button data-testid="trigger">Open</button>
          <div>Content</div>
        </Popover>
        <div data-testid="outside">Outside</div>
      </div>
    );
    fireEvent.click(screen.getByTestId('trigger'));
    expect(screen.getByText('Content')).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });
});
