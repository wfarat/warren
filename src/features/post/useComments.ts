import { useEffect } from 'react';
import { postRepo } from '@/api';
import { useAppDispatch, useAppSelector } from '@/store';
import { selectPost, setComments, setError, setReplies } from '@/features';

export function useComments() {
  const {
    currentPostId: postId,
    comments,
    replies,
    currentReplies,
    currentCommentId,
  } = useAppSelector(selectPost);
  const dispatch = useAppDispatch();
  useEffect(() => {
    getComments();
  }, [postId]);
  useEffect(() => {
    getReplies();
  }, [currentReplies]);
  const getComments = () => {
    if (!postId) return;
    postRepo
      .readComments(postId)
      .then((comments) => dispatch(setComments(comments)))
      .catch((error) => dispatch(setError({ message: error.message, retryAction: 'COMMENTS' })));
  };
  const getReplies = () => {
    if (!postId || !currentReplies || !currentCommentId) return;
    postRepo
      .readReplies(postId, currentReplies)
      .then((replies) => dispatch(setReplies({ replies, id: currentCommentId })))
      .catch((error) => dispatch(setError({ message: error.message, retryAction: 'REPLIES' })));
  };
  return { comments, replies, getComments, getReplies };
}
