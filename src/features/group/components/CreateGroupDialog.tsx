import { Dialog, Input, MediaDialog } from '@/components';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { cld } from '@/api';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { AdvancedImage } from '@cloudinary/react';
import type { CreateGroupData, CreateGroupValues, Media } from '@/types';

type Props = {
  onClose: () => void;
  onSubmit: (groupData: CreateGroupData) => void;
};

export function CreateGroupDialog({ onClose, onSubmit }: Props) {
  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | undefined>(undefined);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<CreateGroupValues>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      tags: '',
      bannerUrl: '',
      bannerPublicId: '',
    },
  });

  const watchedBannerUrl = watch('bannerUrl');
  const watchedBannerPublicId = watch('bannerPublicId');

  const handleBannerSelection = async (media: Media) => {
    if (bannerFile) {
      const tempBannerUrl = URL.createObjectURL(bannerFile);
      setValue('bannerUrl', tempBannerUrl);
      setValue('bannerPublicId', '');
    } else if (media.url) {
      setBannerFile(undefined);
      setValue('bannerUrl', media.url);
      setValue('bannerPublicId', '');
    }
  };

  const onFormSubmit = (data: CreateGroupValues) => {
    onSubmit({
      ...data,
      bannerFile: bannerFile,
    });
    onClose();
  };

  return (
    <>
      <Dialog
        onClose={onClose}
        onSubmit={handleSubmit(onFormSubmit)}
        title="Create new group"
        disabled={!isValid}
      >
        <div className="p-6 w-full flex flex-col gap-6">
          <label className="flex flex-col gap-2 text-grey-1 text-xs w-full">
            Group Cover Image
            <button
              type="button"
              onClick={() => setIsBannerDialogOpen(true)}
              className="border border-grey-2 bg-bg-2 rounded-xl h-32 overflow-hidden relative group cursor-pointer"
            >
              {watchedBannerPublicId && (
                <AdvancedImage
                  className="w-full h-full object-cover"
                  cldImg={cld.image(watchedBannerPublicId).resize(fill().width(600).height(128))}
                />
              )}
              {watchedBannerUrl && !watchedBannerPublicId && (
                <img src={watchedBannerUrl} className="w-full h-full object-cover" alt="" />
              )}
              {!watchedBannerUrl && !watchedBannerPublicId && (
                <div className="w-full h-full flex flex-col justify-center items-center gap-1 text-white/40">
                  <span className="text-sm">No cover photo selected</span>
                  <span className="text-[10px]">Click to browse gallery</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex-center text-white text-xs font-semibold">
                Upload Cover Banner
              </div>
            </button>
          </label>

          <div className="flex gap-6">
            <label className="flex flex-col gap-2 text-grey-1 text-xs w-1/2">
              Group Name
              <Input
                placeholder="e.g. Computer Science 2026"
                error={errors.name?.message}
                {...register('name', {
                  required: 'Group name is required.',
                  maxLength: { value: 60, message: 'Name is too long.' },
                })}
              />
            </label>
            <label className="flex flex-col gap-2 text-grey-1 text-xs w-1/2">
              Tags (comma separated)
              <Input
                placeholder="study, coding, exams"
                error={errors.tags?.message}
                {...register('tags', {
                  required: 'Provide at least one tag to categorize the group.',
                })}
              />
            </label>
          </div>

          <label className="flex flex-col gap-2 text-grey-1 text-xs">
            Description
            <textarea
              placeholder="What is this group about? Guidelines, goals, topics..."
              {...register('description', {
                required: 'Group description cannot be left empty.',
                maxLength: { value: 300, message: 'Max layout capacity is 300 characters.' },
              })}
              className={`bg-bg-2 p-3 rounded-xl h-28 w-full border text-white resize-none focus:outline-none ${
                errors.description
                  ? 'border-danger-dark'
                  : 'border-grey-2 focus:border-primary-light'
              }`}
            />
            {errors.description && (
              <p className="text-danger-dark text-xs mt-1">{errors.description.message}</p>
            )}
          </label>
        </div>
      </Dialog>

      {isBannerDialogOpen && (
        <MediaDialog
          type="image"
          file={bannerFile}
          setFile={setBannerFile}
          onClose={() => setIsBannerDialogOpen(false)}
          action={handleBannerSelection}
        />
      )}
    </>
  );
}
