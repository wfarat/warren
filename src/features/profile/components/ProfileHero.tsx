import { AdvancedImage } from '@cloudinary/react';
import { cld, uploadImage, userRepo } from '@/api';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { Button, MediaDialog } from '@/components';
import Camera from '@/assets/icons/Camera.svg?react';
import { useAppDispatch, useAppSelector } from '@/store';
import { selectCurrentUserId, selectProfile, setProfilePhoto } from '@/features';
import { useMediaDialog } from '@/hooks';
import { useState } from 'react';
import type { Media } from '@/types';
import Edit from '@/assets/icons/Edit.svg?react';

export function ProfileHero() {
  const { profile } = useAppSelector(selectProfile);
  const [file, setFile] = useState<File | undefined>();
  const currentUserId = useAppSelector(selectCurrentUserId);
  const { open, close, isOpen } = useMediaDialog();
  const dispatch = useAppDispatch();
  const handlePhoto = async (media: Media) => {
    if (file) {
      const publicId = await uploadImage(file);
      dispatch(setProfilePhoto({ publicId }));
      await userRepo.updateUserProfile(profile.id, { photo: { publicId } });
    } else if (media.url) {
      dispatch(setProfilePhoto({ url: media.url }));
      await userRepo.updateUserProfile(profile.id, { photo: { url: media.url } });
    }
  };
  return (
    <div>
      <AdvancedImage cldImg={cld.image('cld-sample-2').resize(fill().height(320).width(1240))} />
      <div className="flex items-start">
        <div className="-translate-y-1/2 pl-8">
          <div className="relative w-48 h-48">
            {profile.photo?.url && (
              <img
                src={profile.photo.url}
                alt="profile"
                className="w-full h-full rounded-xl border-4 border-bg-2 shadow-xl"
              />
            )}
            {profile.photo?.publicId && (
              <AdvancedImage
                className="rounded-xl border-4 border-bg-2 shadow-xl w-full h-full   "
                cldImg={cld.image(profile.photo?.publicId).resize(fill().height(192).width(192))}
              />
            )}
            {profile.id === currentUserId && (
              <Button size="icon" onClick={open} className="absolute bottom-2 right-2">
                <Camera className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="flex-between w-full p-6">
          <h2>{profile.name}</h2>
          <Button className="gap-2">
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
