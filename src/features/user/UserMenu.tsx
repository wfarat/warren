import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { selectUser, setError, setSuccess, useLogin } from '@/features';
import Bell from '@/assets/icons/Bell.svg?react';
import Arrow from '@/assets/icons/Arrow.svg?react';
import { Button } from '@/components';

export function UserMenu() {
  const { isAuthenticated, currentUser } = useAppSelector(selectUser);
  const { photoUrl, given_name } = currentUser || {};
  const { login, logout } = useLogin();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleLogout = () => {
    logout()
      .then(() => dispatch(setSuccess('User logged out successfully.')))
      .catch((err: Error) => dispatch(setError({ message: err.message, retryAction: 'LOGOUT' })));
  };

  if (!isAuthenticated) {
    return (
      <Button size="md" onClick={login}>
        Log in
      </Button>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="relative mr-2">
          <div className="w-2 h-2 absolute right-0 bg-danger-light rounded-full" />
          <Bell />
        </div>

        {photoUrl && (
          <img className="rounded-full w-10 h-10" src={photoUrl} alt="User profile picture" />
        )}

        <span className="text-grey-4 font-semibold">{given_name}</span>

        <Arrow />
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-grey-2 bg-bg-1 shadow-lg z-50">
          <button
            className="block w-full px-4 py-3 text-left hover:bg-bg-3 rounded-t-lg"
            onClick={() => {
              setIsOpen(false);
              // navigate('/settings');
            }}
          >
            Settings
          </button>

          <button
            className="block w-full px-4 py-3 text-left hover:bg-bg-3 rounded-b-lg"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
