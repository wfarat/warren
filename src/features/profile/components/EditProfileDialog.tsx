import { Dialog, Input, MediaDialog, TabNav, type TabOption } from '@/components';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/store';
import { selectAvatarCacheBuster, selectProfile, triggerAvatarRefresh } from '@/features';
import { AdvancedImage } from '@cloudinary/react';
import { cld, uploadProfilePicture } from '@/api';
import { fill } from '@cloudinary/url-gen/actions/resize';
import type { Media } from '@/types';

type Props = {
  onClose: () => void;
  onSubmit: (updatedData: FormValues & { bannerFile?: File }) => void;
};

type Tab = 'general' | 'personal' | 'work';

export type FormValues = {
  name: string;
  location: string;
  bio: string;
  bannerUrl?: string;
  bannerPublicId?: string;
};

const TAB_OPTIONS: TabOption<Tab>[] = [
  { id: 'general', label: 'General' },
  { id: 'personal', label: 'Personal Info' },
  { id: 'work', label: 'Work History' },
];

export function EditProfileDialog({ onClose, onSubmit }: Props) {
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector(selectProfile);
  const cacheBuster = useAppSelector(selectAvatarCacheBuster);

  const [tab, setTab] = useState<Tab>('general');

  const [activeMediaTarget, setActiveMediaTarget] = useState<'photo' | 'banner' | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | undefined>(undefined);
  const [bannerFile, setBannerFile] = useState<File | undefined>(undefined);
  const [localAvatarPreview, setLocalAvatarPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      name: profile.name || '',
      location: profile.location || '',
      bio: profile.bio || '',
      bannerUrl: profile.banner?.url || '',
      bannerPublicId: profile.banner?.publicId || '',
    },
  });

  const watchedBannerUrl = watch('bannerUrl');
  const watchedBannerPublicId = watch('bannerPublicId');

  const handleMediaSelection = async (media: Media) => {
    if (activeMediaTarget === 'photo') {
      if (avatarFile) {
        setLocalAvatarPreview(URL.createObjectURL(avatarFile));
      } else if (media.url) {
        setAvatarFile(undefined);
        setLocalAvatarPreview(media.url);
      }
    } else if (activeMediaTarget === 'banner') {
      if (bannerFile) {
        const tempBannerUrl = URL.createObjectURL(bannerFile);
        setValue('bannerUrl', tempBannerUrl);
        setValue('bannerPublicId', '');
      } else if (media.url) {
        setBannerFile(undefined);
        setValue('bannerUrl', media.url);
        setValue('bannerPublicId', '');
      }
    }
  };

  const onFormSubmit = async (data: FormValues) => {
    try {
      if (avatarFile) {
        await uploadProfilePicture(avatarFile, profile.id);
        dispatch(triggerAvatarRefresh());
      } else if (localAvatarPreview && localAvatarPreview !== freshAvatarUrl) {
        await uploadProfilePicture(localAvatarPreview, profile.id);
        dispatch(triggerAvatarRefresh());
      }

      onSubmit({
        ...data,
        bannerFile: bannerFile,
      });

      onClose();
    } catch (err) {
      console.error('Failed processing asset change pipelines:', err);
    }
  };

  const cloudinaryAvatar = cld
    .image(`users/${profile.id}/profile`)
    .resize(fill().width(128).height(128))
    .format('auto');
  const freshAvatarUrl = `${cloudinaryAvatar.toURL()}?v=${cacheBuster}`;
  const finalAvatarDisplaySrc = localAvatarPreview || freshAvatarUrl;

  return (
    <>
      <Dialog
        onClose={onClose}
        onSubmit={handleSubmit(onFormSubmit)}
        title="Edit profile"
        disabled={!isValid}
      >
        <TabNav options={TAB_OPTIONS} activeTab={tab} onChange={setTab} />

        <div className="p-6 w-full flex flex-col gap-6">
          {tab === 'general' && (
            <>
              <div className="flex gap-6 items-end">
                <label className="flex flex-col gap-2 text-grey-1 text-xs w-2/3">
                  Cover Image
                  <button
                    type="button"
                    onClick={() => setActiveMediaTarget('banner')}
                    className="border border-grey-2 bg-bg-2 rounded-xl h-24 overflow-hidden relative group cursor-pointer"
                  >
                    {watchedBannerPublicId && (
                      <AdvancedImage
                        className="w-full h-full object-cover"
                        cldImg={cld
                          .image(watchedBannerPublicId)
                          .resize(fill().width(400).height(96))}
                      />
                    )}
                    {watchedBannerUrl && !watchedBannerPublicId && (
                      <img src={watchedBannerUrl} className="w-full h-full object-cover" alt="" />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex-center text-white text-xs font-semibold">
                      Change Cover
                    </div>
                  </button>
                </label>

                <label className="flex flex-col gap-2 text-grey-1 text-xs w-1/3 items-center">
                  Profile Photo
                  <button
                    type="button"
                    onClick={() => setActiveMediaTarget('photo')}
                    className="w-24 h-24 rounded-full border-4 border-bg-3 overflow-hidden relative group cursor-pointer"
                  >
                    <img
                      className="w-full h-full object-cover"
                      src={finalAvatarDisplaySrc}
                      alt=""
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex-center text-white text-[10px] font-semibold text-center px-1">
                      Change Photo
                    </div>
                  </button>
                </label>
              </div>

              <div className="flex gap-6">
                <label className="flex flex-col gap-2 text-grey-1 text-xs w-1/2">
                  Name
                  <Input
                    placeholder="Your name"
                    error={errors.name?.message}
                    {...register('name', { required: 'Name cannot be blank.' })}
                  />
                </label>
                <label className="flex flex-col gap-2 text-grey-1 text-xs w-1/2">
                  Location
                  <Input
                    placeholder="City, Country"
                    error={errors.location?.message}
                    {...register('location', { maxLength: { value: 50, message: 'Too long.' } })}
                  />
                </label>
              </div>

              <label className="flex flex-col gap-2 text-grey-1 text-xs">
                Bio
                <textarea
                  placeholder="Tell us about yourself..."
                  {...register('bio', {
                    maxLength: { value: 160, message: 'Max bio capacity is 160 characters.' },
                  })}
                  className={`bg-bg-2 p-3 rounded-xl h-24 w-full border text-white resize-none focus:outline-none ${
                    errors.bio ? 'border-danger-dark' : 'border-grey-2 focus:border-primary-light'
                  }`}
                />
                {errors.bio && (
                  <p className="text-danger-dark text-xs mt-1">{errors.bio.message}</p>
                )}
              </label>
            </>
          )}

          {tab === 'personal' && (
            <div className="text-white text-sm">Personal configuration submenus...</div>
          )}
          {tab === 'work' && (
            <div className="text-white text-sm">Work layout configurations...</div>
          )}
        </div>
      </Dialog>

      {activeMediaTarget !== null && (
        <MediaDialog
          type="image"
          file={activeMediaTarget === 'photo' ? avatarFile : bannerFile}
          setFile={activeMediaTarget === 'photo' ? setAvatarFile : setBannerFile}
          onClose={() => setActiveMediaTarget(null)}
          action={handleMediaSelection}
        />
      )}
    </>
  );
}
