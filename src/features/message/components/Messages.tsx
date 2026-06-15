import Mail from '@/assets/icons/Mail.svg?react';
import ArrowStroke from '@/assets/icons/ArrowStroke.svg?react';
import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import { ChatContainer } from '@/features/message/components/ChatContainer.tsx';
import {
  selectCurrentUserId,
  selectIsOpen,
  selectUnreadChatsNumber,
  syncChatList,
  toggleOpen,
} from '@/features';
import { messagesRepo } from '@/api';
import { useAppDispatch, useAppSelector } from '@/store';

export function Messages() {
  const currentUserId = useAppSelector(selectCurrentUserId);
  const dispatch = useAppDispatch();
  const unread = useAppSelector(selectUnreadChatsNumber(currentUserId || ''));
  const isOpen = useAppSelector(selectIsOpen);
  useEffect(() => {
    if (!currentUserId) return;

    const unsubscribe = messagesRepo.subscribeToChatList(currentUserId, (updatedChats) => {
      dispatch(syncChatList(updatedChats));
    });

    return () => unsubscribe();
  }, [currentUserId, dispatch]);
  return createPortal(
    <div
      className="flex flex-col fixed bottom-0 right-8 z-30
   "
    >
      <div
        onClick={() => dispatch(toggleOpen())}
        className="rounded-t-xl px-4 h-12 w-80 cursor-pointer flex-between bg-primary-container text-white"
      >
        <div className="flex-center gap-2">
          <Mail /> Messages
          {unread > 0 && <div className="bg-red py-0.5 px-1.5 rounded-full">{unread}</div>}
        </div>
        <ArrowStroke className={isOpen ? 'rotate-180' : ''} />
      </div>
      <ChatContainer />
    </div>,
    document.body
  );
}
