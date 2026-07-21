import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { usePrefix } from './PrefixContext';
import { cn } from './cn';

export interface OverlayProps {
  isOpen: boolean;
  onClose?: () => void;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  children: React.ReactNode;
  className?: string;
  'data-placement'?: string;
}

// Module-level count of open overlays for z-index stacking
let activeOverlayCount = 0;

export const Overlay: React.FC<OverlayProps> = ({
  isOpen,
  onClose,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  children,
  className = '',
  'data-placement': dataPlacement,
}) => {
  const prefix = usePrefix();
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimatedIn, setIsAnimatedIn] = useState(false);
  const [zIndex, setZIndex] = useState(1000);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isOpen) {
      activeOverlayCount++;
      setZIndex(1000 + activeOverlayCount);
      setShouldRender(true);

      // Wait a micro-frame to apply the CSS transition class
      timeoutId = setTimeout(() => {
        setIsAnimatedIn(true);
      }, 10);
    } else {
      setIsAnimatedIn(false);
      // Wait for CSS transition (200ms) to complete before unmounting
      timeoutId = setTimeout(() => {
        setShouldRender(false);
        if (activeOverlayCount > 0) {
          activeOverlayCount--;
        }
      }, 200);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && onClose && closeOnEsc) {
        // Only close if this is the top-most overlay in the stack
        if (zIndex === 1000 + activeOverlayCount) {
          onClose();
        }
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, closeOnEsc, zIndex]);

  // Lock and unlock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      // Small timeout to allow transition to finish
      const t = setTimeout(() => {
        if (activeOverlayCount === 0) {
          document.body.style.overflow = '';
        }
      }, 200);
      return () => clearTimeout(t);
    }
    return () => {
      if (activeOverlayCount === 0) {
        document.body.style.overflow = '';
      }
    };
  }, [isOpen]);

  // Cleanup overlay count on unmount
  useEffect(() => {
    return () => {
      if (isOpen) {
        if (activeOverlayCount > 0) {
          activeOverlayCount--;
        }
        if (activeOverlayCount === 0) {
          document.body.style.overflow = '';
        }
      }
    };
  }, []);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  if (!shouldRender) return null;

  const overlayElement = (
    <div
      className={`${cn(prefix, 'overlay')} ${className}`}
      data-state={isAnimatedIn ? 'open' : undefined}
      data-placement={dataPlacement}
      onClick={handleOverlayClick}
      style={{ zIndex }}
      role="presentation"
    >
      {children}
    </div>
  );

  return ReactDOM.createPortal(overlayElement, document.body);
};
