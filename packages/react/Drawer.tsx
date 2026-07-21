import React from 'react';
import { Overlay } from './Overlay';
import { FormControlColor } from './FormControls';
import { usePrefix } from './PrefixContext';
import { cn, cnEl } from './cn';

export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'full';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  position?: DrawerPosition;
  size?: DrawerSize;
  color?: FormControlColor;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  position = 'right',
  size = 'md',
  color = 'mauve',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  className = '',
}) => {
  const prefix = usePrefix();
  const hasHeader = title || showCloseButton;

  // Classes on the drawer box itself
  const drawerClasses = [
    cn(prefix, 'drawer'),
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Overlay
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={closeOnOverlayClick}
      closeOnEsc={closeOnEsc}
      data-placement={`drawer-${position}`}
    >
      <div
        className={drawerClasses}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title && typeof title === 'string' ? `${prefix}-drawer-title` : undefined}
        data-placement={position}
        data-size={size}
        data-color={color}
      >
        {hasHeader && (
          <div className={cnEl(prefix, 'drawer', 'header')}>
            <div className={cnEl(prefix, 'drawer', 'title')} id={`${prefix}-drawer-title`}>
              {title}
            </div>
            {showCloseButton && (
              <button
                className={cnEl(prefix, 'drawer', 'close-btn')}
                onClick={onClose}
                aria-label="Close drawer"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        )}
        <div className={cnEl(prefix, 'drawer', 'body')}>{children}</div>
        {footer && <div className={cnEl(prefix, 'drawer', 'footer')}>{footer}</div>}
      </div>
    </Overlay>
  );
};
