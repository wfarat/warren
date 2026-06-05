import { fetchProfile, ProfileHero, ProfilePosts } from '@/features/profile';
import { TabNav, type TabOption } from '@/components';
import { useAppDispatch } from '@/store';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';

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
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (userId) {
      dispatch(fetchProfile(userId));
    }
  });
  return (
    <div className="w-full ">
      <main className="w-full relative">
        <div className="relative">
          <ProfileHero />
          <TabNav
            className="absolute bottom-10"
            options={TAB_OPTIONS}
            activeTab={tab}
            onChange={setTab}
          />
        </div>
        {tab === 'posts' && <ProfilePosts userId={userId} />}
      </main>
    </div>
  );
}
