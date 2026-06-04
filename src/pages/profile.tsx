import { NewPost } from '@/features/post';
import { fetchProfile, ProfileHero, ProfilePosts } from '@/features/profile';
import { RightBar, TabNav, type TabOption } from '@/components';
import { useAppDispatch, useAppSelector } from '@/store';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { selectCurrentUserId } from '@/features';

type ProfileTab = 'posts' | 'photos' | 'about' | 'more';

const TAB_OPTIONS: TabOption<ProfileTab>[] = [
  { id: 'posts', label: 'Posts' },
  { id: 'photos', label: 'Photos' },
  { id: 'about', label: 'About' },
  { id: 'more', label: 'More' },
];
export default function Profile() {
  const { userId } = useParams();
  const [tab, setTab] = useState('posts');
  const currentUserId = useAppSelector(selectCurrentUserId);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (userId) {
      dispatch(fetchProfile(userId));
    }
  });
  return (
    <div className="w-full ">
      <main className="w-full">
        <ProfileHero />
        <TabNav options={TAB_OPTIONS} activeTab={tab} onChange={setTab} />
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
