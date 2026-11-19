import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './config.js';
export class UserService {
    static async getUserProfile(uid) {
        try {
            const docRef = doc(db, 'users', uid);
            const snapshot = await getDoc(docRef);
            if (snapshot.exists()) {
                const data = snapshot.data();
                return {
                    ...data,
                    isInMemory: false
                };
            }
            return null;
        }
        catch {
            return null;
        }
    }
    static async createUserProfile(user) {
        const docRef = doc(db, 'users', user.uid);
        const now = new Date().toISOString();
        const profile = {
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
        }
        catch {
            profile.isInMemory = true;
        }
        return profile;
    }
    static async recoverPendingProfile(profile) {
        try {
            const docRef = doc(db, 'users', profile.uid);
            const snapshot = await getDoc(docRef);
            if (snapshot.exists()) {
                const cloudData = snapshot.data();
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
        }
        catch {
            return {
                ...profile,
                isInMemory: true
            };
        }
    }
    static async updateUserProfile(uid, updates) {
        const docRef = doc(db, 'users', uid);
        await updateDoc(docRef, {
            ...updates,
            updatedAt: new Date().toISOString()
        });
    }
}
