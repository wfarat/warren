export type Message = {
  id: string;
  authorId: string;
  content: string;
  sentAt: string;
  read: boolean;
};

export type ChatMetadata = {
  id: string;
  participants: { id: string; name: string }[];
  lastMessageSentAt: string;
  lastMessageText: string;
  lastMessageRead: boolean;
  lastMessageAuthorId: string;
};
