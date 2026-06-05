import { Dialog } from '@/components';
import { LoginForm, RegisterForm } from '@/features';
import { useEffect, useState } from 'react';

type LoginDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

type AuthView = 'login' | 'register';

export function LoginDialog({ isOpen, onClose }: LoginDialogProps) {
  const [view, setView] = useState<AuthView>('login');

  useEffect(() => {
    if (isOpen) setView('login');
  }, [isOpen]);

  if (!isOpen) return null;

  const modalTitle = view === 'login' ? 'Account Authentication' : 'Create New Account';

  return (
    <Dialog onClose={onClose} title={modalTitle}>
      <div className="p-2 w-full max-w-md mx-auto">
        {view === 'login' ? (
          <LoginForm />
        ) : (
          <RegisterForm onSwitchToLogin={() => setView('login')} />
        )}

        {view === 'login' && (
          <p className="text-center text-xs text-grey-1 mt-4">
            New to Warren Social?{' '}
            <button
              type="button"
              onClick={() => setView('register')}
              className="text-primary-light hover:underline font-semibold"
            >
              Register Now
            </button>
          </p>
        )}
      </div>
    </Dialog>
  );
}
