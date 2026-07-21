import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Button, ButtonProps, ButtonShape } from './Button';
import { usePrefix } from './PrefixContext';
import { cn, cnEl } from './cn';

export type ButtonGroupOrientation = 'horizontal' | 'vertical';
export type ButtonGroupVariant = 'filled' | 'outline' | 'ghost';
export type ButtonGroupSelectionMode = 'none' | 'single' | 'multiple';

export interface ButtonGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  orientation?: ButtonGroupOrientation;
  variant?: ButtonGroupVariant;
  shape?: ButtonShape;
  selectionMode?: ButtonGroupSelectionMode;
  value?: any;
  onChange?: (value: any) => void;
  className?: string;
  disabled?: boolean;
}

interface ButtonGroupContextProps {
  selectionMode: ButtonGroupSelectionMode;
  value: any;
  onChange: (btnValue: any) => void;
  disabled?: boolean;
  registerButton: (val: any, element: HTMLButtonElement) => () => void;
}

const ButtonGroupContext = createContext<ButtonGroupContextProps | null>(null);

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
      orientation = 'horizontal',
      variant = 'filled',
      shape = 'rounded',
      selectionMode = 'none',
      value,
      onChange,
      className = '',
      children,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const prefix = usePrefix();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [pillStyle, setPillStyle] = useState<React.CSSProperties>({
      opacity: 0,
      pointerEvents: 'none' as const,
    });
    const [pillReady, setPillReady] = useState(false);
    
    // Track references of option buttons to measure their dimensions
    const buttonElementsMap = useRef<Map<any, HTMLButtonElement>>(new Map());

    const registerButton = (val: any, element: HTMLButtonElement) => {
      buttonElementsMap.current.set(val, element);
      updatePillPosition();
      return () => {
        buttonElementsMap.current.delete(val);
        updatePillPosition();
      };
    };

    const updatePillPosition = () => {
      if (!containerRef.current || selectionMode !== 'single') {
        setPillStyle({ opacity: 0, pointerEvents: 'none' as const });
        setPillReady(false);
        return;
      }

      const activeElement = buttonElementsMap.current.get(value);
      if (!activeElement) {
        setPillStyle({ opacity: 0, pointerEvents: 'none' as const });
        setPillReady(false);
        return;
      }

      const containerRect = containerRef.current.getBoundingClientRect();
      const activeRect = activeElement.getBoundingClientRect();

      const left = activeRect.left - containerRect.left;
      const top = activeRect.top - containerRect.top;
      const width = activeRect.width;
      const height = activeRect.height;

      setPillStyle({
        transform: `translate(${left}px, ${top}px)`,
        width: `${width}px`,
        height: `${height}px`,
      });
      setPillReady(true);
    };

    // Recalculate on value change
    useEffect(() => {
      updatePillPosition();
    }, [value, selectionMode, variant]);

    // Recalculate on resize
    useEffect(() => {
      if (!containerRef.current) return;
      const observer = new ResizeObserver(() => {
        updatePillPosition();
      });
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }, [value, selectionMode]);

    const handleButtonClick = (btnValue: any) => {
      if (selectionMode === 'none' || !onChange || btnValue === undefined) {
        return;
      }

      if (selectionMode === 'single') {
        onChange(btnValue);
      } else if (selectionMode === 'multiple') {
        const currentValues = Array.isArray(value) ? value : [];
        if (currentValues.includes(btnValue)) {
          onChange(currentValues.filter((val) => val !== btnValue));
        } else {
          onChange([...currentValues, btnValue]);
        }
      }
    };

    // Keyboard Arrow Navigation for Radio Group (Selection mode single)
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (selectionMode !== 'single') return;

      const keys = Array.from(buttonElementsMap.current.keys());
      const currentIndex = keys.indexOf(value);
      if (currentIndex === -1) return;

      let nextIndex = currentIndex;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextIndex = (currentIndex + 1) % keys.length;
        e.preventDefault();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        nextIndex = (currentIndex - 1 + keys.length) % keys.length;
        e.preventDefault();
      }

      if (nextIndex !== currentIndex) {
        const nextValue = keys[nextIndex];
        handleButtonClick(nextValue);
        // Focus the next active button
        setTimeout(() => {
          const btnEl = buttonElementsMap.current.get(nextValue);
          btnEl?.focus();
        }, 0);
      }
    };

    const classNames = [
      cn(prefix, 'btn-group'),
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const setRef = (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    return (
      <ButtonGroupContext.Provider
        value={{
          selectionMode,
          value,
          onChange: handleButtonClick,
          disabled,
          registerButton,
        }}
      >
        <div
          ref={setRef}
          className={classNames}
          role={selectionMode === 'single' ? 'radiogroup' : undefined}
          onKeyDown={handleKeyDown}
          data-orientation={orientation}
          data-variant={variant}
          data-shape={shape}
          data-state={[ 
            (selectionMode === 'single' && pillReady) ? 'pill-active' : '',
            selectionMode !== 'none' ? selectionMode : ''
          ].filter(Boolean).join(' ') || undefined}
          {...props}
        >
          {selectionMode === 'single' && (
            <div className={cnEl(prefix, 'btn-group', 'pill')} style={pillStyle} />
          )}
          {children}
        </div>
      </ButtonGroupContext.Provider>
    );
  }
);

ButtonGroup.displayName = 'ButtonGroup';

export interface ButtonGroupItemProps extends ButtonProps {
  value: any;
}

export const ButtonGroupItem = React.forwardRef<HTMLButtonElement, ButtonGroupItemProps>(
  ({ value: itemValue, className = '', children, disabled, onClick, ...props }, ref) => {
    const prefix = usePrefix();
    const context = useContext(ButtonGroupContext);
    const itemRef = useRef<HTMLButtonElement | null>(null);

    const isGroupItem = !!context;
    const selectionMode = context?.selectionMode ?? 'none';
    const groupValue = context?.value;
    const isGroupDisabled = context?.disabled;

    let isActive = false;
    if (selectionMode === 'single') {
      isActive = groupValue === itemValue;
    } else if (selectionMode === 'multiple') {
      isActive = Array.isArray(groupValue) && groupValue.includes(itemValue);
    }

    useEffect(() => {
      if (context && itemRef.current) {
        return context.registerButton(itemValue, itemRef.current);
      }
    }, [context, itemValue]);

    const setMergedRef = (node: HTMLButtonElement | null) => {
      itemRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick) onClick(e);
      if (context) {
        context.onChange(itemValue);
      }
    };

    const finalDisabled = disabled || isGroupDisabled;

    const classNames = [
      isActive ? cn(prefix, 'btn') : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <Button
        ref={setMergedRef}
        className={classNames}
        disabled={finalDisabled}
        role={selectionMode === 'single' ? 'radio' : undefined}
        aria-checked={selectionMode === 'single' ? isActive : undefined}
        tabIndex={selectionMode === 'single' ? (isActive ? 0 : -1) : 0}
        onClick={handleClick}
        data-state={isActive ? 'active' : undefined}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

ButtonGroupItem.displayName = 'ButtonGroupItem';
