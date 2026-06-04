import { NewPost } from '@/features/post';
import { ProfileHero, ProfileNav, ProfilePosts, setSelectedUserId } from '@/features/profile';
import { RightBar } from '@/components';
import { useAppDispatch, useAppSelector } from '@/store';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import { selectCurrentUserId } from '@/features';

export default function Profile() {
  const { userId } = useParams();
  const currentUserId = useAppSelector(selectCurrentUserId);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (userId) {
      dispatch(setSelectedUserId(userId));
    }
  });
  return (
    <div className="w-full ">
      <main className="w-full">
        <ProfileHero />
        <ProfileNav />
        <div className="flex gap-8">
          <div className="flex flex-1 flex-col gap-6">
            {currentUserId === userId && <NewPost />}
            <ProfilePosts />
          </div>
          <RightBar>fasdf</RightBar>
        </div>
      </main>
    </div>
  );
}
