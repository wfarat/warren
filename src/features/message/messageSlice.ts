import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ChatMetadata } from '@/types';

interface MessagesState {
  activeChatUser?: { targetUserId: string; targetUserName: string };
  chats: ChatMetadata[];
  messageInputs: Record<string, string>;
  isLoading: boolean;
  isOpen: boolean;
}

const initialState: MessagesState = {
  chats: [],
  messageInputs: {},
  isLoading: false,
  isOpen: false,
};

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setActiveChatUser: (
      state,
      action: PayloadAction<{ targetUserId: string; targetUserName: string }>
    ) => {
      state.activeChatUser = action.payload;
      state.isOpen = true;
    },
    clearActiveChat: (state) => {
      state.activeChatUser = undefined;
    },
    setTypedMessageDraft: (
      state,
      action: PayloadAction<{ targetUserId: string; text: string }>
    ) => {
      const { targetUserId, text } = action.payload;
      state.messageInputs[targetUserId] = text;
    },

    setRead: (state, action: PayloadAction<string>) => {
      state.chats = state.chats.map((chat) => {
        if (chat.participants.some((p) => p.id === action.payload)) {
          return {
            ...chat,
            lastMessageRead: true,
          };
        }
        return chat;
      });
    },
    syncChatList: (state, action: PayloadAction<ChatMetadata[]>) => {
      state.chats = action.payload;
    },

    clearMessageDraft: (state, action: PayloadAction<string>) => {
      delete state.messageInputs[action.payload];
    },

    setMessagesLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    toggleOpen: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const {
  setActiveChatUser,
  setTypedMessageDraft,
  clearActiveChat,
  syncChatList,
  clearMessageDraft,
  setRead,
  toggleOpen,
} = messagesSlice.actions;

export const messagesReducer = messagesSlice.reducer;
