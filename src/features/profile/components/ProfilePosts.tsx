import { fetchProfilePosts, PostList, selectProfilePosts, selectSelectedUserId } from '@/features';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';

export function ProfilePosts() {
  const dispatch = useAppDispatch();
  const profilePosts = useAppSelector(selectProfilePosts);
  const selectedUserId = useAppSelector(selectSelectedUserId);
  useEffect(() => {
    if (profilePosts.length === 0 && selectedUserId) {
      dispatch(fetchProfilePosts());
    }
  }, [dispatch, selectedUserId]);

  return (
    <>
      <PostList posts={profilePosts} onProfile />
    </>
  );
}
