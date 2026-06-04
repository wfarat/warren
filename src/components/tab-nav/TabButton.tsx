import React from 'react';
import { twMerge } from 'tailwind-merge';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  active: boolean;
};
export function TabButton({ label, onClick, active }: Props) {
  const activeClass = active ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant';
  return (
    <button className={twMerge(activeClass, 'py-4 px-6')} onClick={onClick}>
      {label}
    </button>
  );
}
