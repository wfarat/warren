import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '@/api';
import { useAppDispatch } from '@/store';
import { clearUser, setError, setSuccess, setUser } from '@/features';

export function useLogin() {
  const dispatch = useAppDispatch();

  const login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        hd: 'pjwstk.edu.pl',
      });

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      dispatch(
        setUser({
          name: user.displayName || '',
          email: user.email || '',
          given_name: user.displayName?.split(' ')[0] || '',
          photoUrl: user.photoURL || '',
        })
      );
      dispatch(setSuccess('User logged in successfully.'));
    } catch (err) {
      if (err instanceof Error) {
        dispatch(setError({ message: err.message, retryAction: 'LOGIN' }));
      } else {
        dispatch(setError({ message: 'User login failed.', retryAction: 'LOGIN' }));
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      dispatch(setSuccess('User logged out successfully.'));
    } catch (err) {
      if (err instanceof Error) {
        dispatch(setError({ message: err.message, retryAction: 'LOGOUT' }));
      } else {
        dispatch(setError({ message: 'User logout failed.', retryAction: 'LOGOUT' }));
      }
    }
  };

  return { login, logout };
}
