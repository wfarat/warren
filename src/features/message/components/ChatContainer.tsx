import { useAppSelector } from '@/store';
import { Chat, RecentChatsInbox, selectMessages } from '@/features';

export function ChatContainer() {
  const { activeChatUser, isOpen } = useAppSelector(selectMessages);
  return (
    <div
      className={`
        grid transition-all duration-300 ease-in-out w-80 bg-bg-4 border-x border-grey-2
        ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}
      `}
    >
      <div className="overflow-hidden">{activeChatUser ? <Chat /> : <RecentChatsInbox />}</div>
    </div>
  );
}
