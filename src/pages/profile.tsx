import { fetchProfile, ProfileHero, ProfilePosts, updateProfileAction } from '@/features/profile';
import { TabNav, type TabOption } from '@/components';
import { useAppDispatch } from '@/store';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { EditProfileDialog } from '@/features/profile/components/EditProfileDialog.tsx';
import { setSuccess } from '@/features';

type ProfileTab = 'posts' | 'photos' | 'about' | 'more';

type ProfileSubmitPayload = {
  name: string;
  location: string;
  bio: string;
  bannerUrl?: string;
  bannerPublicId?: string;
  bannerFile?: File;
};

const TAB_OPTIONS: TabOption<ProfileTab>[] = [
  { id: 'posts', label: 'Posts' },
  { id: 'photos', label: 'Photos' },
  { id: 'about', label: 'About' },
  { id: 'more', label: 'More' },
];

export default function Profile() {
  const { userId } = useParams();
  const [tab, setTab] = useState<ProfileTab>('posts');
  const [showEditProfileDialog, setShowEditProfileDialog] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (userId) {
      dispatch(fetchProfile(userId));
    }
  }, [userId, dispatch]);

  const onFormSubmit = (payload: ProfileSubmitPayload) => {
    dispatch(
      updateProfileAction(payload, () => {
        dispatch(setSuccess('Profile updated successfully.'));
      })
    );
  };

  return (
    <div className="w-full">
      <main className="w-full relative">
        <div className="relative">
          <ProfileHero openDialog={() => setShowEditProfileDialog(true)} />
          <TabNav
            className="absolute bottom-10"
            options={TAB_OPTIONS}
            activeTab={tab}
            onChange={setTab}
          />
        </div>
        {userId && (
          <>
            {tab === 'posts' && (
              <ProfilePosts openDialog={() => setShowEditProfileDialog(true)} userId={userId} />
            )}
          </>
        )}
      </main>

      {showEditProfileDialog && (
        <EditProfileDialog
          onClose={() => setShowEditProfileDialog(false)}
          onSubmit={onFormSubmit}
        />
      )}
    </div>
  );
}
