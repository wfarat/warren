import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { cld, messagesRepo } from '@/api';
import {
  clearActiveChat,
  clearMessageDraft,
  selectActiveChatUser,
  selectCurrentMessageDraft,
  selectCurrentUser,
  selectUnreadChats,
  setRead,
  setTypedMessageDraft,
} from '@/features';
import { Button } from '@/components';
import Send from '@/assets/icons/Send.svg?react';
import Back from '@/assets/icons/Back.svg?react';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { AdvancedImage } from '@cloudinary/react';
import type { Message } from '@/types';

export function Chat() {
  const dispatch = useAppDispatch();
  const activeUser = useAppSelector(selectActiveChatUser);
  const currentUser = useAppSelector(selectCurrentUser);
  const chats = useAppSelector(selectUnreadChats(currentUser?.id || ''));
  const currentDraftText = useAppSelector(selectCurrentMessageDraft);
  const [messages, setMessages] = useState<Message[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [_, throwError] = useState();

  useEffect(() => {
    if (!currentUser?.id || !activeUser?.targetUserId) return;

    const unsubscribe = messagesRepo.subscribeToMessages(
      currentUser?.id,
      activeUser?.targetUserId,
      (incomingMessages) => {
        setMessages(incomingMessages);
      },
      (error) => {
        throwError(() => {
          throw error;
        });
      }
    );

    return () => unsubscribe();
  }, [currentUser, activeUser]);
  useEffect(() => {
    if (!currentUser?.id || !activeUser?.targetUserId) return;

    const hasUnread = chats.some((chat) =>
      chat.participants.some((p) => p.id === activeUser.targetUserId)
    );
    if (hasUnread) {
      messagesRepo.readChat(currentUser.id, activeUser.targetUserId);
      dispatch(setRead(activeUser.targetUserId));
    }
  }, [activeUser?.targetUserId, currentUser?.id, chats]);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeUser?.targetUserId) return;
    dispatch(
      setTypedMessageDraft({
        targetUserId: activeUser.targetUserId,
        text: e.target.value,
      })
    );
  };

  const handleSend = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (
      !currentDraftText.trim() ||
      !currentUser?.id ||
      !currentUser?.name ||
      !activeUser?.targetUserId
    )
      return;

    const messageContent = currentDraftText;

    dispatch(clearMessageDraft(activeUser.targetUserId));
    await messagesRepo.sendMessage(
      currentUser?.id,
      activeUser.targetUserId,
      currentUser?.name,
      activeUser.targetUserName,
      messageContent
    );
  };
  const avatarImage = cld
    .image(`users/${activeUser?.targetUserId}/profile`)
    .resize(fill().width(40).height(40))
    .format('auto');
  return (
    <div className="flex flex-col h-120">
      <div className="p-4 flex-between border-b border-grey-2">
        <div className="flex-center gap-2">
          <AdvancedImage cldImg={avatarImage} className="rounded-full" />
          <h4 className="text-on-surface">{activeUser?.targetUserName}</h4>
        </div>
        <Button intent="transparent" size="icon" onClick={() => dispatch(clearActiveChat())}>
          <Back />
        </Button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2">
        {messages.map((msg) => {
          const isMe = msg.authorId === currentUser?.id;
          return (
            <div
              key={msg.id}
              className={`p-2.5 rounded-xl max-w-[75%] text-sm text-white ${
                isMe ? 'bg-primary-container self-end' : 'bg-bg-2 self-start'
              }`}
            >
              {msg.content}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSend} className="p-3 border-t border-grey-2 flex gap-2">
        <input
          type="text"
          value={currentDraftText}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="grow p-2 rounded-lg bg-bg-3 outline-none text-white text-sm"
        />
        <Button type="submit" intent="primary-dark" size="icon">
          <Send className="fill-white" />
        </Button>
      </form>
    </div>
  );
}
