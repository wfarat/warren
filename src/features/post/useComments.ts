import { useEffect } from 'react';
import { postRepo } from '@/api';
import { useAppDispatch, useAppSelector } from '@/store';
import { selectComments, selectCurrentPostId, setComments, setError } from '@/features';

export function useComments() {
  const postId = useAppSelector(selectCurrentPostId);
  const comments = useAppSelector(selectComments);
  const dispatch = useAppDispatch();
  useEffect(() => {
    getComments();
  }, [postId]);

  const getComments = () => {
    if (!postId) return;
    postRepo
      .readComments(postId)
      .then((comments) => dispatch(setComments(comments)))
      .catch((error) => dispatch(setError({ message: error.message, retryAction: 'COMMENTS' })));
  };
  return { comments, getComments };
}
