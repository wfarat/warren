import { AdvancedImage } from '@cloudinary/react';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { cld } from '@/api';
import { Button, Card, Tag } from '@/components';
import type { Group } from '@/types';

interface GroupCardProps {
  group: Group;
  isJoined?: boolean;
  onJoin?: (groupId: string) => void;
  onTagClick?: (tag: string) => void;
  orientation?: 'horizontal' | 'vertical';
}

export function GroupCard({ group, isJoined = false, onJoin, onTagClick }: GroupCardProps) {
  const bannerImage = group.bannerPublicId
    ? cld.image(group.bannerPublicId).resize(fill().width(400).height(160)).format('auto')
    : null;

  return (
    <Card className="overflow-hidden p-0 gap-0 bg-bg-3 border-grey-2">
      <div className="w-full h-32 relative bg-bg-2 overflow-hidden">
        {bannerImage ? (
          <AdvancedImage
            cldImg={bannerImage}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : group.bannerUrl ? (
          <img
            src={group.bannerUrl}
            alt=""
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-container/20 to-bg-4 text-white/20 text-xs">
            No Cover Image
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="text-white font-semibold text-base tracking-tight truncate">
            {group.name}
          </h3>
          <p className="text-grey-1 text-xs line-clamp-2 min-h-8 leading-relaxed">
            {group.description}
          </p>
          <p className="text-grey-1 text-xs line-clamp-2 min-h-8 leading-relaxed">
            {group.members.length} member{group.members.length > 1 && 's'}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 py-1">
          {group.tags.map((tag) => (
            <Tag key={tag} onClick={onTagClick ? () => onTagClick(tag) : undefined}>
              {tag}
            </Tag>
          ))}
        </div>

        {onJoin && (
          <div className="mt-2 w-full">
            <Button
              intent={isJoined ? 'secondary' : 'primary-dark'}
              size="default"
              className="w-full py-2 text-xs font-semibold"
              onClick={() => !isJoined && onJoin(group.id)}
              disabled={isJoined}
            >
              {isJoined ? 'Member' : 'Join Community'}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
