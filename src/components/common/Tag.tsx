import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const tagVariants = cva(
  'inline-flex items-center justify-center text-xs font-medium rounded-lg transition-colors py-1 px-3',
  {
    variants: {
      intent: {
        clickable:
          'bg-grey-2 border border-grey-1/20 hover:bg-grey-1/30 cursor-pointer text-on-surface',
        showcase: 'bg-secondary-container/20 text-secondary-light cursor-default',
      },
    },
    defaultVariants: {
      intent: 'showcase',
    },
  }
);

interface TagProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof tagVariants> {
  onClick?: () => void;
}

export function Tag({ intent, children, className, onClick, ...props }: TagProps) {
  const finalIntent = onClick ? 'clickable' : intent;

  return (
    <span
      className={twMerge(tagVariants({ intent: finalIntent, className }))}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      #{children}
    </span>
  );
}
