import { db } from '@/api';
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import type { Group } from '@/types';

export const groupsRepo = {
  generateNewGroupId(): string {
    return doc(collection(db, 'groups')).id;
  },
  /**
   * Fetches a single group document by its ID
   */
  async getGroup(groupId: string): Promise<Group | null> {
    const groupDocRef = doc(db, 'groups', groupId);
    const snapshot = await getDoc(groupDocRef);

    if (!snapshot.exists()) return null;

    const data = snapshot.data();
    return {
      ...data,
      id: snapshot.id,
      createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
    } as Group;
  },

  /**
   * Finds groups that match a specific tag
   * If no tag is specified, it returns all groups
   */
  async fetchGroupsList(tagFilter?: string): Promise<Group[]> {
    const groupsRef = collection(db, 'groups');
    let q = query(groupsRef);

    if (tagFilter?.trim()) {
      q = query(groupsRef, where('tags', 'array-contains', tagFilter.trim().toLowerCase()));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt.toDate().toISOString(),
        id: doc.id,
      };
    }) as Group[];
  },

  /**
   * Retrieves all groups the specified user belongs to
   */
  async fetchMyGroups(userId: string): Promise<Group[]> {
    const groupsRef = collection(db, 'groups');
    const q = query(groupsRef, where('members', 'array-contains', userId));

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt.toDate().toISOString(),
        id: doc.id,
      };
    }) as Group[];
  },

  /**
   * Finds groups the user has NOT joined yet (for discovery)
   * Note: Firestore doesn't support an "array-not-contains" operator natively.
   * The most performant approach is fetching groups and filtering out user presence.
   */
  async fetchDiscoverableGroups(userId: string, tagFilter?: string): Promise<Group[]> {
    const allMatchingGroups = await this.fetchGroupsList(tagFilter);

    return allMatchingGroups.filter((group) => !group.members.includes(userId));
  },

  /**
   * Commits a freshly designed group metadata node to Firestore
   * Expects tags from your dialog to be split into an array before processing.
   */
  async createGroup(data: Group): Promise<void> {
    const newGroupRef = doc(collection(db, 'groups'));

    const groupPayload = {
      ...data,
      createdAt: serverTimestamp(),
    };

    await setDoc(newGroupRef, groupPayload);
  },

  /**
   * Appends a new member to an existing group safely using arrayUnion
   */
  async joinGroup(groupId: string, userId: string): Promise<void> {
    const groupDocRef = doc(db, 'groups', groupId);

    await updateDoc(groupDocRef, {
      members: arrayUnion(userId),
    });
  },
};
