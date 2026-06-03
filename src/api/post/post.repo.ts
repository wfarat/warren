import {
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
  setDoc,
  startAfter,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/api/firebase';
import type { Comment, Post } from '@/types';

/**
 * Fetches the user IDs of everyone following the current user.
 */
async function getFollowerIds(userId: string): Promise<string[]> {
  const followersSnap = await getDocs(collection(db, 'users', userId, 'followers'));
  return followersSnap.docs.map((doc) => doc.id);
}

export const postRepo = {
  /**
   * 🌟 Generates an offline ID string matching Firestore's native format
   */
  generateNewPostId(): string {
    return doc(collection(db, 'posts')).id;
  },
  generateNewCommentId(postId: string): string {
    return doc(collection(db, 'posts', postId, 'comments')).id;
  },
  /**
   * Creates a post globally AND fans it out to all followers' timelines simultaneously.
   */
  async createPost(postId: string, input: Post): Promise<void> {
    const batch = writeBatch(db);

    const globalPostRef = doc(db, 'posts', postId);
    const postData = {
      ...input,
      createdAt: serverTimestamp(),
    };

    batch.set(globalPostRef, postData);

    const ownTimelineRef = doc(db, 'users', input.author.userId, 'timeline', postId);
    batch.set(ownTimelineRef, postData);

    const followerIds = await getFollowerIds(input.author.userId);
    followerIds.forEach((followerId) => {
      const followerTimelineRef = doc(db, 'users', followerId, 'timeline', postId);
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
   * Triggers a like.
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
   * Adds a comment to the subcollection and increments the master counter.
   */
  async addComment(postId: string, comment: Comment, commentId?: string): Promise<void> {
    const masterPostRef = doc(db, 'posts', postId);
    const commentDocRef = doc(db, 'posts', postId, 'comments', comment.id);

    await setDoc(commentDocRef, comment);

    await updateDoc(masterPostRef, {
      commentsCount: increment(1),
    });

    if (commentId) {
      const commentRef = doc(db, 'posts', postId, 'comments', commentId);
      await updateDoc(commentRef, {
        replies: arrayUnion(comment.id),
      });
    }
  },

  /**
   * Toggles a like on a comment.
   * @param postId
   * @param commentId
   * @param currentUserId
   * @param isLiked
   */
  async toggleLikeComment(
    postId: string,
    commentId: string,
    currentUserId: string,
    isLiked: boolean
  ): Promise<void> {
    const commentRef = doc(db, 'posts', postId, 'comments', commentId);

    await updateDoc(commentRef, {
      likes: isLiked ? arrayRemove(currentUserId) : arrayUnion(currentUserId),
    });
  },

  /**
   * Reads all comments for a post.
   * @param postId
   */
  async readComments(postId: string) {
    const commentsCollectionRef = collection(db, 'posts', postId, 'comments');
    const commentsSnapshot = await getDocs(commentsCollectionRef);
    return commentsSnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Comment
    );
  },
};
