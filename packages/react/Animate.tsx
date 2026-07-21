import React, { useEffect, useRef, useState } from 'react';
import { usePrefix } from './PrefixContext';

export type AnimationName =
  | 'fade-in' | 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right'
  | 'scale-in' | 'slide-up' | 'slide-down' | 'blur-in' | 'bounce-in'
  | 'spin' | 'pulse';

export type AnimationDuration = 'fast' | 'normal' | 'slow' | 'slower' | 'slowest';
export type AnimationEasing = 'out' | 'in-out' | 'spring';

export interface AnimateBaseProps {
  animation?: AnimationName;
  duration?: AnimationDuration;
  delay?: number;
  easing?: AnimationEasing;
  once?: boolean;
  threshold?: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export type AnimateProps<T extends React.ElementType = 'div'> = AnimateBaseProps &
  Omit<React.ComponentPropsWithoutRef<T>, keyof AnimateBaseProps> & {
    as?: T;
  };

const AnimateInner = <T extends React.ElementType = 'div'>(
  props: AnimateProps<T>,
  ref: React.ForwardedRef<React.ComponentRef<T>>,
) => {
  const {
    animation = 'fade-up',
    duration,
    delay,
    easing,
    once = true,
    threshold = 0.2,
    as,
    className = '',
    style,
    children,
    ...rest
  } = props;

  const Tag = (as || 'div') as React.ElementType;
  const prefix = usePrefix();
  const internalRef = useRef<HTMLElement>(null);
  const resolvedRef = (ref || internalRef) as React.Ref<HTMLElement>;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = (resolvedRef as React.RefObject<HTMLElement>).current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold]);

  const animClasses = [
    `${prefix}-anim--${animation}`,
    duration && duration !== 'normal' ? `${prefix}-anim--duration-${duration}` : '',
    easing && easing !== 'out' ? `${prefix}-anim--ease-${easing}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const animStyle: React.CSSProperties = {
    ...(delay ? ({ '--ctp-anim-delay': `${delay}ms` } as React.CSSProperties) : {}),
    ...(visible ? {} : { animationPlayState: 'paused' }),
    ...style,
  };

  return (
    <Tag ref={resolvedRef} className={animClasses} style={animStyle} {...rest}>
      {children}
    </Tag>
  );
};

const ForwardedAnimate = React.forwardRef(
  AnimateInner as React.ForwardRefRenderFunction<any, any>,
);

(ForwardedAnimate as any).displayName = 'Animate';

export const Animate = ForwardedAnimate as <
  T extends React.ElementType = 'div',
>(
  props: AnimateProps<T> & React.RefAttributes<React.ComponentRef<T>>,
) => React.ReactElement;
