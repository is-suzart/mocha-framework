import { useState, useEffect } from 'react';
import type { Theme } from '../data/colors';

const THEMES = ['latte', 'frappe', 'macchiato', 'mocha', 'vercel', 'vercel-light'] as const;

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('macchiato');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return { theme, themes: THEMES, setTheme };
}
