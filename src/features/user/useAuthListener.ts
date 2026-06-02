// src/hooks/useAuthListener.ts
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; // 🌟 Import setDoc
import { auth, db } from '@/api'; // 🌟 Import your database instance
import { useAppDispatch } from '@/store';
import { clearUser, setUser } from '@/features';

export function useAuthListener() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || '',
          email: firebaseUser.email || '',
          given_name: firebaseUser.displayName?.split(' ')[0] || '',
          photoUrl: firebaseUser.photoURL || '',
        };

        // 🌟 Fix: Automatically create/ensure the user document exists in Firestore
        // 'merge: true' ensures we don't overwrite their data if they already exist
        try {
          await setDoc(
            doc(db, 'users', firebaseUser.uid),
            {
              name: userData.name,
              email: userData.email,
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );
        } catch (e) {
          console.error('Could not initialize user document in Firestore:', e);
        }

        dispatch(setUser(userData));
      } else {
        dispatch(clearUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);
}
