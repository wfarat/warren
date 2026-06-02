import { NewPost } from '@/features/post';
import { RightBar } from '@/components';

export default function Newsfeed() {
  return (
    <main className="flex gap-8 p-8 w-full">
      <div className="flex flex-1 flex-col gap-6">
        <NewPost />
      </div>
      <RightBar>
        <>s</>
      </RightBar>
    </main>
  );
}
