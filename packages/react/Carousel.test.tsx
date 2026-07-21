import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Carousel } from './Carousel';

describe('Carousel', () => {
  it('renders slides', () => {
    render(
      <Carousel>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
      </Carousel>
    );
    expect(screen.getByText('Slide 1')).toBeInTheDocument();
    expect(screen.getByText('Slide 2')).toBeInTheDocument();
    expect(screen.getByText('Slide 3')).toBeInTheDocument();
  });

  it('renders navigation arrows', () => {
    render(
      <Carousel>
        <div>A</div>
        <div>B</div>
      </Carousel>
    );
    expect(screen.getByLabelText('Previous slide')).toBeInTheDocument();
    expect(screen.getByLabelText('Next slide')).toBeInTheDocument();
  });

  it('renders dot indicators', () => {
    render(
      <Carousel>
        <div>A</div>
        <div>B</div>
      </Carousel>
    );
    expect(screen.getByLabelText('Go to slide 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to slide 2')).toBeInTheDocument();
  });

  it('hides arrows and dots for single slide', () => {
    render(
      <Carousel>
        <div>Only</div>
      </Carousel>
    );
    expect(screen.queryByLabelText('Previous slide')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Go to slide 1')).not.toBeInTheDocument();
  });

  it('does not show arrows when showArrows is false', () => {
    render(
      <Carousel showArrows={false}>
        <div>A</div>
        <div>B</div>
      </Carousel>
    );
    expect(screen.queryByLabelText('Previous slide')).not.toBeInTheDocument();
  });

  it('marks first dot as active', () => {
    render(
      <Carousel>
        <div>A</div>
        <div>B</div>
      </Carousel>
    );
    expect(screen.getByLabelText('Go to slide 1')).toHaveAttribute('data-state', 'active');
  });
});
