import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { AuthService } from '../services/firebase/auth.service';
import { UserService, UserDocument } from '../services/firebase/user.service';
import { isFirebaseConfigured } from '../services/firebase/config';

export interface AuthContextType {
  user: UserDocument | null;
  firebaseUser: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isFirebaseConfigured: boolean;
  isProfileInMemory: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (displayName: string, email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  syncPendingProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<UserDocument | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    }, 600);

    const unsubscribe = AuthService.subscribeAuthState(async (current) => {
      if (!isMounted) return;
      clearTimeout(safetyTimer);
      setFirebaseUser(current);
      if (current) {
        try {
          const profile = await UserService.getUserProfile(current.uid);
          if (profile) {
            setUser(profile);
          } else {
            const created = await UserService.createUserProfile(current);
            setUser(created);
          }
        } catch {
          setUser({
            uid: current.uid,
            displayName: current.displayName || current.email?.split('@')[0] || 'Aventureiro',
            email: current.email || '',
            photoURL: current.photoURL,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isInMemory: true
          });
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const logged = await AuthService.loginWithEmail(email, password);
      setFirebaseUser(logged);
      const profile = await UserService.getUserProfile(logged.uid);
      if (profile) {
        setUser(profile);
      } else {
        const created = await UserService.createUserProfile(logged);
        setUser(created);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (displayName: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await AuthService.registerWithEmail(displayName, email, password);
      setFirebaseUser(res.user);
      setUser(res.profile);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    await AuthService.sendPasswordReset(email);
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const res = await AuthService.loginWithGoogle();
      setFirebaseUser(res.user);
      setUser(res.profile);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AuthService.logoutUser();
      setFirebaseUser(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const syncPendingProfile = async () => {
    if (!user || !user.isInMemory) return;
    try {
      const recovered = await UserService.recoverPendingProfile(user);
      setUser(recovered);
    } catch {}
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    isLoading,
    isAuthenticated: Boolean(firebaseUser),
    isFirebaseConfigured,
    isProfileInMemory: Boolean(user?.isInMemory),
    login,
    register,
    resetPassword,
    logout,
    loginWithGoogle,
    syncPendingProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
