export type Author = {
  userId: string;
  displayName: string;
};

export type PostInput = {
  content: string;
  media?: Media;
};

export type Media = {
  url?: string;
  publicId?: string;
  type: MediaType;
};

export type Comment = {
  id: string;
  content: string;
  author: Author;
  likes: string[];
  replies: string[];
  createdAt: string;
  isReply?: boolean;
};

export type MediaType = 'image' | 'video' | 'poll';

export type Post = PostInput & {
  id: string;
  author: Author;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  createdAt: string;
};

export type LivePostInteractions = {
  likes: string[];
  shares: string[];
};
