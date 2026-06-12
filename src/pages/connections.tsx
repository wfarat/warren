import { Button, Card, RightBar } from '@/components';
import AddPeople from '@/assets/icons/AddPeople.svg?react';
import People from '@/assets/icons/People.svg?react';
import { ConnectionList, followUsers, SuggestionList } from '@/features';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchConnections } from '@/features/connection/connectionActions.ts';
import { selectConnection } from '@/features/connection/connectionSelectors.ts';
import { FollowNewDialog } from '@/features/connection/components/FollowNewDialog.tsx';
import type { UserListItem } from '@/types';
import { cld } from '@/api';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { NavLink } from 'react-router';

export default function Connections() {
  const dispatch = useAppDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { mutualConnections, pureFollowers, pendingFollowBacks } = useAppSelector(selectConnection);
  useEffect(() => {
    dispatch(fetchConnections());
  }, [dispatch]);
  const handleFollow = (users: UserListItem[]) => {
    dispatch(followUsers(users));
  };
  return (
    <main className="p-8 w-full flex gap-8">
      <div className="w-full">
        <header className="flex-between mb-8">
          <div>
            <h2>Connections</h2>
            <span className="text-grey-1 text-sm">
              You have {mutualConnections.length} professional contacts
            </span>
          </div>
          <Button intent="primary" className="flex gap-2" onClick={() => setDialogOpen(true)}>
            <AddPeople />
            Follow New
          </Button>
          {dialogOpen && (
            <FollowNewDialog onSubmit={handleFollow} onClose={() => setDialogOpen(false)} />
          )}
        </header>
        <ConnectionList connections={mutualConnections} />
        <div>
          <h3>People you may know</h3>
          <SuggestionList followers={pureFollowers} />
        </div>
      </div>
      <RightBar>
        <Card>
          <div className="flex flex-col gap-3">
            <div className="flex-start gap-3">
              <People className="w-6 h-6 fill-on-surface" />
              <h4 className="text-on-surface font-normal text-lg">People You Follow</h4>
            </div>
            {pendingFollowBacks.map((user) => (
              <NavLink
                to={`/profile/${user.targetUserId}`}
                key={user.targetUserId}
                className="flex-start gap-2 p-2 hover:bg-bg-2 rounded-lg"
              >
                <img
                  src={cld
                    .image(`users/${user.targetUserId}/profile`)
                    .resize(fill().width(32).height(32))
                    .toURL()}
                  alt={user.targetUserName}
                  className="w-8 h-8 rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://res.cloudinary.com/dtz3qhhlp/image/upload/v1780652522/placeholder.jpg';
                  }}
                />
                <span className="text-on-surface font-normal text-sm">{user.targetUserName}</span>
              </NavLink>
            ))}
          </div>
        </Card>
      </RightBar>
    </main>
  );
}
