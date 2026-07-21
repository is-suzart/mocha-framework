import { useState, useEffect, RefObject } from 'react';

export type Placement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

export interface UsePortalPositionOptions {
  isOpen: boolean;
  placement: Placement;
  offset?: number;
  autoFlip?: boolean;
}

export const usePortalPosition = (
  triggerRef: RefObject<HTMLElement | null>,
  floatingRef: RefObject<HTMLElement | null>,
  options: UsePortalPositionOptions
) => {
  const { isOpen, placement, offset = 8, autoFlip = true } = options;
  const [coords, setCoords] = useState<{ top: number; left: number; actualPlacement: Placement }>({
    top: 0,
    left: 0,
    actualPlacement: placement,
  });

  const updatePosition = () => {
    if (!isOpen || !triggerRef.current || !floatingRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const floatingRect = floatingRef.current.getBoundingClientRect();

    let computedPlacement = placement;
    let top = 0;
    let left = 0;

    const getCoords = (p: Placement) => {
      let t = 0;
      let l = 0;

      switch (p) {
        case 'bottom-start':
          t = triggerRect.bottom + offset;
          l = triggerRect.left;
          break;
        case 'bottom-end':
          t = triggerRect.bottom + offset;
          l = triggerRect.right - floatingRect.width;
          break;
        case 'bottom':
          t = triggerRect.bottom + offset;
          l = triggerRect.left + (triggerRect.width - floatingRect.width) / 2;
          break;
        case 'top-start':
          t = triggerRect.top - floatingRect.height - offset;
          l = triggerRect.left;
          break;
        case 'top-end':
          t = triggerRect.top - floatingRect.height - offset;
          l = triggerRect.right - floatingRect.width;
          break;
        case 'top':
          t = triggerRect.top - floatingRect.height - offset;
          l = triggerRect.left + (triggerRect.width - floatingRect.width) / 2;
          break;
        case 'left':
          t = triggerRect.top + (triggerRect.height - floatingRect.height) / 2;
          l = triggerRect.left - floatingRect.width - offset;
          break;
        case 'left-start':
          t = triggerRect.top;
          l = triggerRect.left - floatingRect.width - offset;
          break;
        case 'left-end':
          t = triggerRect.bottom - floatingRect.height;
          l = triggerRect.left - floatingRect.width - offset;
          break;
        case 'right':
          t = triggerRect.top + (triggerRect.height - floatingRect.height) / 2;
          l = triggerRect.right + offset;
          break;
        case 'right-start':
          t = triggerRect.top;
          l = triggerRect.right + offset;
          break;
        case 'right-end':
          t = triggerRect.bottom - floatingRect.height;
          l = triggerRect.right + offset;
          break;
      }
      return { t, l };
    };

    // Calculate initial coordinates
    const initialCoords = getCoords(computedPlacement);
    top = initialCoords.t;
    left = initialCoords.l;

    if (autoFlip) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Check if it overflows the bottom
      if (computedPlacement.startsWith('bottom') && top + floatingRect.height > viewportHeight) {
        const flippedPlacement = computedPlacement.replace('bottom', 'top') as Placement;
        const flippedCoords = getCoords(flippedPlacement);
        if (flippedCoords.t >= 0) {
          computedPlacement = flippedPlacement;
          top = flippedCoords.t;
          left = flippedCoords.l;
        }
      }
      // Check if it overflows the top
      else if (computedPlacement.startsWith('top') && top < 0) {
        const flippedPlacement = computedPlacement.replace('top', 'bottom') as Placement;
        const flippedCoords = getCoords(flippedPlacement);
        if (flippedCoords.t + floatingRect.height <= viewportHeight) {
          computedPlacement = flippedPlacement;
          top = flippedCoords.t;
          left = flippedCoords.l;
        }
      }
      // Check if it overflows the left
      else if (computedPlacement.startsWith('left') && left < 0) {
        const flippedPlacement = computedPlacement.replace('left', 'right') as Placement;
        const flippedCoords = getCoords(flippedPlacement);
        if (flippedCoords.l + floatingRect.width <= viewportWidth) {
          computedPlacement = flippedPlacement;
          top = flippedCoords.t;
          left = flippedCoords.l;
        }
      }
      // Check if it overflows the right
      else if (computedPlacement.startsWith('right') && left + floatingRect.width > viewportWidth) {
        const flippedPlacement = computedPlacement.replace('right', 'left') as Placement;
        const flippedCoords = getCoords(flippedPlacement);
        if (flippedCoords.l >= 0) {
          computedPlacement = flippedPlacement;
          top = flippedCoords.t;
          left = flippedCoords.l;
        }
      }
    }

    setCoords({ top, left, actualPlacement: computedPlacement });
  };

  useEffect(() => {
    if (!isOpen) return;

    updatePosition();

    const handleScroll = () => {
      updatePosition();
    };

    window.addEventListener('resize', handleScroll);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('resize', handleScroll);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen, placement, offset, autoFlip, triggerRef.current, floatingRef.current]);

  useEffect(() => {
    if (!isOpen || !floatingRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      updatePosition();
    });

    resizeObserver.observe(floatingRef.current);
    if (triggerRef.current) {
      resizeObserver.observe(triggerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [isOpen, triggerRef.current, floatingRef.current]);

  return coords;
};
