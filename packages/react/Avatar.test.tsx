import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Avatar, AvatarGroup } from './Avatar';

describe('Avatar', () => {
  it('renders with fallback initials', () => {
    render(<Avatar fallback="John Doe" />);
    const el = screen.getByLabelText('John Doe');
    expect(el).toHaveClass('avatar');
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders single-character fallback', () => {
    render(<Avatar fallback="A" />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('renders default fallback when no fallback', () => {
    render(<Avatar />);
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('renders image', () => {
    render(<Avatar src="https://example.com/av.png" alt="User" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://example.com/av.png');
    expect(img).toHaveAttribute('alt', 'User');
  });

  it('falls back to initials on image error', () => {
    const { container } = render(<Avatar src="invalid.png" fallback="Jane" />);
    const img = container.querySelector('img')!;
    fireEvent.error(img);
    expect(container.querySelector('img')).not.toBeInTheDocument();
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('renders with custom size', () => {
    const { container } = render(<Avatar size="xl" fallback="XL" />);
    expect(container.firstChild).toHaveAttribute('data-size', 'xl');
  });
});

describe('AvatarGroup', () => {
  it('renders multiple avatars', () => {
    render(
      <AvatarGroup>
        <Avatar fallback="A" />
        <Avatar fallback="B" />
        <Avatar fallback="C" />
      </AvatarGroup>
    );
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
  });

  it('shows overflow count when max is exceeded', () => {
    render(
      <AvatarGroup max={2}>
        <Avatar fallback="A" />
        <Avatar fallback="B" />
        <Avatar fallback="C" />
      </AvatarGroup>
    );
    expect(screen.getByText('+1')).toBeInTheDocument();
  });

  it('does not show overflow when within max', () => {
    render(
      <AvatarGroup max={5}>
        <Avatar fallback="A" />
        <Avatar fallback="B" />
      </AvatarGroup>
    );
    expect(screen.queryByText('+')).not.toBeInTheDocument();
  });
});
