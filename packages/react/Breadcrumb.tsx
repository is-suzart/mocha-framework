import React from 'react';
import { usePrefix } from './PrefixContext';
import { cn, cnEl } from './cn';

export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  className = '',
}) => {
  const prefix = usePrefix();
  return (
    <nav className={`${cn(prefix, 'breadcrumb')} ${className}`} aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <span className={cnEl(prefix, 'breadcrumb', 'separator')} aria-hidden="true">
                {separator}
              </span>
            )}
            {item.href && !isLast ? (
              <a
                href={item.href}
                className={cnEl(prefix, 'breadcrumb', 'item')}
              >
                {item.label}
              </a>
            ) : (
              <span
                className={cnEl(prefix, 'breadcrumb', 'item')}
                data-state={isLast ? 'active' : undefined}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

Breadcrumb.displayName = 'Breadcrumb';
