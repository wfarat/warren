import React from 'react';
import { twMerge } from 'tailwind-merge';

type CardProps = React.ComponentPropsWithoutRef<'div'>;
export function Card({ children, className }: CardProps) {
  return (
    <div
      className={twMerge(
        className,
        'border border-grey-2 bg-bg-3 p-6 relative flex flex-col gap-4 rounded-xl drop-shadow-bg-3'
      )}
    >
      {children}
    </div>
  );
}
