import { selectAllChatsInbox, selectCurrentUserId, setActiveChatUser } from '@/features';
import { useAppDispatch, useAppSelector } from '@/store';
import { cld } from '@/api';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { AdvancedImage } from '@cloudinary/react';
import { getTimeText } from '@/utils/timeUtils.ts';

export function RecentChatsInbox() {
  const dispatch = useAppDispatch();
  const currentUserId = useAppSelector(selectCurrentUserId);
  const chats = useAppSelector(selectAllChatsInbox);

  const onSelectChat = (targetUser: { id: string; name: string }) => {
    dispatch(setActiveChatUser({ targetUserName: targetUser.name, targetUserId: targetUser.id }));
  };
  return (
    <div className="flex flex-col gap-2 h-120 overflow-y-auto">
      {chats.map((chat) => {
        const targetUser = chat.participants.find((p) => p.id !== currentUserId);
        if (!targetUser) return null;
        const avatarImage = cld
          .image(`users/${targetUser.id}/profile`)
          .resize(fill().width(40).height(40))
          .format('auto');
        return (
          <div
            key={chat.id}
            onClick={() => onSelectChat(targetUser)}
            className="flex-between p-4 hover:bg-white/5 cursor-pointer border-b border-grey-2/50 text-white w-full"
          >
            <div className="flex-center gap-4 min-w-0 flex-1">
              <AdvancedImage cldImg={avatarImage} className="rounded-full shrink-0" />

              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">{targetUser.name}</div>
                <div className="text-xs text-white/60 truncate">{chat.lastMessageText}</div>
              </div>
            </div>

            <div className="text-xs text-white/60 shrink-0 ml-4">
              {getTimeText(new Date(chat.lastMessageSentAt))} ago
            </div>
          </div>
        );
      })}
    </div>
  );
}
