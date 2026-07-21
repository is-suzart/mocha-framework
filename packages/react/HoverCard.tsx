import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { usePortalPosition, type Placement } from './usePortalPosition';
import { usePrefix } from './PrefixContext';
import { cn, cnEl } from './cn';

export interface HoverCardProps {
  children: [React.ReactElement, React.ReactElement];
  placement?: Placement;
  offset?: number;
  openDelay?: number;
  closeDelay?: number;
  autoFlip?: boolean;
  className?: string;
}

export const HoverCard: React.FC<HoverCardProps> = ({
  children,
  placement = 'bottom',
  offset = 8,
  openDelay = 400,
  closeDelay = 300,
  autoFlip = true,
  className = '',
}) => {
  const prefix = usePrefix();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const { top, left, actualPlacement } = usePortalPosition(triggerRef, floatingRef, {
    isOpen,
    placement,
    offset,
    autoFlip,
  });

  const show = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsOpen(true), openDelay);
  };

  const hide = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsOpen(false), closeDelay);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const [trigger, content] = React.Children.toArray(children) as [React.ReactElement, React.ReactElement];

  const triggerEl = React.isValidElement(trigger)
    ? React.cloneElement(trigger as React.ReactElement<any>, {
        ref: triggerRef,
        'aria-haspopup': 'dialog',
        'aria-expanded': isOpen,
        onMouseEnter: (e: React.MouseEvent) => {
          trigger.props.onMouseEnter?.(e);
          show();
        },
        onMouseLeave: (e: React.MouseEvent) => {
          trigger.props.onMouseLeave?.(e);
          hide();
        },
        onFocus: (e: React.FocusEvent) => {
          trigger.props.onFocus?.(e);
          show();
        },
        onBlur: (e: React.FocusEvent) => {
          trigger.props.onBlur?.(e);
          hide();
        },
      })
    : trigger;

  return (
    <>
      {triggerEl}
      {isOpen && ReactDOM.createPortal(
        <div
          ref={floatingRef}
          className={`${cn(prefix, 'hover-card')} ${className}`} data-placement={actualPlacement}
          style={{
            position: 'fixed',
            top: `${top}px`,
            left: `${left}px`,
            zIndex: 1100,
          }}
          onMouseEnter={() => clearTimeout(timeoutRef.current)}
          onMouseLeave={() => hide()}
        >
          <div className={cnEl(prefix, 'hover-card', 'arrow')} />
          {content}
        </div>,
        document.body
      )}
    </>
  );
};

HoverCard.displayName = 'HoverCard';
