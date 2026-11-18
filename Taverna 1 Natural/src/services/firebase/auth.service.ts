import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  User,
  onAuthStateChanged,
  Unsubscribe
} from 'firebase/auth';
import { auth } from './config';
import { UserService, UserDocument } from './user.service';

export class AuthService {
  static formatAuthError(error: unknown): string {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const code = String((error as { code: unknown }).code);
      switch (code) {
        case 'auth/user-not-found':
          return 'E-mail não cadastrado na plataforma.';
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          return 'Credenciais inválidas. Verifique seu e-mail e senha.';
        case 'auth/email-already-in-use':
          return 'Este e-mail já está cadastrado por outra conta.';
        case 'auth/weak-password':
          return 'A senha é muito fraca. Utilize no mínimo 6 caracteres.';
        case 'auth/invalid-email':
          return 'O endereço de e-mail informado é inválido.';
        case 'auth/too-many-requests':
          return 'Acesso bloqueado temporariamente por excesso de tentativas. Tente mais tarde.';
        case 'auth/network-request-failed':
          return 'Falha de comunicação com o servidor. Verifique sua conexão de rede.';
        case 'auth/popup-closed-by-user':
          return 'Janela de autenticação externa fechada antes da conclusão.';
        case 'auth/cancelled-popup-request':
          return 'Operação cancelada pelo navegador.';
        case 'auth/operation-not-allowed':
          return 'Este método de autenticação não está habilitado no Console Firebase.';
        default:
          return 'Não foi possível completar a operação de autenticação.';
      }
    }
    if (error instanceof Error) {
      return error.message;
    }
    return 'Erro inesperado durante a autenticação.';
  }

  static async loginWithEmail(email: string, password: string): Promise<User> {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    const existing = await UserService.getUserProfile(cred.user.uid);
    if (!existing) {
      await UserService.createUserProfile(cred.user);
    }
    return cred.user;
  }

  static async registerWithEmail(
    displayName: string,
    email: string,
    password: string
  ): Promise<{ user: User; profile: UserDocument }> {
    const trimmedEmail = email.trim();
    const trimmedName = displayName.trim();
    const cred = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
    if (trimmedName) {
      await updateProfile(cred.user, { displayName: trimmedName });
    }
    const profile = await UserService.createUserProfile({
      uid: cred.user.uid,
      displayName: trimmedName,
      email: trimmedEmail,
      photoURL: cred.user.photoURL
    });
    return { user: cred.user, profile };
  }

  static async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email.trim());
  }

  static async loginWithGoogle(): Promise<{ user: User; profile: UserDocument }> {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const existing = await UserService.getUserProfile(cred.user.uid);
    const profile = existing || (await UserService.createUserProfile(cred.user));
    return { user: cred.user, profile };
  }

  static async logoutUser(): Promise<void> {
    await signOut(auth);
  }

  static subscribeAuthState(callback: (user: User | null) => void): Unsubscribe {
    return onAuthStateChanged(auth, callback);
  }
}
