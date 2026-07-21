import React from 'react';
import { usePrefix } from './PrefixContext';
import { cn } from './cn';

export type StepsVariant = 'timeline' | 'carousel';
export type StepsColor =
  | 'rosewater'
  | 'flamingo'
  | 'pink'
  | 'mauve'
  | 'red'
  | 'maroon'
  | 'peach'
  | 'yellow'
  | 'green'
  | 'teal'
  | 'sky'
  | 'sapphire'
  | 'blue'
  | 'lavender';

export interface StepsProps {
  currentStep: number;
  stepsCount: number;
  labels?: string[];
  variant?: StepsVariant;
  color?: StepsColor;
  onChangeStep?: (step: number) => void;
  orientation?: 'horizontal' | 'vertical';
}

export const Steps: React.FC<StepsProps> = ({
  currentStep,
  stepsCount,
  labels = [],
  variant = 'timeline',
  color = 'mauve',
  onChangeStep,
  orientation = 'horizontal',
}) => {
  const prefix = usePrefix();
  const handleStepClick = (index: number) => {
    if (onChangeStep) {
      onChangeStep(index);
    }
  };

  const stepsClass = '';

  if (variant === 'carousel') {
    return (
      <div className={cn(prefix, 'steps-carousel')} data-color={color}>
        {Array.from({ length: stepsCount }).map((_, index) => (
          <button
            key={index}
            className={cn(prefix, 'steps-carousel-dot', [index === currentStep ? 'active' : ''].filter(Boolean))}
            onClick={() => handleStepClick(index)}
            aria-label={`Go to step ${index + 1}`}
          />
        ))}
      </div>
    );
  }

  // timeline variant
  const isVertical = orientation === 'vertical';
  const progressWidth = stepsCount > 1 ? (currentStep / (stepsCount - 1)) * 100 : 0;
  const progressStyle = isVertical
    ? { height: `${progressWidth}%` }
    : { width: `${progressWidth}%` };

  const timelineClasses = cn(prefix, 'steps-timeline');

  return (
    <div className={timelineClasses} data-orientation={orientation} data-color={color}>
      <div className={`${prefix}-steps-track`}>
        <div
          className={`${prefix}-steps-progress`}
          style={progressStyle}
        />
      </div>

      {Array.from({ length: stepsCount }).map((_, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const itemClass = `${prefix}-steps-item`;

        return (
          <button
            key={index}
            className={itemClass} data-state={isActive ? 'active' : (isCompleted ? 'completed' : undefined)}
            onClick={() => handleStepClick(index)}
            aria-label={`Step ${index + 1}`}
          >
            <div className={`${prefix}-steps-dot`} />
            {labels[index] && <span className={`${prefix}-steps-label`}>{labels[index]}</span>}
          </button>
        );
      })}
    </div>
  );
};
