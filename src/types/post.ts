export type Author = {
  userId: string;
  displayName: string;
  photoUrl: string;
};

export type PostInput = {
  content: string;
  media?: Media;
};

export type Media = {
  url: string;
  type: MediaType;
};

export type Comment = {
  id: string;
  content: string;
  author: Author;
  createdAt: any;
};

export type MediaType = 'image' | 'video' | 'poll';

export type Post = PostInput & {
  id: string;
  author: Author;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  createdAt: any;
};

export type LivePostInteractions = {
  likes: string[];
  shares: string[];
};
