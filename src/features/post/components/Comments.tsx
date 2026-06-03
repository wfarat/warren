import { useComments } from '@/features/post/useComments.ts';
import { Comment } from '@/features/post/components/Comment.tsx';
import { AddComment } from '@/features/post/components/AddComment.tsx';

export function Comments() {
  const { comments } = useComments();
  return (
    <div className="sticky top-18.5 w-full flex flex-col gap-2">
      <div className="px-6 py-5 flex-between border-b border-grey-2">
        <h3 className="text-on-surface text-2xl font-bold">Comments</h3>
        <span className="text-grey-1 text-sm">Total: {comments.length}</span>
      </div>
      <div className="px-4 flex flex-col gap-6">
        {comments.map((comment) => (
          <Comment key={comment.id} {...comment} />
        ))}
      </div>
      <AddComment className="fixed w-100 bottom-0 p-4 border-t border-grey-2" />
    </div>
  );
}
