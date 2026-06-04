import React from 'react';
import { twMerge } from 'tailwind-merge';

export function RightBar({
  children,
  withBorder,
}: {
  children: React.ReactNode;
  withBorder?: boolean;
}) {
  return (
    <div className={twMerge('min-w-100', withBorder ? 'border-l border-grey-2' : '')}>
      {children}
    </div>
  );
}
