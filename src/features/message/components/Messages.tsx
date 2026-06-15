import Mail from '@/assets/icons/mail.svg?react';
import ArrowStroke from '@/assets/icons/ArrowStroke.svg?react';
import { createPortal } from 'react-dom';
import { useState } from 'react';
import { MessagesList } from '@/features';

export function Messages() {
  const [isOpen, setIsOpen] = useState(false);
  return createPortal(
    <div
      className="flex flex-col fixed bottom-0 right-8
   "
    >
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="rounded-t-xl px-4 h-12 w-80 cursor-pointer flex-between bg-primary-container text-white"
      >
        <div className="flex-center gap-2">
          <Mail /> Messages <div className="bg-red py-0.5 px-1.5 rounded-full">3</div>
        </div>
        <ArrowStroke />
      </div>
      <MessagesList isOpen={isOpen} />
    </div>,
    document.body
  );
}
