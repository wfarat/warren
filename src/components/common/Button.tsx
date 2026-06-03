import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const buttonVariants = cva('rounded-lg cursor-pointer transition-colors flex-center', {
  variants: {
    intent: {
      primary: 'bg-primary hover:bg-primary-light text-on-primary active:bg-primary-dark',
      'primary-dark': 'bg-primary-container text-on-primary-container hover:bg-inverse-primary',
      secondary: 'bg-secondary-container/20 hover:bg-secondary-container/40 text-secondary-light',
      grey: 'bg-bg-3 border border-grey-2 hover:bg-grey-2',
      outlined: 'border border-primary text-primary hover:bg-primary hover:text-on-primary',
      disabled: 'bg-grey-3 cursor-not-allowed text-white/40',
    },
    size: {
      default: 'h-auto w-auto py-2 px-6',
      sm: 'h-9 w-26.25',
      md: 'h-10 w-36.5',
      lg: 'h-10 w-82 sm:w-50',
      xxl: 'h-10 w-64.5',
      icon: 'h-10 w-10 rounded-full',
    },
  },
  defaultVariants: {
    intent: 'primary',
    size: 'default',
  },
});

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export function Button({ intent, size, children, className, ...props }: ButtonProps) {
  return (
    <button
      // twMerge is needed to merge CVA classes with the className prop
      className={twMerge(buttonVariants({ intent, size, className }))}
      {...props}
    >
      {children}
    </button>
  );
}
