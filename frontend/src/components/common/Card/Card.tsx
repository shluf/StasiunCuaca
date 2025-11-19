import type { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

export type CardVariant = 'default' | 'bordered' | 'elevated';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  noPadding?: boolean;
  children: ReactNode;
}

export function Card({
  variant = 'default',
  noPadding = false,
  children,
  className,
  ...props
}: CardProps) {
  const baseStyles = 'rounded-lg transition-all duration-200';

  const variantStyles: Record<CardVariant, string> = {
    default: 'bg-white dark:bg-gray-800 shadow-sm',
    bordered: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    elevated: 'bg-white dark:bg-gray-800 shadow-md hover:shadow-lg',
  };

  const paddingStyles = noPadding ? '' : 'p-4 sm:p-6';

  return (
    <div
      className={clsx(
        baseStyles,
        variantStyles[variant],
        paddingStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Card sub-components for better composition
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardHeader({ children, className, ...props }: CardHeaderProps) {
  return (
    <div
      className={clsx('mb-4 border-b border-gray-200 dark:border-gray-700 pb-3', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export function CardTitle({ children, className, ...props }: CardTitleProps) {
  return (
    <h3
      className={clsx('text-lg font-semibold text-gray-900 dark:text-white', className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardBody({ children, className, ...props }: CardBodyProps) {
  return (
    <div className={clsx('text-gray-700 dark:text-gray-300', className)} {...props}>
      {children}
    </div>
  );
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardFooter({ children, className, ...props }: CardFooterProps) {
  return (
    <div
      className={clsx('mt-4 pt-3 border-t border-gray-200 dark:border-gray-700', className)}
      {...props}
    >
      {children}
    </div>
  );
}
