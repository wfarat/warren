import { useAppSelector } from '@/store';
import { selectPost } from '@/features';
import { PostCard } from './PostCard';
import type { Post } from '@/types';

type Props = {
  posts: Post[];
  onProfile?: boolean;
};
export function PostList({ posts, onProfile }: Props) {
  const { isLoading } = useAppSelector(selectPost);

  return (
    <div className="flex flex-col gap-4 mx-auto w-full">
      {posts.map((post) => (
        <PostCard key={post.id} timelinePost={post} onProfile={onProfile} />
      ))}

      {isLoading && <p className="text-center text-gray-500">Loading items...</p>}
    </div>
  );
}
