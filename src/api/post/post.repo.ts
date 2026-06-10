import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  type DocumentData,
  documentId,
  getDoc,
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
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/api/firebase';
import type { Comment, Post } from '@/types';
import type { FollowerDoc } from '@/types/followers.ts';

/**
 * Fetches the user IDs of everyone following the current user.
 */
async function getFollowerIds(userId: string): Promise<string[]> {
  const followersSnap = await getDoc(doc(db, 'followers', userId));
  const data = followersSnap.data() as FollowerDoc;
  return data.list.map((follower) => follower.targetUserId);
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
    const posts: Post[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
      } as Post;
    });

    return {
      posts,
      // Pass this lastDoc back to your React component state to use for fetching the next page
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
    };
  },

  /**
   * Fetches only the posts written by a specific user (For Profile Pages)
   */
  async getUserProfilePosts(targetUserId: string, pageSize = 15) {
    const postsRef = collection(db, 'posts');
    const profileQuery = query(
      postsRef,
      where('author.userId', '==', targetUserId),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );
    try {
      const snapshot = await getDocs(profileQuery);
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString(),
        } as Post;
      });
    } catch (error) {
      console.error('Error fetching profile posts:', error);
    }
  },

  async getSinglePost(postId: string) {
    const postRef = doc(db, 'posts', postId);
    try {
      const snapshot = await getDoc(postRef);
      const data = snapshot.data();
      return {
        id: snapshot.id,
        ...data,
        createdAt: data?.createdAt?.toDate().toISOString(),
      } as Post;
    } catch (error) {
      console.error('Error fetching post:', error);
    }
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
  async addComment(
    postId: string,
    comment: Comment,
    commentId?: string,
    isReply?: boolean
  ): Promise<void> {
    const masterPostRef = doc(db, 'posts', postId);
    if (!commentId) {
      const commentDocRef = doc(db, 'posts', postId, 'comments', comment.id);
      await setDoc(commentDocRef, {
        ...comment,
        createdAt: serverTimestamp(),
      });
    }
    await updateDoc(masterPostRef, {
      commentsCount: increment(1),
    });

    if (commentId) {
      const replyDocRef = doc(db, 'posts', postId, 'replies', comment.id);
      await setDoc(replyDocRef, {
        ...comment,
        createdAt: serverTimestamp(),
      });
      if (isReply) {
        const replyRef = doc(db, 'posts', postId, 'replies', commentId);
        await updateDoc(replyRef, {
          replies: arrayUnion(comment.id),
        });
      } else {
        const commentRef = doc(db, 'posts', postId, 'comments', commentId);
        await updateDoc(commentRef, {
          replies: arrayUnion(comment.id),
        });
      }
    }
  },

  /**
   * Toggles a like on a comment.
   * @param postId the ID of post
   * @param commentId the ID of comment
   * @param currentUserId the ID of liking user
   * @param isLiked true if user likes the comment
   * @param isReply true if the comment is a reply to another comment
   */
  async toggleLikeComment(
    postId: string,
    commentId: string,
    currentUserId: string,
    isLiked: boolean,
    isReply?: boolean
  ): Promise<void> {
    let commentRef;
    if (isReply) {
      commentRef = doc(db, 'posts', postId, 'replies', commentId);
    } else {
      commentRef = doc(db, 'posts', postId, 'comments', commentId);
    }
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
    return commentsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
      } as Comment;
    });
  },

  /**
   * Reads all replies for a comment efficiently in a single query.
   * Max 30 replies per execution due to Firestore 'in' query limits.
   */
  async readReplies(postId: string, replies: string[]): Promise<Comment[]> {
    if (!replies || replies.length === 0) return [];

    const batch = replies.slice(0, 30);

    const commentsRef = collection(db, 'posts', postId, 'replies');
    const q = query(commentsRef, where(documentId(), 'in', batch));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
      } as Comment;
    });
  },
};
