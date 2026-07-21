import React from 'react';
import { usePrefix } from './PrefixContext';
import { cn, cnEl } from './cn';

export type ButtonVariant = 'filled' | 'tonal' | 'outline' | 'ghost';
export type ButtonColor =
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
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonShape = 'square' | 'rounded' | 'pill';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  shape?: ButtonShape;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'filled',
      color = 'mauve',
      size = 'md',
      shape = 'rounded',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const prefix = usePrefix();
    const classNames = [
      cn(prefix, 'btn'),
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={classNames}
        disabled={disabled || isLoading}
        data-variant={variant}
        data-color={color}
        data-size={size}
        data-shape={shape}
        data-state={isLoading ? 'loading' : undefined}
        {...props}
      >
        <span className={cnEl(prefix, 'btn', 'content')}>
          {isLoading && <span className={cnEl(prefix, 'btn', 'spinner')} aria-hidden="true" />}
          {!isLoading && leftIcon && <span className={cnEl(prefix, 'btn', 'icon-left')} style={{ display: 'inline-flex', alignItems: 'center' }}>{leftIcon}</span>}
          {children}
          {!isLoading && rightIcon && <span className={cnEl(prefix, 'btn', 'icon-right')} style={{ display: 'inline-flex', alignItems: 'center' }}>{rightIcon}</span>}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';
