import React from 'react';

export type IconColor =
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
  | 'lavender'
  | 'text'
  | 'subtext1'
  | 'subtext0'
  | 'overlay2'
  | 'overlay1'
  | 'overlay0'
  | 'surface2'
  | 'surface1'
  | 'surface0';

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'color'> {
  size?: number | string;
  color?: IconColor | string;
  strokeWidth?: number | string;
}

export const resolveIconColor = (color?: string): string => {
  if (!color) return 'currentColor';
  const ctpColors = [
    'rosewater', 'flamingo', 'pink', 'mauve', 'red', 'maroon', 'peach',
    'yellow', 'green', 'teal', 'sky', 'sapphire', 'blue', 'lavender',
    'text', 'subtext1', 'subtext0', 'overlay2', 'overlay1', 'overlay0',
    'surface2', 'surface1', 'surface0'
  ];
  if (ctpColors.includes(color)) {
    return `var(--ctp-${color})`;
  }
  return color;
};
