import React from 'react';
import { Overlay } from './Overlay';
import { usePrefix } from './PrefixContext';
import { cn, cnEl } from './cn';

export type ModalSize = 'sm' | 'md' | 'lg';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseButton = true,
}) => {
  const prefix = usePrefix();
  const hasHeader = title || showCloseButton;

  return (
    <Overlay
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={closeOnOverlayClick}
      closeOnEsc={closeOnEsc}
    >
      <div
        className={cn(prefix, 'modal')} data-size={size}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title && typeof title === 'string' ? `${prefix}-modal-title` : undefined}
      >
        {hasHeader && (
          <div className={cnEl(prefix, 'modal', 'header')}>
            <div className={cnEl(prefix, 'modal', 'title')} id={`${prefix}-modal-title`}>
              {title}
            </div>
            {showCloseButton && (
              <button
                className={cnEl(prefix, 'modal', 'close-btn')}
                onClick={onClose}
                aria-label="Close modal"
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
        <div className={cnEl(prefix, 'modal', 'body')}>{children}</div>
        {footer && <div className={cnEl(prefix, 'modal', 'footer')}>{footer}</div>}
      </div>
    </Overlay>
  );
};
