export type Follower = {
  targetUserId: string;
  targetUserName: string;
};

export type FollowerDoc = {
  userId: string;
  list: Follower[];
};

export type UserListItem = {
  id: string;
  name: string;
  profession?: string;
};
