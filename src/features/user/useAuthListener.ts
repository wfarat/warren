import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore'; // 🌟 Added getDoc
import { auth, db } from '@/api';
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

        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (!userDocSnap.exists()) {
            await setDoc(userDocRef, {
              name: userData.name,
              photo: { url: userData.photoUrl },
              updatedAt: new Date().toISOString(),
              followers: 0,
              following: 0,
            });
          }
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
