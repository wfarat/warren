import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/api';
import type { ChatMetadata, Message } from '@/types';

export const messagesRepo = {
  getChatId(userIdOne: string, userIdTwo: string): string {
    return [userIdOne, userIdTwo].sort().join('_');
  },

  /**
   * 1. Streams the list of active chats for the logged-in user
   */
  subscribeToChatList(userId: string, callback: (chats: ChatMetadata[]) => void) {
    const chatsRef = collection(db, 'chats');

    // 1. Clean, lightweight query: ONLY get chats where the user is a participant
    const q = query(chatsRef, where('participants', 'array-contains', userId));

    return onSnapshot(
      q,
      (snapshot) => {
        // 2. Map the data securely
        let chats = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            participants: data.participants.map((id: string) => ({
              id,
              name: data.participantNames ? data.participantNames[id] : 'User',
            })),
            lastMessageSentAt:
              data.lastMessageSentAt && typeof data.lastMessageSentAt.toDate === 'function'
                ? data.lastMessageSentAt.toDate().toISOString()
                : new Date().toISOString(),
          };
        }) as ChatMetadata[];

        // 3. Sort on the client side. This prevents Firestore from leaking or bugging out
        // during latency compensation when a new message is actively flying over the network.
        chats.sort((a, b) => {
          return new Date(b.lastMessageSentAt).getTime() - new Date(a.lastMessageSentAt).getTime();
        });

        callback(chats);
      },
      (error) => {
        console.error('Inbox listener failed:', error);
      }
    );
  },

  /**
   * 2. Streams messages inside a specific conversation room
   */
  subscribeToMessages(
    userIdOne: string,
    userIdTwo: string,
    callback: (messages: Message[]) => void
  ) {
    const chatId = this.getChatId(userIdOne, userIdTwo);
    const messagesRef = collection(db, 'chats', chatId, 'messages');

    const q = query(messagesRef, orderBy('sentAt', 'asc'));

    return onSnapshot(
      q,
      (snapshot) => {
        const messages = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            // Fallback securely here too
            sentAt: data.sentAt ? data.sentAt.toDate().toISOString() : new Date().toISOString(),
          };
        }) as Message[];

        callback(messages);
      },
      (error) => {
        console.error('Message room listener failed:', error);
      }
    );
  },

  /**
   * Sends a message (same atomic implementation as before)
   */
  async sendMessage(
    senderId: string,
    receiverId: string,
    senderName: string,
    receiverName: string,
    content: string
  ) {
    const chatId = this.getChatId(senderId, receiverId);
    const chatDocRef = doc(db, 'chats', chatId);
    const messagesSubcollectionRef = collection(db, 'chats', chatId, 'messages');

    await addDoc(messagesSubcollectionRef, {
      authorId: senderId,
      content,
      sentAt: serverTimestamp(),
      read: false,
    });

    await setDoc(
      chatDocRef,
      {
        participants: [senderId, receiverId],
        participantNames: {
          [senderId]: senderName,
          [receiverId]: receiverName,
        },
        lastMessageText: content,
        lastMessageSentAt: serverTimestamp(),
        lastMessageRead: false,
        lastMessageAuthorId: senderId,
      },
      { merge: true }
    );
  },

  readChat(userId: string, targetId: string) {
    const chatId = this.getChatId(userId, targetId);
    const chatDocRef = doc(db, 'chats', chatId);
    return updateDoc(chatDocRef, {
      lastMessageRead: true,
    });
  },
};
