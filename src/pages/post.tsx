import { Comments, fetchPost, PostCard, selectPost, setCurrentPostId } from '@/features/post';
import { RightBar } from '@/components';
import { useAppDispatch, useAppSelector } from '@/store';
import { useParams } from 'react-router';
import { useEffect } from 'react';

export default function Post() {
  const { postId } = useParams();
  const { currentPost, currentPostId } = useAppSelector(selectPost);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (postId) {
      dispatch(setCurrentPostId(postId));
      if (!currentPost) {
        fetchPost(postId);
      }
    }
  });
  return (
    <main className="w-full flex">
      <div className="p-6">
        {currentPost ? <PostCard full timelinePost={currentPost} /> : <div>Loading post...</div>}
      </div>
      <RightBar withBorder={!!currentPostId}>{currentPostId && <Comments />}</RightBar>
    </main>
  );
}
