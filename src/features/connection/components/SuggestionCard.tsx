import { Button, Card } from '@/components';
import type { Follower } from '@/types';
import { NavLink } from 'react-router';
import { cld } from '@/api';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { followUser } from '@/features';
import { useAppDispatch } from '@/store';
import React from 'react';

export function SuggestionCard({ follower }: { follower: Follower }) {
  const dispatch = useAppDispatch();
  const avatarImage = cld
    .image(`users/${follower.targetUserId}/profile`)
    .resize(fill().width(48).height(48))
    .format('auto');

  const handleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(followUser(follower.targetUserId, follower.targetUserName));
  };
  return (
    <NavLink to={`/profile/${follower.targetUserId}`}>
      <Card orientation="vertical" className="bg-bg-2 flex-between">
        <div className="flex gap-4 items-center">
          <img
            src={avatarImage.toURL()}
            className="rounded-full w-12 h-12 object-cover"
            alt="User profile picture"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://res.cloudinary.com/dtz3qhhlp/image/upload/v1780652522/placeholder.jpg';
            }}
          />
          <div className="flex flex-col">
            <h4 className="text-on-surface">{follower.targetUserName}</h4>
            <p className="text-on-surface-variant text-sm">
              @{follower.targetUserName.split(' ')[0]}
            </p>
          </div>
        </div>
        <Button intent="outlined" onClick={handleFollow}>
          ADD CONNECTION
        </Button>
      </Card>
    </NavLink>
  );
}
