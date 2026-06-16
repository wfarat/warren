import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { LoginDialog, selectUser, setError, setSuccess, useLogin } from '@/features';
import Bell from '@/assets/icons/Bell.svg?react';
import Arrow from '@/assets/icons/Arrow.svg?react';
import { Button } from '@/components';
import { AdvancedImage } from '@cloudinary/react';
import { cld } from '@/api';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { useNavigate } from 'react-router';

export function UserMenu() {
  const { isAuthenticated, currentUser } = useAppSelector(selectUser);
  const { photo, given_name } = currentUser || {};
  const navigate = useNavigate();
  const { logout } = useLogin();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
      <>
        <Button size="md" onClick={() => setIsDialogOpen(true)}>
          Log in
        </Button>
        <LoginDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
      </>
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

        {photo?.publicId && (
          <AdvancedImage
            cldImg={cld.image(photo.publicId).resize(fill().width(40).height(40))}
            className="rounded-full w-10 h-10"
            onError={(e: ErrorEvent) => {
              (e.target as HTMLImageElement).src =
                'https://res.cloudinary.com/dtz3qhhlp/image/upload/v1780652522/placeholder.jpg';
            }}
          />
        )}
        {photo?.url && (
          <img className="rounded-full w-10 h-10" src={photo.url} alt="User profile picture" />
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
              navigate('/settings');
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
