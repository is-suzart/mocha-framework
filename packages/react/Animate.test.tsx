import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PrefixProvider } from './PrefixContext';
import { Animate } from './Animate';

const renderWithPrefix = (ui: React.ReactElement) =>
  render(<PrefixProvider prefix="ctp">{ui}</PrefixProvider>);

describe('Animate', () => {
  it('renders children', () => {
    renderWithPrefix(
      <Animate>
        <span data-testid="child">content</span>
      </Animate>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('applies default animation class', () => {
    const { container } = renderWithPrefix(<Animate />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('anim--fade-up');
  });

  it('applies custom animation class', () => {
    const { container } = renderWithPrefix(<Animate animation="scale-in" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('anim--scale-in');
  });

  it('applies duration class when not normal', () => {
    const { container } = renderWithPrefix(<Animate duration="slow" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('anim--duration-slow');
  });

  it('does not apply duration class when normal', () => {
    const { container } = renderWithPrefix(<Animate duration="normal" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).not.toContain('anim--duration');
  });

  it('applies easing class when not default', () => {
    const { container } = renderWithPrefix(<Animate easing="spring" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('anim--ease-spring');
  });

  it('sets delay CSS variable', () => {
    const { container } = renderWithPrefix(<Animate delay={300} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.getPropertyValue('--ctp-anim-delay')).toBe('300ms');
  });

  it('starts with animation paused', () => {
    const { container } = renderWithPrefix(<Animate />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.animationPlayState).toBe('paused');
  });

  it('renders as custom element', () => {
    const { container } = renderWithPrefix(<Animate as="span" />);
    expect(container.firstChild?.nodeName).toBe('SPAN');
  });

  it('merges custom className', () => {
    const { container } = renderWithPrefix(<Animate className="my-class" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('my-class');
  });

  it('applies custom prefix', () => {
    const { container } = render(
      <PrefixProvider prefix="acme">
        <Animate animation="fade-in" />
      </PrefixProvider>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('acme-anim--fade-in');
  });
});
