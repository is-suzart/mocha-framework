import React, { useRef, useState, useEffect, useCallback } from 'react';
import { usePrefix } from './PrefixContext';
import { cn, cnEl } from './cn';

export interface ScrollAreaProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const ScrollArea: React.FC<ScrollAreaProps> = ({
  children,
  className = '',
  style,
}) => {
  const prefix = usePrefix();
  const viewportRef = useRef<HTMLDivElement>(null);
  const verticalThumbRef = useRef<HTMLDivElement>(null);
  const horizontalThumbRef = useRef<HTMLDivElement>(null);
  const [showVertical, setShowVertical] = useState(false);
  const [showHorizontal, setShowHorizontal] = useState(false);
  const [thumbTop, setThumbTop] = useState(0);
  const [thumbLeft, setThumbLeft] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(0);
  const [thumbWidth, setThumbWidth] = useState(0);
  const [isDragging, setIsDragging] = useState<'vertical' | 'horizontal' | null>(null);

  const updateThumbs = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } = viewport;

    setShowVertical(scrollHeight > clientHeight);
    setShowHorizontal(scrollWidth > clientWidth);

    if (scrollHeight > clientHeight) {
      setThumbHeight((clientHeight / scrollHeight) * clientHeight);
      setThumbTop((scrollTop / scrollHeight) * clientHeight);
    }

    if (scrollWidth > clientWidth) {
      setThumbWidth((clientWidth / scrollWidth) * clientWidth);
      setThumbLeft((scrollLeft / scrollWidth) * clientWidth);
    }
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    updateThumbs();
    viewport.addEventListener('scroll', updateThumbs);
    const ro = new ResizeObserver(updateThumbs);
    ro.observe(viewport);

    return () => {
      viewport.removeEventListener('scroll', updateThumbs);
      ro.disconnect();
    };
  }, [updateThumbs]);

  useEffect(() => {
    if (!isDragging) return;

    const onMove = (e: MouseEvent) => {
      const viewport = viewportRef.current;
      if (!viewport) return;

      if (isDragging === 'vertical') {
        const rect = viewport.getBoundingClientRect();
        const y = e.clientY - rect.top - thumbHeight / 2;
        const ratio = y / (rect.height - thumbHeight);
        viewport.scrollTop = ratio * (viewport.scrollHeight - viewport.clientHeight);
      } else {
        const rect = viewport.getBoundingClientRect();
        const x = e.clientX - rect.left - thumbWidth / 2;
        const ratio = x / (rect.width - thumbWidth);
        viewport.scrollLeft = ratio * (viewport.scrollWidth - viewport.clientWidth);
      }
    };

    const onUp = () => setIsDragging(null);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDragging, thumbHeight, thumbWidth]);

  return (
    <div className={`${cn(prefix, 'scroll-area')} ${className}`} style={style}>
      <div ref={viewportRef} className={cnEl(prefix, 'scroll-area', 'viewport')}>
        {children}
      </div>
      {showVertical && (
        <div
          className={cnEl(prefix, 'scroll-area', 'scrollbar')}
          data-orientation="vertical"
          style={{ opacity: isDragging === 'vertical' ? 1 : 0.6 }}
        >
          <div
            ref={verticalThumbRef}
            className={cnEl(prefix, 'scroll-area', 'thumb')}
            style={{ height: thumbHeight, transform: `translateY(${thumbTop}px)` }}
            onMouseDown={() => setIsDragging('vertical')}
          />
        </div>
      )}
      {showHorizontal && (
        <div
          className={cnEl(prefix, 'scroll-area', 'scrollbar')}
          data-orientation="horizontal"
          style={{ opacity: isDragging === 'horizontal' ? 1 : 0.6 }}
        >
          <div
            ref={horizontalThumbRef}
            className={cnEl(prefix, 'scroll-area', 'thumb')}
            style={{ width: thumbWidth, transform: `translateX(${thumbLeft}px)` }}
            onMouseDown={() => setIsDragging('horizontal')}
          />
        </div>
      )}
      {showVertical && showHorizontal && <div className={cnEl(prefix, 'scroll-area', 'corner')} />}
    </div>
  );
};

ScrollArea.displayName = 'ScrollArea';
