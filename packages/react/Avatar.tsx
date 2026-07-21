import React, { useState } from 'react';
import { usePrefix } from './PrefixContext';
import { cn, cnEl } from './cn';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: AvatarSize;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  fallback,
  size = 'md',
  className = '',
}) => {
  const prefix = usePrefix();
  const [imgError, setImgError] = useState(false);
  const showImage = src && !imgError;

  const initials = fallback && !showImage
    ? (fallback.length <= 2 ? fallback : getInitials(fallback))
    : null;

  return (
    <div className={`${cn(prefix, 'avatar')} ${className}`} data-size={size} aria-label={alt || fallback || 'Avatar'}>
      {showImage ? (
        <img src={src} alt={alt} onError={() => setImgError(true)} />
      ) : (
        <span className={cnEl(prefix, 'avatar', 'fallback')}>{initials || '?'}</span>
      )}
    </div>
  );
};

Avatar.displayName = 'Avatar';

export interface AvatarGroupProps {
  children: React.ReactNode;
  size?: AvatarSize;
  max?: number;
  className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  children,
  size = 'md',
  max,
  className = '',
}) => {
  const items = React.Children.toArray(children).filter(Boolean);
  const visible = max ? items.slice(0, max) : items;
  const prefix = usePrefix();
  const remaining = max ? Math.max(0, items.length - max) : 0;

  return (
    <div className={`${cn(prefix, 'avatar-group')} ${className}`} data-size={size}>
      {React.Children.map(visible, (child, i) =>
        React.cloneElement(child as React.ReactElement<{ size?: AvatarSize }>, { size, key: i })
      )}
      {remaining > 0 && (
        <span className={cnEl(prefix, 'avatar-group', 'more')} style={{ width: size === 'sm' ? 28 : size === 'lg' ? 48 : 36, height: size === 'sm' ? 28 : size === 'lg' ? 48 : 36 }}>
          +{remaining}
        </span>
      )}
    </div>
  );
};

AvatarGroup.displayName = 'AvatarGroup';
