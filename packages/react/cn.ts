export function cn(
  prefix: string,
  baseClass: string,
  modifiers: (string | undefined | null | false)[] = []
): string {
  const cleanPrefix = prefix ? `${prefix}-` : '';
  const mainClass = `${cleanPrefix}${baseClass}`;
  const formattedModifiers = modifiers
    .filter((mod): mod is string => typeof mod === 'string' && !!mod)
    .map(mod => `${mainClass}-${mod}`);
  return [mainClass, ...formattedModifiers].join(' ');
}

export function cnEl(prefix: string, baseClass: string, element: string): string {
  const cleanPrefix = prefix ? `${prefix}-` : '';
  return `${cleanPrefix}${baseClass}-${element}`;
}
