import { db } from '@/api';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import type { Profile } from '@/types';

export const userRepo = {
  /**
   * Get user profile
   * @param userId
   */
  async getUserProfile(userId: string) {
    const userDocRef = doc(db, 'users', userId);
    const snapshot = await getDoc(userDocRef);
    return snapshot.data() as Profile;
  },

  async updateUserProfile(userId: string, data: Partial<Profile>) {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, data);
  },
};
