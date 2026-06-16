import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '@/store';
import { setError, setSuccess } from '@/features';
import { Button, Card, Input } from '@/components'; // Your custom components
import { userRepo } from '@/api';

type PasswordFormValues = {
  currentPassword: '';
  newPassword: '';
  confirmPassword: '';
};

export default function Settings() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPasswordValue = watch('newPassword');

  const onSubmit = async (data: PasswordFormValues) => {
    setIsLoading(true);
    try {
      await userRepo.changePassword(data.currentPassword, data.newPassword);

      dispatch(setSuccess('Password updated successfully!'));
      reset();
    } catch (err: any) {
      console.error('Password change failure:', err);

      let friendlyMessage = 'Failed to update password.';
      if (err.code === 'auth/wrong-password') {
        friendlyMessage = 'Your current password is incorrect.';
      } else if (err.code === 'auth/weak-password') {
        friendlyMessage = 'The new password is too weak.';
      }

      dispatch(setError({ message: friendlyMessage }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="p-8 max-w-xl mx-auto w-full">
      <div className="mb-6">
        <h2>Account Settings</h2>
        <p className="text-grey-1 text-sm">Manage your security credentials</p>
      </div>

      <Card className="bg-bg-3 p-6 border border-grey-2 rounded-2xl">
        <h3 className="text-white text-lg font-medium mb-4">Change Password</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-white/70 text-xs font-medium">Current Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              disabled={isLoading}
              error={errors.currentPassword?.message}
              {...register('currentPassword', {
                required: 'Current password is required.',
              })}
            />
          </div>

          <hr className="border-grey-2/50 my-2" />

          <div className="flex flex-col gap-1.5">
            <label className="text-white/70 text-xs font-medium">New Password</label>
            <Input
              type="password"
              placeholder="Minimum 6 characters"
              disabled={isLoading}
              error={errors.newPassword?.message}
              {...register('newPassword', {
                required: 'New password is required.',
                minLength: {
                  value: 6,
                  message: 'New password must be at least 6 characters long.',
                },
              })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-white/70 text-xs font-medium">Confirm New Password</label>
            <Input
              type="password"
              placeholder="Re-type new password"
              disabled={isLoading}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Please confirm your new password.',
                validate: (value) => value === newPasswordValue || 'New passwords do not match.',
              })}
            />
          </div>

          <div className="mt-2 flex justify-end">
            <Button type="submit" intent="primary" disabled={isLoading} className="px-6">
              {isLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </form>
      </Card>
    </main>
  );
}
