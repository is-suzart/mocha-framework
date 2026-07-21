import React, { ReactNode } from 'react';
import { usePrefix } from './PrefixContext';
import { cn, cnEl } from './cn';

export type ShellLayout = 'header-first' | 'sidebar-first' | 'simple' | 'custom';

export interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The layout structure of the shell */
  layout?: ShellLayout;
  /** Whether the shell occupies the full viewport and locks body scroll */
  fullScreen?: boolean;
  /** Whether the sidebar is fully collapsed (width 0) */
  sidebarCollapsed?: boolean;
  /** Whether the sidebar is in icon-only mini mode (width 64px) */
  sidebarMini?: boolean;
  /** Whether the mobile sidebar drawer is open */
  sidebarMobileOpen?: boolean;
  /** Custom height for the header (e.g., '60px', '4rem') */
  headerHeight?: string;
  /** Custom width for the sidebar (e.g., '260px', '18rem') */
  sidebarWidth?: string;
  /** Callback triggered when clicking the mobile overlay backdrop */
  onBackdropClick?: () => void;
  children: ReactNode;
  className?: string;
}

export interface ShellHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export interface ShellSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export interface ShellMainProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export interface ShellContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the content pane handles its own scrolling (keeps header/sidebar locked in view) */
  scrollable?: boolean;
  children?: ReactNode;
  className?: string;
}

export const Shell: React.FC<ShellProps> & {
  Header: React.FC<ShellHeaderProps>;
  Sidebar: React.FC<ShellSidebarProps>;
  Main: React.FC<ShellMainProps>;
  Content: React.FC<ShellContentProps>;
} = ({
  layout = 'header-first',
  fullScreen = true,
  sidebarCollapsed = false,
  sidebarMini = false,
  sidebarMobileOpen = false,
  headerHeight,
  sidebarWidth,
  onBackdropClick,
  children,
  className = '',
  style,
  ...props
}) => {
  const prefix = usePrefix();
  const classes = [
    cn(prefix, 'shell', [layout, fullScreen ? 'full-screen' : '', sidebarCollapsed ? 'sidebar-collapsed' : '', sidebarMini && !sidebarCollapsed ? 'sidebar-mini' : '', sidebarMobileOpen ? 'sidebar-mobile-open' : '']),
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const cssVariables = {
    ...(headerHeight ? { '--ctp-shell-header-height': headerHeight } : {}),
    ...(sidebarWidth ? { '--ctp-shell-sidebar-width': sidebarWidth } : {}),
  } as React.CSSProperties;

  const combinedStyle = {
    ...style,
    ...cssVariables,
  };

  return (
    <div className={classes} style={combinedStyle} {...props}>
      {children}
      {/* Backdrop for mobile overlays */}
      <div className={cnEl(prefix, 'shell', 'backdrop')} onClick={onBackdropClick} />
    </div>
  );
};

const ShellHeader: React.FC<ShellHeaderProps> = ({
  children,
  className = '',
  ...props
}) => {
  const prefix = usePrefix();
  return (
    <header className={`${cnEl(prefix, 'shell', 'header')} ${className}`} {...props}>
      {children}
    </header>
  );
};

const ShellSidebar: React.FC<ShellSidebarProps> = ({
  children,
  className = '',
  ...props
}) => {
  const prefix = usePrefix();
  return (
    <aside className={`${cnEl(prefix, 'shell', 'sidebar')} ${className}`} {...props}>
      {children}
    </aside>
  );
};

const ShellMain: React.FC<ShellMainProps> = ({
  children,
  className = '',
  ...props
}) => {
  const prefix = usePrefix();
  return (
    <main className={`${cnEl(prefix, 'shell', 'main')} ${className}`} {...props}>
      {children}
    </main>
  );
};

const ShellContent: React.FC<ShellContentProps> = ({
  scrollable = true,
  children,
  className = '',
  ...props
}) => {
  const prefix = usePrefix();
  const classes = [
    cnEl(prefix, 'shell', 'content'),
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      data-state={scrollable ? 'scrollable' : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

Shell.Header = ShellHeader;
Shell.Sidebar = ShellSidebar;
Shell.Main = ShellMain;
Shell.Content = ShellContent;

Shell.displayName = 'Shell';
ShellHeader.displayName = 'Shell.Header';
ShellSidebar.displayName = 'Shell.Sidebar';
ShellMain.displayName = 'Shell.Main';
ShellContent.displayName = 'Shell.Content';
