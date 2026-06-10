import { db } from '@/api';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import type { Profile } from '@/types';

export const userRepo = {
  /**
   * Get user profile
   * @param userId
   */
  async getUserProfile(userId: string) {
    const userDocRef = doc(db, 'users', userId);
    const snapshot = await getDoc(userDocRef);
    const data = snapshot.data();
    return { ...data, updatedAt: data?.updatedAt.toDate().toISOString() } as Profile;
  },

  async initializeUserDocument(firebaseUser: any, customName?: string): Promise<Profile> {
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      return userDocSnap.data() as Profile;
    }

    const finalName = customName?.trim() || firebaseUser.displayName || 'Anonymous';

    const newProfile: Profile = {
      id: firebaseUser.uid,
      name: finalName,
      followers: 0,
      following: 0,
      bio: '',
      location: '',
    };

    // Commit cleanly to Firestore
    await setDoc(userDocRef, {
      ...newProfile,
      updatedAt: serverTimestamp(),
    });

    if (firebaseUser.photoURL) {
      const { uploadProfilePicture } = await import('@/api');
      uploadProfilePicture(firebaseUser.photoURL, firebaseUser.uid).catch((err) =>
        console.error('Background profile picture sync failed:', err)
      );
    }

    return newProfile;
  },

  async updateUserProfile(userId: string, data: Partial<Profile>) {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },
};
