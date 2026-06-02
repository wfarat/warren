import * as React from 'react';

type Props = {
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  text: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function DialogButton({ icon: Icon, text, onClick }: Props) {
  return (
    <button type="button" className="p-2 flex-center gap-2" onClick={onClick}>
      <Icon />
      <span className="text-grey-5">{text}</span>
    </button>
  );
}
