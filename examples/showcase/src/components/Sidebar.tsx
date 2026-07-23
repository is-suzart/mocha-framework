import { useLocation, Link } from 'react-router-dom';
import type { Theme } from '../data/colors';
import './Sidebar.css';

interface SidebarProps {
  theme: Theme;
  themes: readonly Theme[];
  setTheme: (t: Theme) => void;
  isOpen: boolean;
  onClose: () => void;
}

const navGroups = [
  {
    title: 'Inputs & Forms',
    items: [
      { label: '\u{1F518} Buttons', path: '/button' },
      { label: '\u{1F5C2}\uFE0F Button Groups', path: '/buttongroup' },
      { label: '\u{1F50D} Advanced Selects', path: '/select' },
      { label: '\u{1F3A8} Color Picker', path: '/colorpicker' },
      { label: '\u26A1 Dynamic Forms', path: '/form' },
    ],
  },
  {
    title: 'Layout & Overlays',
    items: [
      { label: '\u{1F5C2}\uFE0F Compound Tabs', path: '/tabs' },
      { label: '\u{1F4E6} Modals & Overlay', path: '/modal' },
      { label: '\u{1F6AA} Drawer Panel', path: '/drawer' },
      { label: '\u25BE Dropdown Portal', path: '/dropdown' },
      { label: '\u{1F4AC} Tooltip Portal', path: '/tooltip' },
      { label: '\u{1F4E6} Flexbox Grid', path: '/grid' },
      { label: '\u{1F4C5} Date Picker', path: '/datepicker' },
      { label: '\u{1F4BB} Layout Shell', path: '/shell' },
      { label: '\u{1F6AA} Rich Sidebar', path: '/sidebar' },
    ],
  },
  {
    title: 'Data & Feedback',
    items: [
      { label: '\u{1F6A5} Steppers', path: '/stepper' },
      { label: '\u{1F4C8} Steps & Slider', path: '/steps' },
      { label: '\u{1F4CA} Progress & Scroll', path: '/progress' },
      { label: '\u{1F4C4} Pagination & Limit', path: '/pagination' },
      { label: '\u{1F4CA} Data Table', path: '/table' },
      { label: '\u{1F3B4} Cards & Tiles', path: '/card' },
      { label: '\u2728 Icons Pack', path: '/icons' },
      { label: '\u{1F4C7} Badges & Tags', path: '/badge' },
      { label: '\u{1FA97} Accordion & Collapse', path: '/accordion' },
      { label: '\u{1F524} Typography Helpers', path: '/typography' },
      { label: '\u270D\uFE0F Text Editor', path: '/texteditor' },
      { label: '\u{1F4CA} Charts', path: '/charts' },
      { label: '\u{1F480} Skeleton', path: '/skeleton' },
      { label: '\u26A0\uFE0F Alert', path: '/alert' },
      { label: '\u{1F464} Avatar', path: '/avatar' },
      { label: '\u{1F35E} Breadcrumbs', path: '/breadcrumb' },
      { label: '\u{1F3A0} Carousel', path: '/carousel' },
      { label: '\u{1F35E} Toast', path: '/toast' },
    ],
  },
  {
    title: 'Pro Features',
    items: [
      { label: '\u26A1 Reorderable Tabs & Table', path: '/pro' },
      { label: '\u{1F4CB} Kanban Board', path: '/kanban' },
    ],
  },
  {
    title: 'Example',
    items: [
      { label: '\u{1F4C4} Example Page', path: '/template' },
    ],
  },
];

export function Sidebar({ theme, themes, setTheme, isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />
      <aside className={`showcase-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo-section">
          <span className="sidebar-logo">🐱</span>
          <div>
            <h1 className="sidebar-title">Catppuccin DS</h1>
            <div className="sidebar-subtitle">Cozy design components</div>
          </div>
        </div>

        <div className="sidebar-theme-wrapper">
          <div className="theme-selector">
            {themes.map((t) => (
              <button
                key={t}
                className={`theme-btn ${theme === t ? 'active' : ''}`}
                onClick={() => setTheme(t as Theme)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {navGroups.map((group) => (
          <div className="sidebar-nav-group" key={group.title}>
            <div className="sidebar-group-title">{group.title}</div>
            <div className="sidebar-nav-list">
              {group.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`sidebar-nav-item ${currentPath === item.path ? 'active' : ''}`}
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </aside>
    </>
  );
}
