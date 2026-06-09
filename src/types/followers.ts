export type Follower = {
  targetUserId: string;
  targetUserName: string;
};

export type FollowerDoc = {
  userId: string;
  list: Follower[];
};
