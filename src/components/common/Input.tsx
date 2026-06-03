import Close from '@/assets/icons/Close.svg?react';
import { cva, type VariantProps } from 'class-variance-authority';
import React, { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import type { Validity } from '@/types/util.ts';

const inputVariants = cva(
  'w-full bg-bg-3 border border-grey-2 py-2 px-4 focus:outline-none rounded-xl',
  {
    variants: {
      hasError: {
        true: 'border-danger-dark',
        false: 'border-grey-2 hover:border-primary-light focus:border-primary-light',
      },
    },
  }
);
interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {
  validation?: (value: string) => string | null;
  setValid: Dispatch<SetStateAction<Validity>>;
}

export function Input({ onChange, className, validation, setValid, ...props }: InputProps) {
  const [error, setError] = React.useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    if (!dirty || !props.value) {
      return;
    }

    const value = String(props.value);

    const validationError = validation ? validation(value.trim()) : null;

    setValid((prev) => ({ ...prev, [props.name!]: !validationError }));
    setError(validationError);
  }, [props.value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!dirty) {
      setDirty(true);
    }
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="w-full">
      <div className="relative w-full">
        <input
          {...props}
          className={twMerge(inputVariants({ className, hasError: !!error }))}
          onChange={handleChange}
        />
        {error && (
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 flex w-4 h-4
          rounded-full bg-danger-dark flex-center"
          >
            <Close className="w-2 h-2 fill-grey-2" />
          </div>
        )}
      </div>
      {error && <p className="whitespace-pre-line text-danger-dark text-xs mt-1">{error}</p>}
    </div>
  );
}
