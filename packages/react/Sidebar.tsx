import React, { useState, ReactNode, createContext, useContext } from 'react';
import { usePrefix } from './PrefixContext';
import { cn, cnEl } from './cn';

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual variant: inline fixed or modern floating card */
  variant?: 'fixed' | 'floated';
  /** Controlled collapsed state */
  collapsed?: boolean;
  /** Uncontrolled default collapsed state */
  defaultCollapsed?: boolean;
  /** Expand sidebar on hover when collapsed */
  expandOnHover?: boolean;
  /** Callback triggered when collapse state changes */
  onCollapseChange?: (collapsed: boolean) => void;
  /** Custom width when expanded (e.g., '260px') */
  width?: string;
  /** Custom width when collapsed (e.g., '68px') */
  collapsedWidth?: string;
  children: ReactNode;
  className?: string;
}

export interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export interface SidebarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export interface SidebarItemProps extends React.HTMLAttributes<HTMLElement> {
  /** Leading icon for the menu item */
  icon?: ReactNode;
  /** Content label for the item */
  label?: ReactNode;
  /** Active highlight state */
  active?: boolean;
  /** Link reference - renders as anchor tag if provided */
  href?: string;
  /** Custom tag override (e.g., button, Link, a) */
  as?: any;
  /** Disables the item */
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
}

export interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

// Context to share collapsed state with child components if needed
const SidebarContext = createContext<{ collapsed: boolean }>({ collapsed: false });

export const useSidebarContext = () => useContext(SidebarContext);

export const Sidebar: React.FC<SidebarProps> & {
  Header: React.FC<SidebarHeaderProps>;
  Section: React.FC<SidebarSectionProps>;
  Item: React.FC<SidebarItemProps>;
  Footer: React.FC<SidebarFooterProps>;
} = ({
  variant = 'fixed',
  collapsed,
  defaultCollapsed = false,
  expandOnHover = false,
  onCollapseChange,
  width,
  collapsedWidth,
  children,
  className = '',
  style,
  ...props
}) => {
  const prefix = usePrefix();
  const [localCollapsed, setLocalCollapsed] = useState(defaultCollapsed);
  const isCollapsed = collapsed !== undefined ? collapsed : localCollapsed;

  const wrapperClasses = [
    cn(prefix, 'sidebar-wrapper', [isCollapsed ? 'collapsed' : '']),
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const sidebarClasses = [
    cn(prefix, 'sidebar', [variant, expandOnHover ? 'expand-on-hover' : '', isCollapsed ? 'collapsed' : '']),
  ]
    .filter(Boolean)
    .join(' ');

  const cssVariables = {
    ...(width ? { '--ctp-sidebar-expanded-width': width } : {}),
    ...(collapsedWidth ? { '--ctp-sidebar-collapsed-width': collapsedWidth } : {}),
  } as React.CSSProperties;

  const combinedStyle = {
    ...style,
    ...cssVariables,
  };

  return (
    <SidebarContext.Provider value={{ collapsed: isCollapsed }}>
      <div className={wrapperClasses} style={combinedStyle} {...props}>
        <aside className={sidebarClasses}>
          {children}
        </aside>
      </div>
    </SidebarContext.Provider>
  );
};

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  children,
  className = '',
  ...props
}) => {
  const prefix = usePrefix();
  return (
    <div className={`${cnEl(prefix, 'sidebar', 'header')} ${className}`} {...props}>
      {children}
    </div>
  );
};

const SidebarSection: React.FC<SidebarSectionProps> = ({
  children,
  className = '',
  ...props
}) => {
  const prefix = usePrefix();
  return (
    <div className={`${cnEl(prefix, 'sidebar', 'section')} ${className}`} {...props}>
      {children}
    </div>
  );
};

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  active = false,
  href,
  as,
  disabled = false,
  children,
  className = '',
  ...props
}) => {
  const prefix = usePrefix();
  const Tag = as || (href ? 'a' : 'button');
  
  const classes = [
    cnEl(prefix, 'sidebar', 'item'),
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Standard interactive element attributes
  const componentProps: any = {
    className: classes,
    disabled: disabled ? true : undefined,
    'data-state': active ? 'active' : undefined,
    ...props,
  };

  if (Tag === 'a' || href) {
    componentProps.href = href;
  } else if (Tag === 'button') {
    componentProps.type = 'button';
  }

  return (
    <Tag {...componentProps}>
      {icon && <span className={cnEl(prefix, 'sidebar', 'item-icon')}>{icon}</span>}
      {(label || children) && (
        <span className={cnEl(prefix, 'sidebar', 'label')}>
          {label || children}
        </span>
      )}
    </Tag>
  );
};

const SidebarFooter: React.FC<SidebarFooterProps> = ({
  children,
  className = '',
  ...props
}) => {
  const prefix = usePrefix();
  return (
    <div className={`${cnEl(prefix, 'sidebar', 'footer')} ${className}`} {...props}>
      {children}
    </div>
  );
};

Sidebar.Header = SidebarHeader;
Sidebar.Section = SidebarSection;
Sidebar.Item = SidebarItem;
Sidebar.Footer = SidebarFooter;

Sidebar.displayName = 'Sidebar';
SidebarHeader.displayName = 'Sidebar.Header';
SidebarSection.displayName = 'Sidebar.Section';
SidebarItem.displayName = 'Sidebar.Item';
SidebarFooter.displayName = 'Sidebar.Footer';
