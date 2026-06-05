import {
  fetchProfilePosts,
  NewPost,
  PostList,
  selectCurrentUserId,
  selectProfile,
  selectProfilePosts,
} from '@/features';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { Card, RightBar } from '@/components';

export function ProfilePosts({ userId }: { userId: string }) {
  const dispatch = useAppDispatch();
  const profilePosts = useAppSelector(selectProfilePosts);
  const { selectedUserId } = useAppSelector(selectProfile);
  const currentUserId = useAppSelector(selectCurrentUserId);

  useEffect(() => {
    if (profilePosts.length === 0 && selectedUserId) {
      dispatch(fetchProfilePosts());
    }
  }, [dispatch, selectedUserId]);

  return (
    <div className="flex gap-8 px-8">
      <div className="flex flex-1 flex-col gap-6">
        {currentUserId === userId && <NewPost />}
        <PostList posts={profilePosts} onProfile />
      </div>
      <RightBar>
        <Card></Card>
      </RightBar>
    </div>
  );
}
