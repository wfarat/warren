import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const buttonVariants = cva('rounded-xs cursor-pointer transition-colors flex-center', {
  variants: {
    theme: {
      blue: 'bg-primary hover:bg-primary-light active:bg-primary-dark',
      dark: 'bg-bg-3 hover:text-grey-4',
      grey: 'bg-grey-2 hover:bg-grey-3 text-white/60 hover:text-grey-4',
      'dark-border': 'border border-white/60 hover:bg-grey-2',
      disabled: 'bg-grey-3 cursor-not-allowed text-white/40',
    },
    size: {
      default: 'h-auto w-auto py-2 px-6',
      sm: 'h-9 w-26.25',
      md: 'h-10 w-36.5',
      lg: 'h-10 w-82 sm:w-50',
      xxl: 'h-10 w-64.5',
      icon: 'h-10 w-10',
    },
  },
  defaultVariants: {
    theme: 'blue',
    size: 'default',
  },
});

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ theme, size, children, className, ...props }: ButtonProps) {
  return (
    <button
      // twMerge is needed to merge CVA classes with the className prop
      className={twMerge(buttonVariants({ theme, size, className }))}
      {...props}
    >
      {children}
    </button>
  );
}
