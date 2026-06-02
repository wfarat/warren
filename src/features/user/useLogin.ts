import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '@/api';
import { useAppDispatch } from '@/store';
import { setError, setSuccess } from '@/features';

export function useLogin() {
  const dispatch = useAppDispatch();

  const login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        hd: 'pjwstk.edu.pl', // Locks it down to your university domain
      });

      await signInWithPopup(auth, provider);

      dispatch(setSuccess('User logged in successfully.'));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'User login failed.';
      dispatch(setError({ message, retryAction: 'LOGIN' }));
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);

      dispatch(setSuccess('User logged out successfully.'));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'User logout failed.';
      dispatch(setError({ message, retryAction: 'LOGOUT' }));
    }
  };

  return { login, logout };
}
