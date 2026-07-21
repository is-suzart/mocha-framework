import React from 'react';
import { usePrefix } from './PrefixContext';
import { cn, cnEl } from './cn';

export interface StepsSliderProps {
  currentStep: number;
  children: React.ReactNode;
}

export const StepsSlider: React.FC<StepsSliderProps> = ({ currentStep, children }) => {
  const prefix = usePrefix();
  const childrenArray = React.Children.toArray(children);

  return (
    <div className={cn(prefix, 'steps-content-wrapper')}>
      <div
        className={cnEl(prefix, 'steps-content', 'stage')}
        style={{ transform: `translateX(-${currentStep * 100}%)` }}
      >
        {childrenArray.map((child, index) => (
          <div
            key={index}
            className={`${cnEl(prefix, 'steps-content', 'slide')}${
              index === currentStep ? ` ${prefix}-steps-content-slide--active` : ''
            }`}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};
