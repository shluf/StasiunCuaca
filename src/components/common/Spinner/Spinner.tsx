import type { HTMLAttributes } from 'react';
import clsx from 'clsx';

export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerVariant = 'primary' | 'white' | 'current';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  label?: string;
}

export function Spinner({
  size = 'md',
  variant = 'primary',
  label,
  className,
  ...props
}: SpinnerProps) {
  const sizeStyles: Record<SpinnerSize, string> = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  };

  const variantStyles: Record<SpinnerVariant, string> = {
    primary: 'border-sky-500 border-t-transparent',
    white: 'border-white border-t-transparent',
    current: 'border-current border-t-transparent',
  };

  return (
    <div
      className={clsx('inline-flex flex-col items-center gap-2', className)}
      role="status"
      aria-label={label || 'Loading'}
      {...props}
    >
      <div
        className={clsx(
          'animate-spin rounded-full',
          sizeStyles[size],
          variantStyles[variant]
        )}
      />
      {label && (
        <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      )}
    </div>
  );
}

// Loading overlay composition
export interface LoadingOverlayProps {
  isLoading: boolean;
  label?: string;
  blur?: boolean;
}

export function LoadingOverlay({
  isLoading,
  label = 'Loading...',
  blur = true,
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div
      className={clsx(
        'absolute inset-0 z-50 flex items-center justify-center',
        'bg-white/80 dark:bg-gray-900/80',
        blur && 'backdrop-blur-sm'
      )}
    >
      <Spinner size="lg" label={label} />
    </div>
  );
}

// Full page loading
export interface FullPageLoadingProps {
  label?: string;
}

export function FullPageLoading({ label = 'Loading...' }: FullPageLoadingProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center">
        <Spinner size="xl" />
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">{label}</p>
      </div>
    </div>
  );
}
