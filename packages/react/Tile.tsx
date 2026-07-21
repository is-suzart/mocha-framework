import React from 'react';
import { usePrefix } from './PrefixContext';
import { cn, cnEl } from './cn';

export type TileVariant = 'flat' | 'elevated' | 'outline' | 'tonal' | 'colored';
export type TileSize = 'sm' | 'md' | 'lg';
export type TileShape = 'square' | 'rounded' | 'pill';
export type TileOrientation = 'horizontal' | 'vertical' | 'vertical-center';
export type TileIndicator = 'none' | 'top' | 'bottom' | 'left' | 'right';
export type TileColor =
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

export interface TileProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: TileVariant;
  size?: TileSize;
  shape?: TileShape;
  orientation?: TileOrientation;
  color?: TileColor;
  indicator?: TileIndicator;
  isInteractive?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  icon?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  meta?: React.ReactNode;
}

export const Tile: React.FC<TileProps> = ({
  variant = 'flat',
  size = 'md',
  shape = 'rounded',
  orientation = 'horizontal',
  color = 'mauve',
  indicator = 'none',
  isInteractive = false,
  isSelected = false,
  isDisabled = false,
  icon,
  title,
  subtitle,
  meta,
  className = '',
  children,
  ...props
}) => {
  const prefix = usePrefix();
  const classNames = [
    cn(prefix, 'tile', [
      variant,
      size,
      shape,
      orientation,
      color,
      indicator !== 'none' ? `indicator-${indicator}` : undefined,
      isInteractive ? 'interactive' : undefined,
      isSelected ? 'selected' : undefined,
      isDisabled ? 'disabled' : undefined,
    ]),
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} {...props}>
      {children ? (
        children
      ) : (
        <>
          {icon && <div className={cnEl(prefix, 'tile', 'icon')}>{icon}</div>}
          {(title || subtitle) && (
            <div className={cnEl(prefix, 'tile', 'content')}>
              {title && <span className={cnEl(prefix, 'tile', 'title')}>{title}</span>}
              {subtitle && <span className={cnEl(prefix, 'tile', 'subtitle')}>{subtitle}</span>}
            </div>
          )}
          {meta && <div className={cnEl(prefix, 'tile', 'meta')}>{meta}</div>}
        </>
      )}
    </div>
  );
};

Tile.displayName = 'Tile';
