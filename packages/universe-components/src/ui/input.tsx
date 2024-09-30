'use client';

import * as React from 'react';

import { cn } from '~/shadCnUtil';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, id, type, ...props }, ref) => {
    return (
      <input
        type={type}
        id={id}
        className={cn(
          'flex h-10 text-lg w-full rounded-full bg-white dark:bg-slate-500 px-3 py-2 ring-offset-background focus:ring-1 focus:ring-slate-300 focus:border-0 border-slate-300 dark:border-none',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
