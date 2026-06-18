import { useAppDispatch, useAppSelector } from '@/store';
import { Chat, RecentChatsInbox, selectMessages, clearActiveChat } from '@/features';
import { ErrorBoundary } from '@/components';

export function ChatContainer() {
  const dispatch = useAppDispatch();
  const { activeChatUser, isOpen } = useAppSelector(selectMessages);

  return (
    <div
      className={`
        grid transition-all duration-300 ease-in-out w-80 bg-bg-4 border-x border-grey-2
        ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}
      `}
    >
      <div className="overflow-hidden">
        <ErrorBoundary
          key={activeChatUser?.targetUserId || 'inbox'}
          onReset={() => {
            dispatch(clearActiveChat());
          }}
        >
          {activeChatUser ? <Chat /> : <RecentChatsInbox />}
        </ErrorBoundary>
      </div>
    </div>
  );
}
