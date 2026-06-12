import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, userRepo } from '@/api';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  clearUser,
  selectCurrentUserId,
  selectIsRegistering,
  setSuccess,
  setUser,
} from '@/features';

export function useAuthListener() {
  const dispatch = useAppDispatch();
  const currentUserId = useAppSelector(selectCurrentUserId);
  const isRegistering = useAppSelector(selectIsRegistering);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && !isRegistering) {
        try {
          const profile = await userRepo.initializeUserDocument(firebaseUser);

          const userData = {
            id: firebaseUser.uid,
            name: profile.name,
            email: firebaseUser.email || '',
            given_name: profile.name.split(' ')[0] || '',
            photo: {
              url: '',
              publicId: `users/${firebaseUser.uid}/profile`,
            },
          };

          dispatch(setUser(userData));
        } catch (e) {
          console.error('Auth listener failed to process user node profile sync:', e);
        }
      } else {
        dispatch(clearUser());
        if (currentUserId) {
          dispatch(setSuccess('User logged out successfully.'));
        }
      }
    });

    return () => unsubscribe();
  }, [dispatch]);
}
