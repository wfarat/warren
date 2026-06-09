import { Button, Card } from '@/components';
import type { Follower } from '@/types/followers.ts';
import { cld } from '@/api';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { AdvancedImage } from '@cloudinary/react';
import Chat from '@/assets/icons/Chat.svg?react';
import { NavLink } from 'react-router';
import React from 'react';

type Props = {
  connection: Follower;
};

export const ConnectionCard = ({ connection }: Props) => {
  const avatarImage = cld
    .image(`users/${connection.targetUserId}/profile`)
    .resize(fill().width(64).height(64))
    .format('auto');

  const handleChatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card className="w-60 relative group transition-transform hover:-translate-y-2 hover:shadow-xl shadow-bg-3">
      <NavLink
        to={`/profile/${connection.targetUserId}`}
        className="absolute inset-0 z-10"
        aria-label={`View ${connection.targetUserName}'s profile`}
      />

      <div className="flex justify-between items-start">
        <AdvancedImage cldImg={avatarImage} className="rounded-xl" />

        <Button
          size="icon"
          intent="transparent"
          onClick={handleChatClick}
          type="button"
          className="relative z-20 hover:scale-110 transition-transform"
        >
          <Chat />
        </Button>
      </div>

      <h4 className="text-on-surface relative z-20 pointer-events-none">
        {connection.targetUserName}
      </h4>
    </Card>
  );
};
