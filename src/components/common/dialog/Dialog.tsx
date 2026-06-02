import React from 'react';
import { createPortal } from 'react-dom';
import Close from '@/assets/icons/Close.svg?react';
import { Button } from '@/components';

type Props = React.PropsWithChildren<{
  onClose: () => void;
  title?: string;
}>;

export function Dialog({ onClose, children, title }: Props) {
  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className="bg-bg-2 shadow-lg relative min-w-xl min-h-1/2
        border border-grey-2 rounded-xl flex-between flex-col
         transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="py-6 px-8 border-b border-grey-2 flex-between w-full">
          {title && <h2 className="text-xl text-on-surface">{title}</h2>}
          <button
            className="w-10 h-10 flex-center rounded-full hover:bg-grey-2 cursor-pointer"
            onClick={onClose}
          >
            <Close className="w-4 h-4 fill-grey-1" />
          </button>
        </div>
        {children}
        <div className="py-6 px-8 bg-bg-3/50 flex-end border-t border-grey-2 w-full">
          <div className="flex gap-4">
            <Button intent="outlined" size="md" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
