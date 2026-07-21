import React, { ReactNode } from 'react';
import { usePrefix } from './PrefixContext';
import { cn, cnEl } from './cn';

export type GridGap = 0 | 1 | 2 | 3 | 4 | 5;
export type GridAlign = 'start' | 'center' | 'end' | 'space-between' | 'space-around';
export type GridValign = 'start' | 'center' | 'end';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  mobile?: boolean;
  multiline?: boolean;
  gap?: GridGap;
  align?: GridAlign;
  valign?: GridValign;
  children: ReactNode;
  className?: string;
}

export interface GridColProps extends React.HTMLAttributes<HTMLDivElement> {
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  sm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  lg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  offset?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  smOffset?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  mdOffset?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  lgOffset?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  children?: ReactNode;
  className?: string;
}

export const Grid: React.FC<GridProps> & {
  Col: React.FC<GridColProps>;
} = ({
  mobile = false,
  multiline = true,
  gap = 3,
  align,
  valign,
  children,
  className = '',
  ...props
}) => {
  const prefix = usePrefix();
  const classes = cn(prefix, 'grid', [
    mobile ? 'mobile' : undefined,
    multiline ? 'multiline' : undefined,
    `gap-${gap}`,
    align ? `align-${align}` : undefined,
    valign ? `valign-${valign}` : undefined,
  ]) + (className ? ` ${className}` : '');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

const GridCol: React.FC<GridColProps> = ({
  span,
  sm,
  md,
  lg,
  offset,
  smOffset,
  mdOffset,
  lgOffset,
  children,
  className = '',
  ...props
}) => {
  const prefix = usePrefix();
  const classes = [
    `${prefix}-grid-col`,
    span ? `${prefix}-grid-col-${span}` : '',
    sm ? `${prefix}-grid-col-sm-${sm}` : '',
    md ? `${prefix}-grid-col-md-${md}` : '',
    lg ? `${prefix}-grid-col-lg-${lg}` : '',
    offset ? `${prefix}-grid-col-offset-${offset}` : '',
    smOffset ? `${prefix}-grid-col-sm-offset-${smOffset}` : '',
    mdOffset ? `${prefix}-grid-col-md-offset-${mdOffset}` : '',
    lgOffset ? `${prefix}-grid-col-lg-offset-${lgOffset}` : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

Grid.Col = GridCol;
