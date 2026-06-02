import * as React from 'react';

type Props = {
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  text: string;
  textClass?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function IconButton({ icon: Icon, text, onClick, textClass }: Props) {
  return (
    <button
      type="button"
      className="p-2 flex-center gap-2 hover:bg-grey-2 rounded-lg cursor-pointer"
      onClick={onClick}
    >
      <Icon />
      <span className={textClass ?? 'text-grey-5'}>{text}</span>
    </button>
  );
}
