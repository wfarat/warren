import type { RootState } from '@/store';

export const selectMessages = (state: RootState) => state.messages;
export const selectActiveChatUser = (state: RootState) => state.messages.activeChatUser;
export const selectAllChatsInbox = (state: RootState) => state.messages.chats;
export const selectIsOpen = (state: RootState) => state.messages.isOpen;
export const selectCurrentMessageDraft = (state: RootState) => {
  const activeId = state.messages.activeChatUser?.targetUserId;
  if (!activeId) return '';
  return state.messages.messageInputs[activeId] || '';
};

export const selectUnreadChats = (currentUserId: string) => (state: RootState) => {
  return state.messages.chats.filter(
    (chat) => chat.lastMessageAuthorId !== currentUserId && !chat.lastMessageRead
  );
};
export const selectUnreadChatsNumber = (currentUserId: string) => (state: RootState) => {
  return selectUnreadChats(currentUserId)(state).length;
};
