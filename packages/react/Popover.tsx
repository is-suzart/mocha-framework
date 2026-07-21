import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { usePortalPosition, type Placement } from './usePortalPosition';
import { usePrefix } from './PrefixContext';
import { cn, cnEl } from './cn';

export interface PopoverProps {
  children: [React.ReactElement, React.ReactElement];
  placement?: Placement;
  offset?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  autoFlip?: boolean;
  className?: string;
}

export const Popover: React.FC<PopoverProps> = ({
  children,
  placement = 'bottom',
  offset = 8,
  open: controlledOpen,
  onOpenChange,
  autoFlip = true,
  className = '',
}) => {
  const prefix = usePrefix();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const triggerRef = useRef<HTMLElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLElement>(null);

  const setOpen = useCallback((open: boolean) => {
    if (!isControlled) setUncontrolledOpen(open);
    onOpenChange?.(open);
  }, [isControlled, onOpenChange]);

  const { top, left, actualPlacement } = usePortalPosition(triggerRef, floatingRef, {
    isOpen,
    placement,
    offset,
    autoFlip,
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        floatingRef.current &&
        !floatingRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, setOpen]);

  const [trigger, content] = React.Children.toArray(children) as [React.ReactElement, React.ReactElement];

  useEffect(() => {
    if (isOpen && floatingRef.current) {
      const firstFocusable = floatingRef.current.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }
  }, [isOpen]);

  const triggerEl = React.isValidElement(trigger)
    ? React.cloneElement(trigger as React.ReactElement<any>, {
        ref: triggerRef,
        'aria-haspopup': 'dialog',
        'aria-expanded': isOpen,
        onClick: (e: React.MouseEvent) => {
          trigger.props.onClick?.(e);
          setOpen(!isOpen);
        },
      })
    : trigger;

  return (
    <>
      {triggerEl}
      {isOpen && ReactDOM.createPortal(
        <div
          ref={floatingRef}
          className={`${cn(prefix, 'popover')} ${className}`} data-placement={actualPlacement}
          style={{
            position: 'fixed',
            top: `${top}px`,
            left: `${left}px`,
            zIndex: 1100,
          }}
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
          <div className={cnEl(prefix, 'popover', 'arrow')} />
          {content}
        </div>,
        document.body
      )}
    </>
  );
};

Popover.displayName = 'Popover';
