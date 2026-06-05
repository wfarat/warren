import { AdvancedImage } from '@cloudinary/react';
import { cld, uploadProfilePicture } from '@/api';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { Button, MediaDialog } from '@/components';
import Camera from '@/assets/icons/Camera.svg?react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  selectAvatarCacheBuster,
  selectCurrentUserId,
  selectProfile,
  triggerAvatarRefresh,
} from '@/features';
import { useMediaDialog } from '@/hooks';
import { useState } from 'react';
import type { Media } from '@/types';
import Edit from '@/assets/icons/Edit.svg?react';

export function ProfileHero({ openDialog }: { openDialog: () => void }) {
  const { profile } = useAppSelector(selectProfile);
  const [file, setFile] = useState<File | undefined>();
  const cacheBuster = useAppSelector(selectAvatarCacheBuster);
  const currentUserId = useAppSelector(selectCurrentUserId);
  const { open, close, isOpen } = useMediaDialog();
  const dispatch = useAppDispatch();
  const handlePhoto = async (media: Media) => {
    if (file) {
      await uploadProfilePicture(file, profile.id);
    } else if (media.url) {
      await uploadProfilePicture(media.url, profile.id);
    }
    dispatch(triggerAvatarRefresh());
  };
  const avatarImage = cld
    .image(`users/${profile.id}/profile`)
    .resize(fill().width(192).height(192))
    .format('auto');
  const freshAvatarUrl = `${avatarImage.toURL()}?v=${cacheBuster}`;
  return (
    <div>
      <div className="w-full h-120 overflow-hidden bg-bg-2 border-b border-grey-2 relative">
        {profile.banner?.publicId ? (
          <AdvancedImage
            className="w-full h-full object-cover"
            cldImg={cld.image(profile.banner.publicId).resize(fill().height(480).width(1240))}
            alt="User profile banner background"
          />
        ) : profile.banner?.url ? (
          <img
            src={profile.banner.url}
            className="w-full h-full object-cover"
            alt="External profile banner backdrop"
          />
        ) : (
          <AdvancedImage
            className="w-full h-full object-cover opacity-60"
            cldImg={cld.image('cld-sample-2').resize(fill().height(480).width(1240))}
            alt="Default placeholder workspace backdrop banner"
          />
        )}
      </div>
      <div className="flex items-start">
        <div className="-translate-y-1/2 pl-8">
          <div className="relative w-48 h-48">
            <img
              alt=""
              className="rounded-xl border-4 border-bg-2 shadow-xl w-full h-full   "
              src={freshAvatarUrl}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://res.cloudinary.com/dtz3qhhlp/image/upload/v1780652522/placeholder.jpg';
              }}
            />
            {profile.id === currentUserId && (
              <Button
                size="icon"
                onClick={() => open('image')}
                className="absolute bottom-2 right-2"
              >
                <Camera className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="flex-between w-full p-6">
          <h2>{profile.name}</h2>
          <Button className="gap-2" onClick={openDialog}>
            <Edit />
            Edit profile
          </Button>
        </div>
      </div>
      {isOpen && (
        <MediaDialog
          type="image"
          onClose={close}
          setFile={setFile}
          file={file}
          action={handlePhoto}
        />
      )}
    </div>
  );
}
