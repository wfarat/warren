import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const FIREBASE_CONFIG = import.meta.env.VITE_FIREBASE_CONFIG;
const firebaseConfig = JSON.parse(FIREBASE_CONFIG);

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let db;
try {
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });
} catch (error: any) {
  if (error.code === 'failed-precondition' || error.message.includes('already been called')) {
    db = getFirestore(app);
  } else {
    throw error;
  }
}

const auth = getAuth(app);

export { app, db, auth };
