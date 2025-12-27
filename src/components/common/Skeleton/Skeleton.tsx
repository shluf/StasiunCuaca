import type { HTMLAttributes } from 'react';
import clsx from 'clsx';

export type SkeletonVariant = 'rectangular' | 'circular' | 'text';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  count?: number;
}

export function Skeleton({
  variant = 'rectangular',
  width,
  height,
  count = 1,
  className,
  style,
  ...props
}: SkeletonProps) {
  const baseStyles = 'animate-pulse bg-gray-300 dark:bg-gray-700';

  const variantStyles: Record<SkeletonVariant, string> = {
    rectangular: 'rounded',
    circular: 'rounded-full',
    text: 'rounded h-4',
  };

  const skeletonStyle = {
    width: width,
    height: height,
    ...style,
  };

  // Render multiple skeletons if count > 1
  if (count > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={clsx(baseStyles, variantStyles[variant], className)}
            style={skeletonStyle}
            {...props}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={clsx(baseStyles, variantStyles[variant], className)}
      style={skeletonStyle}
      {...props}
    />
  );
}

// Predefined skeleton compositions
export function SkeletonCard() {
  return (
    <div className="card">
      <div className="space-y-4">
        <Skeleton variant="text" width="60%" height="1.5rem" />
        <Skeleton variant="text" count={3} />
        <div className="flex gap-2 mt-4">
          <Skeleton variant="circular" width="2.5rem" height="2.5rem" />
          <Skeleton variant="rectangular" width="100%" height="2.5rem" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonWeatherCard() {
  return (
    <div className="card">
      <div className="space-y-4">
        {/* Weather icon */}
        <div className="flex justify-center">
          <Skeleton variant="circular" width="6rem" height="6rem" />
        </div>

        {/* Temperature */}
        <div className="flex justify-center">
          <Skeleton variant="text" width="8rem" height="3rem" />
        </div>

        {/* Condition */}
        <div className="flex justify-center">
          <Skeleton variant="text" width="10rem" height="1.5rem" />
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton variant="text" width="70%" />
              <Skeleton variant="text" width="50%" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonSensorGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton variant="circular" width="2rem" height="2rem" />
              <Skeleton variant="text" width="60%" />
            </div>
            <Skeleton variant="text" width="50%" height="2rem" />
          </div>
        </div>
      ))}
    </div>
  );
}
