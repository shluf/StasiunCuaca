import clsx from 'clsx';
import type { ReactNode } from 'react';

export interface ContainerProps {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
  className?: string;
}

const MAX_WIDTH_CLASSES = {
  sm: 'max-w-screen-sm',     // 640px
  md: 'max-w-screen-md',     // 768px
  lg: 'max-w-screen-lg',     // 1024px
  xl: 'max-w-screen-xl',     // 1280px
  '2xl': 'max-w-screen-2xl', // 1536px
  full: 'max-w-full',
};

export function Container({
  children,
  maxWidth = 'xl',
  padding = true,
  className,
}: ContainerProps) {
  return (
    <div
      className={clsx(
        'mx-auto w-full',
        MAX_WIDTH_CLASSES[maxWidth],
        padding && 'px-4 sm:px-6 lg:px-8',
        className
      )}
    >
      {children}
    </div>
  );
}
