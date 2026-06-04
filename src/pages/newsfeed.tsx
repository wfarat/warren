import { Comments, NewPost, selectCurrentPostId, Timeline } from '@/features/post';
import { RightBar } from '@/components';
import { useAppSelector } from '@/store';

export default function Newsfeed() {
  const currentPostId = useAppSelector(selectCurrentPostId);
  return (
    <div className="flex gap-8 w-full ">
      <main className="p-8 w-full">
        <div className="flex flex-1 flex-col gap-6">
          <NewPost />
          <Timeline />
        </div>
      </main>
      <RightBar withBorder={!!currentPostId}>{currentPostId && <Comments />}</RightBar>
    </div>
  );
}
