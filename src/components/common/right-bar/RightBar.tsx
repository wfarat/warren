import React from 'react';
import { twMerge } from 'tailwind-merge';

type Props = React.PropsWithChildren<{
  withBorder?: boolean;
  className?: string;
}>;
export function RightBar({ children, withBorder, className }: Props) {
  return (
    <div className={twMerge('min-w-100', withBorder ? 'border-l border-grey-2' : '', className)}>
      {children}
    </div>
  );
}
