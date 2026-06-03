import * as React from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  text: string;
  textClass?: string;
  filled?: boolean;
  buttonClass?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function IconButton({ icon: Icon, text, onClick, filled, textClass, buttonClass }: Props) {
  return (
    <button
      type="button"
      className={twMerge(
        'p-2 flex-center gap-2 hover:bg-grey-2 rounded-lg cursor-pointer',
        buttonClass
      )}
      onClick={onClick}
    >
      <Icon
        fill={filled ? 'currentColor' : 'none'}
        stroke={filled === undefined || filled ? 'none' : 'currentColor'}
      />
      <span className={textClass ?? 'text-grey-5'}>{text}</span>
    </button>
  );
}
