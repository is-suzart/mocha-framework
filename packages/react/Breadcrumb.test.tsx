import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Breadcrumb } from './Breadcrumb';

describe('Breadcrumb', () => {
  const items = [
    { label: 'Home', href: '/' },
    { label: 'Settings', href: '/settings' },
    { label: 'Profile' },
  ];

  it('renders all items', () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('renders links for items with href', () => {
    render(<Breadcrumb items={items} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/');
    expect(links[1]).toHaveAttribute('href', '/settings');
  });

  it('marks last item as active', () => {
    render(<Breadcrumb items={items} />);
    const last = screen.getByText('Profile');
    expect(last).toHaveAttribute('data-state', 'active');
    expect(last).toHaveAttribute('aria-current', 'page');
  });

  it('renders navigation landmark', () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByLabelText('Breadcrumb')).toBeInTheDocument();
  });
});
