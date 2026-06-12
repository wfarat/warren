import React from 'react';
import { twMerge } from 'tailwind-merge';

type CardProps = React.ComponentPropsWithoutRef<'div'> & {
  orientation?: 'horizontal' | 'vertical';
};
export function Card({ children, className, orientation }: CardProps) {
  return (
    <div
      className={twMerge(
        className,
        orientation === 'vertical' ? 'w-full flex-row' : 'flex-col',
        'border border-grey-2 bg-bg-3 p-6 relative flex gap-4 rounded-xl drop-shadow-bg-3'
      )}
    >
      {children}
    </div>
  );
}
