import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive';
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all',
          variant === 'destructive' && 'border-red-500 bg-red-50 text-red-900',
          variant === 'default' && 'border-blue-500 bg-blue-50 text-blue-900',
          className
        )}
        {...props}
      />
    );
  }
);
Toast.displayName = 'Toast';

export { Toast };
