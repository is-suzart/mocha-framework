import React from 'react';
import { usePrefix } from './PrefixContext';
import { cn, cnEl } from './cn';

export type CardVariant = 'filled' | 'elevated' | 'outline' | 'flat' | 'colored';
export type CardShape = 'square' | 'rounded' | 'pill';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';
export type CardAccentColor =
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
export type CardAccentPosition = 'top' | 'left' | 'none';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  shape?: CardShape;
  padding?: CardPadding;
  accentColor?: CardAccentColor;
  accentPosition?: CardAccentPosition;
  isInteractive?: boolean;
}

export const Card: React.FC<CardProps> & {
  Header: React.FC<CardHeaderProps>;
  Body: React.FC<CardBodyProps>;
  Footer: React.FC<CardFooterProps>;
  Media: React.FC<CardMediaProps>;
} = ({
  variant = 'filled',
  shape = 'rounded',
  padding = 'md',
  accentColor,
  accentPosition = 'none',
  isInteractive = false,
  className = '',
  children,
  ...props
}) => {
  const prefix = usePrefix();
  const classNames = [
    cn(prefix, 'card'),
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classNames}
      data-variant={variant}
      data-shape={shape}
      data-padding={padding}
      data-color={accentColor}
      data-accent={accentColor && accentPosition !== 'none' ? accentPosition : undefined}
      data-interactive={isInteractive ? "true" : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  avatar?: React.ReactNode;
  actions?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  avatar,
  actions,
  className = '',
  children,
  ...props
}) => {
  const prefix = usePrefix();
  return (
    <div className={`${cnEl(prefix, 'card', 'header')} ${className}`} {...props}>
      {avatar && <div className={cnEl(prefix, 'card', 'avatar')}>{avatar}</div>}
      {(title || subtitle) && (
        <div className={cnEl(prefix, 'card', 'header-content')}>
          {title && <h3 className={cnEl(prefix, 'card', 'title')}>{title}</h3>}
          {subtitle && <p className={cnEl(prefix, 'card', 'subtitle')}>{subtitle}</p>}
        </div>
      )}
      {children}
      {actions && <div className={cnEl(prefix, 'card', 'actions')}>{actions}</div>}
    </div>
  );
};

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardBody: React.FC<CardBodyProps> = ({ className = '', children, ...props }) => {
  const prefix = usePrefix();
  return (
    <div className={`${cnEl(prefix, 'card', 'body')} ${className}`} {...props}>
      {children}
    </div>
  );
};

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter: React.FC<CardFooterProps> = ({ className = '', children, ...props }) => {
  const prefix = usePrefix();
  return (
    <div className={`${cnEl(prefix, 'card', 'footer')} ${className}`} {...props}>
      {children}
    </div>
  );
};

export interface CardMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
}

export const CardMedia: React.FC<CardMediaProps> = ({ src, alt = '', className = '', children, ...props }) => {
  const prefix = usePrefix();
  return (
    <div className={`${cnEl(prefix, 'card', 'media')} ${className}`} {...props}>
      {src ? <img src={src} alt={alt} /> : children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Media = CardMedia;

Card.displayName = 'Card';
CardHeader.displayName = 'Card.Header';
CardBody.displayName = 'Card.Body';
CardFooter.displayName = 'Card.Footer';
CardMedia.displayName = 'Card.Media';
