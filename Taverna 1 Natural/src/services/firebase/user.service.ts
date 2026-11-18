import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './config';

export interface UserDocument {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  createdAt: string;
  updatedAt: string;
}

export class UserService {
  static async getUserProfile(uid: string): Promise<UserDocument | null> {
    try {
      const docRef = doc(db, 'users', uid);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return snapshot.data() as UserDocument;
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
      updatedAt: now
    };
    await setDoc(docRef, profile, { merge: true });
    return profile;
  }

  static async updateUserProfile(
    uid: string,
    updates: Partial<Omit<UserDocument, 'uid' | 'createdAt'>>
  ): Promise<void> {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  }
}
