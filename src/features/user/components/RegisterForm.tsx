import { useForm } from 'react-hook-form';
import { useLogin } from '@/features';
import { Button, Input } from '@/components';
import { useState } from 'react';

type RegisterFields = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function RegisterForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const { registerWithEmail } = useLogin();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<RegisterFields>({ mode: 'onTouched' });

  const passwordValue = watch('password');

  const onFormSubmit = async (data: RegisterFields) => {
    try {
      setIsSubmitting(true);
      await registerWithEmail(data.email, data.password, data.name);
    } catch {
      // Caught and broadcasted globally by your custom hook's Redux slice
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 p-6">
      <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-4">
        <label className="text-grey-1 text-xs flex flex-col gap-1">
          Full Name
          <Input
            type="text"
            placeholder="John Doe"
            error={errors.name?.message}
            {...register('name', { required: 'Name is required' })}
          />
        </label>

        <label className="text-grey-1 text-xs flex flex-col gap-1">
          Email Address
          <Input
            type="email"
            placeholder="your.email@example.com"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email field is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Please enter a valid email address',
              },
            })}
          />
        </label>

        <label className="text-grey-1 text-xs flex flex-col gap-1">
          Password
          <Input
            type="password"
            placeholder="Minimum 6 characters"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Must be at least 6 characters long' },
            })}
          />
        </label>

        <label className="text-grey-1 text-xs flex flex-col gap-1">
          Confirm Password
          <Input
            type="password"
            placeholder="Repeat password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === passwordValue || 'Passwords do not match',
            })}
          />
        </label>

        <Button
          type="submit"
          intent="primary"
          disabled={!isValid || isSubmitting}
          className="w-full mt-2"
        >
          {isSubmitting ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      <p className="text-center text-xs text-grey-1 mt-2">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-primary-light hover:underline font-semibold"
        >
          Sign In
        </button>
      </p>
    </div>
  );
}
