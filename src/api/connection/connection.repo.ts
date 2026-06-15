import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  increment,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/api';
import type { FollowerDoc } from '@/types/followers.ts';

export const connectionRepo = {
  async fetchUserConnections(currentUserId: string) {
    const followingSnap = await getDoc(doc(db, 'following', currentUserId));
    const followersSnap = await getDoc(doc(db, 'followers', currentUserId));

    const followingList = followingSnap.exists() ? (followingSnap.data() as FollowerDoc).list : [];
    const followersList = followersSnap.exists() ? (followersSnap.data() as FollowerDoc).list : [];

    const followingSet = new Set(followingList.map((u) => u.targetUserId));
    const followersSet = new Set(followersList.map((u) => u.targetUserId));

    const mutualConnections = followingList.filter((u) => followersSet.has(u.targetUserId));
    const pendingFollowBacks = followingList.filter((u) => !followersSet.has(u.targetUserId));
    const pureFollowers = followersList.filter((u) => !followingSet.has(u.targetUserId));

    return { mutualConnections, pendingFollowBacks, pureFollowers };
  },
  async followUser(
    currentUserId: string,
    currentUserName: string,
    targetUserId: string,
    targetUserName: string
  ) {
    const currentUserDocRef = doc(db, 'users', currentUserId);
    await updateDoc(currentUserDocRef, {
      following: increment(1),
    });

    const targetDocRef = doc(db, 'users', targetUserId);
    await updateDoc(targetDocRef, {
      followers: increment(1),
    });

    const followingDocRef = doc(db, 'following', currentUserId);
    await setDoc(
      followingDocRef,
      {
        list: arrayUnion({
          targetUserId: targetUserId,
          targetUserName: targetUserName,
        }),
      },
      { merge: true }
    );

    const followersDocRef = doc(db, 'followers', targetUserId);
    await setDoc(
      followersDocRef,
      {
        list: arrayUnion({
          targetUserId: currentUserId,
          targetUserName: currentUserName,
        }),
      },
      { merge: true }
    );
  },
  async unfollowUser(
    currentUserId: string,
    currentUserName: string, // Assumes this matches exactly what is stored
    targetUserId: string,
    targetUserName: string // Assumes this matches exactly what is stored
  ) {
    // 1. Initialize a batch
    const batch = writeBatch(db);

    const currentUserDocRef = doc(db, 'users', currentUserId);
    const targetDocRef = doc(db, 'users', targetUserId);
    const followingDocRef = doc(db, 'following', currentUserId);
    const followersDocRef = doc(db, 'followers', targetUserId);

    // 2. Queue all operations into the batch
    batch.update(currentUserDocRef, { following: increment(-1) });
    batch.update(targetDocRef, { followers: increment(-1) });

    batch.update(followingDocRef, {
      list: arrayRemove({
        targetUserId: targetUserId,
        targetUserName: targetUserName,
      }),
    });

    batch.update(followersDocRef, {
      list: arrayRemove({
        targetUserId: currentUserId,
        targetUserName: currentUserName,
      }),
    });

    await batch.commit();
  },

  async isFollowing(currentUserId: string, targetUserId: string) {
    const followingDoc = doc(db, 'following', currentUserId);

    const snap = await getDoc(followingDoc);
    if (!snap.exists()) return false;
    const data = snap.data() as FollowerDoc;
    return data.list.some((follower) => follower.targetUserId === targetUserId);
  },
};
