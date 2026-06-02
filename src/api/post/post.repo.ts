import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  type DocumentData,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  startAfter,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/api/firebase';
import type { Author, Post } from '@/types';

/**
 * Fetches the user IDs of everyone following the current user.
 */
async function getFollowerIds(userId: string): Promise<string[]> {
  const followersSnap = await getDocs(collection(db, 'users', userId, 'followers'));
  return followersSnap.docs.map((doc) => doc.id);
}

export const postRepo = {
  /**
   * Creates a post globally AND fans it out to all followers' timelines simultaneously.
   */
  async createPost(input: Post): Promise<void> {
    const batch = writeBatch(db);

    const globalPostRef = doc(collection(db, 'posts'));
    const postData = {
      ...input,
      createdAt: serverTimestamp(),
    };

    batch.set(globalPostRef, postData);

    const ownTimelineRef = doc(db, 'users', input.author.userId, 'timeline', globalPostRef.id);
    batch.set(ownTimelineRef, postData);

    const followerIds = await getFollowerIds(input.author.userId);
    followerIds.forEach((followerId) => {
      const followerTimelineRef = doc(db, 'users', followerId, 'timeline', globalPostRef.id);
      batch.set(followerTimelineRef, postData);
    });

    // Commit all operations together atomically
    await batch.commit();
  },

  /**
   * Fetches the pre-calculated timeline for a user using cursor-based pagination.
   * @param userId Current logged-in user ID
   * @param lastVisible The last document snapshot from the previous page (null for page 1)
   * @param pageSize Number of posts to fetch per page
   */
  async getTimeline(
    userId: string,
    lastVisible: QueryDocumentSnapshot<DocumentData> | null = null,
    pageSize = 15
  ) {
    const timelineRef = collection(db, 'users', userId, 'timeline');

    let timelineQuery = query(timelineRef, orderBy('createdAt', 'desc'), limit(pageSize));

    if (lastVisible) {
      timelineQuery = query(timelineQuery, startAfter(lastVisible));
    }

    const snapshot = await getDocs(timelineQuery);

    const posts: Post[] = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Post
    );

    return {
      posts,
      // Pass this lastDoc back to your React component state to use for fetching the next page
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
    };
  },

  /**
   * Triggers a like. Cost: Exactly 1 Write.
   */
  async toggleLike(postId: string, currentUserId: string, isLiked: boolean): Promise<void> {
    const masterPostRef = doc(db, 'posts', postId);

    await updateDoc(masterPostRef, {
      // If already liked, remove ID and decrement counter by 1. Otherwise, add and increment.
      likes: isLiked ? arrayRemove(currentUserId) : arrayUnion(currentUserId),
      likesCount: isLiked ? increment(-1) : increment(1),
    });
  },

  /**
   * Adds a comment to the subcollection and increments the master counter. Cost: 2 Writes.
   */
  async addComment(postId: string, author: Author, content: string): Promise<void> {
    const masterPostRef = doc(db, 'posts', postId);
    const commentsCollectionRef = collection(db, 'posts', postId, 'comments');

    // 1. Add comment doc to subcollection
    await addDoc(commentsCollectionRef, {
      content,
      author,
      createdAt: serverTimestamp(),
    });

    // 2. Increment the comment counter on the master post
    await updateDoc(masterPostRef, {
      commentsCount: increment(1),
    });
  },
};
