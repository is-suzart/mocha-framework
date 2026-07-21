import React, { createContext, useContext, useState } from 'react';
import { usePrefix } from './PrefixContext';
import { cn, cnEl } from './cn';

export type AccordionVariant = 'default' | 'split';
export type AccordionColorMode = 'none' | 'colored' | 'tonal';
export type AccordionAccentColor =
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
  | 'lavender';

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AccordionVariant;
  colorMode?: AccordionColorMode;
  accentColor?: AccordionAccentColor;
  allowMultiple?: boolean;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: any) => void;
}

interface AccordionContextType {
  openValues: string[];
  toggleValue: (value: string) => void;
  variant: AccordionVariant;
  colorMode: AccordionColorMode;
  accentColor?: AccordionAccentColor;
}

const AccordionContext = createContext<AccordionContextType | null>(null);

export const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion subcomponents must be rendered within an Accordion component');
  }
  return context;
};

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

interface AccordionItemContextType {
  value: string;
  disabled?: boolean;
  isOpen: boolean;
}

const AccordionItemContext = createContext<AccordionItemContextType | null>(null);

export const useAccordionItem = () => {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error('AccordionItem subcomponents must be rendered within an AccordionItem component');
  }
  return context;
};

export const AccordionItem: React.FC<AccordionItemProps> = ({
  value,
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  const { openValues } = useAccordion();
  const isOpen = openValues.includes(value);
  const prefix = usePrefix();

  const classNames = [
    cnEl(prefix, 'accordion', 'item'),
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <AccordionItemContext.Provider value={{ value, disabled, isOpen }}>
      <div className={classNames} data-state={isOpen ? 'open' : (disabled ? 'disabled' : undefined)} {...props}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
};

export interface AccordionHeaderProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  showChevron?: boolean;
}

export const AccordionHeader: React.FC<AccordionHeaderProps> = ({
  showChevron = true,
  className = '',
  children,
  ...props
}) => {
  const { toggleValue } = useAccordion();
  const { value, disabled, isOpen } = useAccordionItem();
  const prefix = usePrefix();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    toggleValue(value);
    if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <button
      type="button"
      className={`${cnEl(prefix, 'accordion', 'header')} ${className}`}
      disabled={disabled}
      aria-expanded={isOpen}
      onClick={handleClick}
      {...props}
    >
      <span className={cnEl(prefix, 'accordion', 'title')}>{children}</span>
      {showChevron && (
        <svg
          className={cnEl(prefix, 'accordion', 'chevron')}
          viewBox="0 0 24 24"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      )}
    </button>
  );
};

export interface AccordionBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export const AccordionBody: React.FC<AccordionBodyProps> = ({
  className = '',
  children,
  ...props
}) => {
  const { isOpen } = useAccordionItem();
  const prefix = usePrefix();

  return (
    <div
      className={cnEl(prefix, 'accordion', 'collapse')}
      aria-hidden={!isOpen}
    >
      <div className={cnEl(prefix, 'accordion', 'content')}>
        <div className={`${cnEl(prefix, 'accordion', 'body')} ${className}`} {...props}>
          {children}
        </div>
      </div>
    </div>
  );
};

export const Accordion: React.FC<AccordionProps> & {
  Item: React.FC<AccordionItemProps>;
  Header: React.FC<AccordionHeaderProps>;
  Body: React.FC<AccordionBodyProps>;
} = ({
  variant = 'default',
  colorMode = 'none',
  accentColor,
  allowMultiple = false,
  defaultValue,
  value,
  onValueChange,
  className = '',
  children,
  ...props
}) => {
  const [localOpenValues, setLocalOpenValues] = useState<string[]>(() => {
    if (defaultValue !== undefined) {
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    }
    return [];
  });

  const isOpenControlled = value !== undefined;
  const currentOpenValues = isOpenControlled
    ? (Array.isArray(value) ? value : [value])
    : localOpenValues;

  const toggleValue = (itemValue: string) => {
    let nextValues: string[];
    if (allowMultiple) {
      nextValues = currentOpenValues.includes(itemValue)
        ? currentOpenValues.filter((v) => v !== itemValue)
        : [...currentOpenValues, itemValue];
    } else {
      nextValues = currentOpenValues.includes(itemValue) ? [] : [itemValue];
    }

    if (!isOpenControlled) {
      setLocalOpenValues(nextValues);
    }

    if (onValueChange) {
      onValueChange(allowMultiple ? nextValues : (nextValues[0] || ''));
    }
  };

  const prefix = usePrefix();

  const classNames = [
    cn(prefix, 'accordion'),
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <AccordionContext.Provider
      value={{
        openValues: currentOpenValues,
        toggleValue,
        variant,
        colorMode,
        accentColor,
      }}
    >
      <div
        className={classNames}
        data-variant={variant}
        data-color={colorMode !== 'none' ? colorMode : undefined}
        data-accent={accentColor}
        {...props}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Body = AccordionBody;

Accordion.displayName = 'Accordion';
AccordionItem.displayName = 'Accordion.Item';
AccordionHeader.displayName = 'Accordion.Header';
AccordionBody.displayName = 'Accordion.Body';
