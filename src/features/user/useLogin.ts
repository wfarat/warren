import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { auth, userRepo } from '@/api';
import { useAppDispatch } from '@/store';
import { setError, setSuccess } from '@/features';

export function useLogin() {
  const dispatch = useAppDispatch();

  const registerWithEmail = async (email: string, password: string, name: string) => {
    try {
      if (!email || !password || !name) throw new Error('All fields are required.');

      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);

      await userRepo.initializeUserDocument(userCredential.user, name);

      dispatch(setSuccess('Account created successfully!'));
    } catch (err) {
      const errorInstance = err as { code?: string; message?: string };
      let friendlyMessage = errorInstance.message || 'Registration failed.';
      if (errorInstance.code === 'auth/email-already-in-use') {
        friendlyMessage = 'This email address is already registered.';
      }
      dispatch(setError({ message: friendlyMessage, retryAction: 'REGISTER' }));
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      dispatch(setSuccess('User logged in successfully with Google.'));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google login failed.';
      dispatch(setError({ message, retryAction: 'LOGIN_GOOGLE' }));
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      if (!email || !password) {
        throw new Error('Please enter both your email and password.');
      }

      await signInWithEmailAndPassword(auth, email.trim(), password);

      dispatch(setSuccess('User logged in successfully.'));
    } catch (err) {
      const errorInstance = err as { code?: string; message?: string };
      let friendlyMessage = errorInstance.message || 'Authentication failed.';

      if (
        errorInstance.code === 'auth/invalid-credential' ||
        errorInstance.code === 'auth/wrong-password'
      ) {
        friendlyMessage = 'Incorrect email or password. Please try again.';
      } else if (errorInstance.code === 'auth/user-not-found') {
        friendlyMessage = 'No account associated with this email address.';
      }

      dispatch(setError({ message: friendlyMessage, retryAction: 'LOGIN_EMAIL' }));
      throw err;
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

  return { loginWithGoogle, loginWithEmail, registerWithEmail, logout };
}
