import {
  fetchProfilePosts,
  NewPost,
  PostList,
  selectCurrentUserId,
  selectProfile,
  selectProfilePosts,
} from '@/features';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { Button, Card, RightBar } from '@/components';
import Work from '@/assets/icons/Work.svg?react';
import Location from '@/assets/icons/Location.svg?react';
import Link from '@/assets/icons/Link.svg?react';
import News from '@/assets/icons/News.svg?react';

export function ProfilePosts({ userId, openDialog }: { userId: string; openDialog: () => void }) {
  const dispatch = useAppDispatch();
  const profilePosts = useAppSelector(selectProfilePosts);
  const { selectedUserId, profile } = useAppSelector(selectProfile);
  const currentUserId = useAppSelector(selectCurrentUserId);

  useEffect(() => {
    if (profilePosts.length === 0 && selectedUserId) {
      dispatch(fetchProfilePosts());
    }
  }, [dispatch, selectedUserId]);

  return (
    <div className="flex gap-8 px-8">
      <div className="flex flex-1 flex-col gap-6">
        {currentUserId === userId && <NewPost />}
        <PostList posts={profilePosts} onProfile />
      </div>
      <RightBar className="max-w-76">
        <Card>
          <h3 className="text-on-surface">Intro</h3>
          <p className="text-on-surface-variant">{profile.bio}</p>
          {profile.profession && (
            <div className="flex items-center gap-3 text-on-surface-variant">
              <Work /> {profile.profession}
            </div>
          )}
          {profile.location && (
            <div className="flex items-center gap-3 text-on-surface-variant">
              <Location />
              {profile.location}
            </div>
          )}
          {profile.website && (
            <div className="flex items-center gap-3 text-on-surface-variant">
              <Link />
              <a href={profile.website} target="_blank" rel="noreferrer">
                {profile.website}
              </a>
            </div>
          )}
          <div className="flex items-center gap-3 text-on-surface-variant">
            <News className="fill-grey-1" />
            Followed by <strong className="text-on-surface">{profile.followers}</strong> people
          </div>
          <Button onClick={openDialog} intent="grey" size="xxl">
            Edit Details
          </Button>
        </Card>
      </RightBar>
    </div>
  );
}
