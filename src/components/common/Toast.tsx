import Close from '@/assets/icons/Close.svg?react';
import Success from '@/assets/icons/Success.svg?react';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';
import React from 'react';
import { Button } from './Button.tsx';

const toastVariants = cva('flex-center font-base gap-4', {
  variants: {
    type: {
      error: 'bg-danger',
      success: 'bg-primary-light',
    },
    view: {
      default: 'rounded-xl p-3.5',
      mobile: 'flex-col rounded-sm w-75 py-10',
    },
  },
  defaultVariants: {
    type: 'error',
    view: 'default',
  },
});

const closeVariants = cva('flex-center bg-white rounded-full', {
  variants: {
    view: {
      default: 'w-8.5 h-8.5',
      mobile: 'w-20 h-20 mb-5',
    },
  },
  defaultVariants: {
    view: 'default',
  },
});

type ToastProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof toastVariants> & {
    message: string;
    retryCallback?: () => void;
    handleClose: () => void;
    showRetry?: boolean;
  };

export function Toast({
  type,
  view,
  message,
  retryCallback,
  handleClose,
  className,
  showRetry,
  ...props
}: ToastProps) {
  const handleRetry = () => {
    if (retryCallback) {
      handleClose();
      retryCallback();
    }
  };

  return (
    <div className={twMerge(toastVariants({ type, view, className }))} {...props}>
      <button onClick={handleClose} className={twMerge(closeVariants({ view }))}>
        {type === 'success' ? (
          <Success className="w-1/3 h-1/4" />
        ) : (
          <Close className="w-1/5 h-1/5 fill-primary" />
        )}
      </button>
      <span className="font-bold text-sm text-white">
        {type === 'success' ? 'Success!' : 'Oops!'}
      </span>
      <p className="text-white text-sm sm:mr-4">{message}</p>
      {showRetry && (
        <Button
          onClick={handleRetry}
          intent="primary"
          className="mt-6 sm:mt-0"
          size={view === 'mobile' ? 'xxl' : 'md'}
        >
          Try again
        </Button>
      )}
    </div>
  );
}
