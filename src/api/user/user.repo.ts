import { auth, db } from '@/api';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import type { Profile, UserListItem } from '@/types';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';

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

  async fetchUserList(filter?: string): Promise<UserListItem[]> {
    const usersRef = collection(db, 'users');
    let q;

    if (filter) {
      q = query(
        usersRef,
        where('name', '>=', filter),
        where('name', '<=', filter + '\uf8ff'),
        orderBy('name')
      );
    } else {
      q = query(usersRef, orderBy('name'));
    }

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name || '',
    }));
  },

  async initializeUserDocument(firebaseUser: any, customName?: string): Promise<Profile> {
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      return userDocSnap.data() as Profile;
    }
    const finalName = customName?.trim() || firebaseUser.displayName;

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

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error('No authenticated user found.');
    }
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
  },
};
