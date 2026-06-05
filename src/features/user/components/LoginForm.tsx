import { useForm } from 'react-hook-form';
import { useLogin } from '@/features';
import { Button, Input } from '@/components';
import { useState } from 'react';

type LoginFields = {
  email: string;
  password: string;
};

export function LoginForm() {
  const { loginWithEmail, loginWithGoogle } = useLogin();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFields>({ mode: 'onTouched' });

  const onFormSubmit = async (data: LoginFields) => {
    try {
      setIsSubmitting(true);
      await loginWithEmail(data.email, data.password);
    } catch {
      // Errors are caught and handled inside the hook's Redux notifier
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full p-6 flex flex-col gap-6">
      <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-4">
        <label className="text-grey-1 text-xs flex flex-col gap-1">
          Email
          <Input
            type="email"
            placeholder="Your email"
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
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Must be at least 6 characters long' },
            })}
          />
        </label>

        <Button
          type="submit"
          intent="primary"
          disabled={!isValid || isSubmitting}
          className="w-full mt-2"
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="relative flex items-center justify-center my-2">
        <div className="absolute w-full border-t border-grey-2"></div>
        <span className="relative px-3 bg-bg-2 text-xs text-grey-1 uppercase">
          Or continue with
        </span>
      </div>

      <Button type="button" intent="secondary" onClick={loginWithGoogle} className="w-full">
        Sign in with Google Account
      </Button>
    </div>
  );
}
