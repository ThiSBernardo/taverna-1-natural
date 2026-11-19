import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './config.js';

export interface UserDocument {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  createdAt: string;
  updatedAt: string;
  isInMemory?: boolean;
}

export class UserService {
  static async getUserProfile(uid: string): Promise<UserDocument | null> {
    try {
      const docRef = doc(db, 'users', uid);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data() as UserDocument;
        return {
          ...data,
          isInMemory: false
        };
      }
      return null;
    } catch {
      return null;
    }
  }

  static async createUserProfile(user: {
    uid: string;
    displayName?: string | null;
    email?: string | null;
    photoURL?: string | null;
  }): Promise<UserDocument> {
    const docRef = doc(db, 'users', user.uid);
    const now = new Date().toISOString();
    const profile: UserDocument = {
      uid: user.uid,
      displayName: user.displayName || user.email?.split('@')[0] || 'Aventureiro',
      email: user.email || '',
      photoURL: user.photoURL || null,
      createdAt: now,
      updatedAt: now,
      isInMemory: false
    };
    try {
      await setDoc(docRef, {
        uid: profile.uid,
        displayName: profile.displayName,
        email: profile.email,
        photoURL: profile.photoURL,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt
      }, { merge: true });
    } catch {
      profile.isInMemory = true;
    }
    return profile;
  }

  static async recoverPendingProfile(profile: UserDocument): Promise<UserDocument> {
    try {
      const docRef = doc(db, 'users', profile.uid);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const cloudData = snapshot.data() as UserDocument;
        return {
          ...cloudData,
          isInMemory: false
        };
      }
      await setDoc(docRef, {
        uid: profile.uid,
        displayName: profile.displayName,
        email: profile.email,
        photoURL: profile.photoURL,
        createdAt: profile.createdAt,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      return {
        ...profile,
        isInMemory: false
      };
    } catch {
      return {
        ...profile,
        isInMemory: true
      };
    }
  }

  static async updateUserProfile(
    uid: string,
    updates: Partial<Omit<UserDocument, 'uid' | 'createdAt' | 'isInMemory'>>
  ): Promise<void> {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  }
}
