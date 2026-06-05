import Close from '@/assets/icons/Close.svg?react';
import { cva, type VariantProps } from 'class-variance-authority';
import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

const inputVariants = cva(
  'w-full bg-bg-3 border border-grey-2 py-2 px-4 focus:outline-none rounded-xl text-white',
  {
    variants: {
      hasError: {
        true: 'border-danger-dark focus:border-danger-dark',
        false: 'border-grey-2 hover:border-primary-light focus:border-primary-light',
      },
    },
  }
);

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative w-full">
          <input
            {...props}
            ref={ref}
            className={twMerge(inputVariants({ className, hasError: !!error }))}
          />
          {error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex w-4 h-4 rounded-full bg-danger-dark flex-center">
              <Close className="w-2 h-2 fill-grey-2" />
            </div>
          )}
        </div>
        {error && <p className="whitespace-pre-line text-danger-dark text-xs mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input'; // Helpful for debugging React component trees
