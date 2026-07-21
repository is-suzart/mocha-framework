import React, { useState, useRef, useEffect, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { usePortalPosition, Placement } from './usePortalPosition';
import { ButtonColor } from './Button';
import { usePrefix } from './PrefixContext';
import { cn, cnEl } from './cn';

export interface TooltipProps {
  content: ReactNode;
  children: React.ReactElement;
  placement?: Placement;
  offset?: number;
  color?: ButtonColor | 'dark' | 'light';
  delay?: number;
  isOpen?: boolean;
  autoFlip?: boolean;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
  offset = 8,
  color = 'dark',
  delay = 200,
  isOpen: controlledIsOpen,
  autoFlip = true,
  className = '',
}) => {
  const prefix = usePrefix();
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen;

  const triggerRef = useRef<HTMLElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const timeoutId = useRef<NodeJS.Timeout>();

  const setOpen = (open: boolean) => {
    if (!isControlled) {
      setUncontrolledIsOpen(open);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (children.props.onMouseEnter) children.props.onMouseEnter(e);
    clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(() => {
      setOpen(true);
    }, delay);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (children.props.onMouseLeave) children.props.onMouseLeave(e);
    clearTimeout(timeoutId.current);
    setOpen(false);
  };

  const handleFocus = (e: React.FocusEvent) => {
    if (children.props.onFocus) children.props.onFocus(e);
    clearTimeout(timeoutId.current);
    setOpen(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (children.props.onBlur) children.props.onBlur(e);
    clearTimeout(timeoutId.current);
    setOpen(false);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      clearTimeout(timeoutId.current);
    };
  }, []);

  const { top, left, actualPlacement } = usePortalPosition(triggerRef, floatingRef, {
    isOpen,
    placement,
    offset,
    autoFlip,
  });

  // Attach event handlers and refs to children
  const triggerEl = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<any>, {
        ref: triggerRef,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onFocus: handleFocus,
        onBlur: handleBlur,
      })
    : children;

  const colorClass = color === 'dark' || color === 'light'
    ? `${prefix}-tooltip--preset-${color}`
    : `${prefix}-tooltip--${color}`;

  return (
    <>
      {triggerEl}
      {isOpen &&
        ReactDOM.createPortal(
          <div
            ref={floatingRef}
            className={`${cn(prefix, 'tooltip')} ${prefix}-tooltip--placement-${actualPlacement} ${colorClass} ${className}`}
            style={{
              position: 'fixed',
              top: `${top}px`,
              left: `${left}px`,
              zIndex: 1100,
            }}
            role="tooltip"
          >
            <div className={cnEl(prefix, 'tooltip', 'content')}>{content}</div>
            <div className={cnEl(prefix, 'tooltip', 'arrow')} />
          </div>,
          document.body
        )}
    </>
  );
};
