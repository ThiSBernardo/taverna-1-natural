import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const metaEnv: Record<string, string | undefined> = 
  typeof import.meta !== 'undefined' && import.meta.env ? (import.meta.env as Record<string, string | undefined>) : {};

const apiKey = metaEnv.VITE_FIREBASE_API_KEY || '';
const authDomain = metaEnv.VITE_FIREBASE_AUTH_DOMAIN || '';
const projectId = metaEnv.VITE_FIREBASE_PROJECT_ID || '';
const storageBucket = metaEnv.VITE_FIREBASE_STORAGE_BUCKET || '';
const messagingSenderId = metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || '';
const appId = metaEnv.VITE_FIREBASE_APP_ID || '';

export const isFirebaseConfigured = Boolean(
  apiKey &&
  !apiKey.includes('Placeholder') &&
  !apiKey.includes('YourApiKeyHere') &&
  projectId &&
  authDomain
);

const firebaseConfig = {
  apiKey: apiKey || 'dummy-api-key',
  authDomain: authDomain || 'dummy.firebaseapp.com',
  projectId: projectId || 'dummy-project',
  storageBucket: storageBucket || 'dummy.appspot.com',
  messagingSenderId: messagingSenderId || '000000000000',
  appId: appId || '1:000000000000:web:0000000000000000000000'
};

const app: FirebaseApp = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export { app };
