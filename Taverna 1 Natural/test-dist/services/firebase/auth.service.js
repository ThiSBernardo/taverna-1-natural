import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail, signInWithPopup, GoogleAuthProvider, updateProfile, onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from './config.js';
import { UserService } from './user.service.js';
export class AuthService {
    static formatAuthError(error) {
        if (typeof error === 'object' && error !== null && 'code' in error) {
            const code = String(error.code);
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
                case 'auth/missing-password':
                    return 'Por favor, informe a senha.';
                case 'auth/missing-email':
                    return 'Por favor, informe o e-mail.';
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
                case 'auth/api-key-not-valid':
                case 'auth/invalid-api-key':
                    return 'A chave de API do Firebase não está configurada ou é inválida no arquivo .env.';
                default:
                    return 'Não foi possível completar a operação de autenticação.';
            }
        }
        if (error instanceof Error) {
            return error.message;
        }
        return 'Erro inesperado durante a autenticação.';
    }
    static async loginWithEmail(email, password) {
        const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
        try {
            const existing = await UserService.getUserProfile(cred.user.uid);
            if (!existing) {
                await UserService.createUserProfile(cred.user);
            }
        }
        catch { }
        return cred.user;
    }
    static async registerWithEmail(displayName, email, password) {
        const trimmedEmail = email.trim();
        const trimmedName = displayName.trim();
        const cred = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
        if (trimmedName) {
            try {
                await updateProfile(cred.user, { displayName: trimmedName });
            }
            catch { }
        }
        let profile;
        try {
            profile = await UserService.createUserProfile({
                uid: cred.user.uid,
                displayName: trimmedName,
                email: trimmedEmail,
                photoURL: cred.user.photoURL
            });
        }
        catch {
            profile = {
                uid: cred.user.uid,
                displayName: trimmedName || trimmedEmail.split('@')[0] || 'Aventureiro',
                email: trimmedEmail,
                photoURL: cred.user.photoURL,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isInMemory: true
            };
        }
        return { user: cred.user, profile };
    }
    static async sendPasswordReset(email) {
        await sendPasswordResetEmail(auth, email.trim());
    }
    static async loginWithGoogle() {
        if (!isFirebaseConfigured) {
            throw new Error('A autenticação com Google requer credenciais válidas do Firebase no arquivo .env.');
        }
        const provider = new GoogleAuthProvider();
        const cred = await signInWithPopup(auth, provider);
        let profile = null;
        try {
            profile = await UserService.getUserProfile(cred.user.uid);
            if (!profile) {
                profile = await UserService.createUserProfile(cred.user);
            }
        }
        catch {
            profile = {
                uid: cred.user.uid,
                displayName: cred.user.displayName || cred.user.email?.split('@')[0] || 'Aventureiro',
                email: cred.user.email || '',
                photoURL: cred.user.photoURL,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isInMemory: true
            };
        }
        return { user: cred.user, profile: profile };
    }
    static async logoutUser() {
        await signOut(auth);
    }
    static subscribeAuthState(callback) {
        return onAuthStateChanged(auth, callback);
    }
}
