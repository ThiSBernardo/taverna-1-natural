import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY || '';
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '';
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || '';
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '';
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '';
const appId = import.meta.env.VITE_FIREBASE_APP_ID || '';

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
