import React, { useState, FormEvent } from 'react';
import { 
  User, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { AuthService } from '../../services/firebase/auth.service';
import heroImage from '../../assets/darkage_login_hero_clean.jpg';

export type AuthMode = 'login' | 'register' | 'forgot-password';

interface AuthViewProps {
  initialMode?: AuthMode;
  onSuccess?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  initialMode = 'login',
  onSuccess
}) => {
  const { login, register, resetPassword, loginWithGoogle, isFirebaseConfigured } = useAuth();

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const clearMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    clearMessages();
  };

  const validateEmailFormat = (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    clearMessages();

    if (mode === 'login') {
      const trimmedEmail = email.trim();
      if (!trimmedEmail || !password) {
        setErrorMessage('Por favor, preencha o usuário e a senha.');
        return;
      }

      setIsSubmitting(true);
      try {
        await login(trimmedEmail, password);
        if (onSuccess) onSuccess();
      } catch (err: unknown) {
        setErrorMessage(AuthService.formatAuthError(err));
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (mode === 'register') {
      const trimmedName = displayName.trim();
      const trimmedEmail = email.trim();

      if (!trimmedName || !trimmedEmail || !password || !confirmPassword) {
        setErrorMessage('Todos os campos são obrigatórios.');
        return;
      }

      if (!validateEmailFormat(trimmedEmail)) {
        setErrorMessage('O endereço de e-mail informado é inválido.');
        return;
      }

      if (password.length < 6) {
        setErrorMessage('A senha deve conter no mínimo 6 caracteres.');
        return;
      }

      if (password !== confirmPassword) {
        setErrorMessage('A confirmação de senha não confere.');
        return;
      }

      setIsSubmitting(true);
      try {
        await register(trimmedName, trimmedEmail, password);
        setSuccessMessage('Conta criada com sucesso! Redirecionando...');
        if (onSuccess) onSuccess();
      } catch (err: unknown) {
        setErrorMessage(AuthService.formatAuthError(err));
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (mode === 'forgot-password') {
      const trimmedEmail = email.trim();
      if (!trimmedEmail) {
        setErrorMessage('Informe seu e-mail para receber as instruções de recuperação.');
        return;
      }

      if (!validateEmailFormat(trimmedEmail)) {
        setErrorMessage('O endereço de e-mail informado é inválido.');
        return;
      }

      setIsSubmitting(true);
      try {
        await resetPassword(trimmedEmail);
        setSuccessMessage('Se este e-mail estiver cadastrado, enviamos as instruções de redefinição de senha.');
      } catch (err: unknown) {
        setErrorMessage(AuthService.formatAuthError(err));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    if (isSubmitting) return;
    clearMessages();

    if (!isFirebaseConfigured) {
      setErrorMessage('A autenticação com Google requer credenciais válidas do Firebase no arquivo .env.');
      return;
    }

    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      setErrorMessage(AuthService.formatAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscordClick = () => {
    clearMessages();
    setErrorMessage('O login com Discord estará disponível em breve.');
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#08080a] text-white selection:bg-purple-500/30 selection:text-purple-200 overflow-x-hidden">
      
      <div className="relative w-full lg:w-[60%] flex flex-col justify-end p-6 sm:p-12 lg:p-16 h-36 sm:h-56 lg:min-h-screen overflow-hidden select-none bg-black shrink-0">
        <div 
          className="absolute inset-0 bg-no-repeat bg-center bg-cover"
          style={{
            backgroundImage: `url(${heroImage})`
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-black/30 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#09090b] pointer-events-none hidden lg:block" />

        <div className="relative z-10 max-w-xl">
          <span className="sr-only">Conecte-se com outros jogadores. Encontre novos amigos e forme grupos para campanhas memoráveis.</span>
        </div>
      </div>

      <div className="w-full lg:w-[40%] flex flex-col items-center justify-center px-4 py-6 sm:px-10 lg:p-14 bg-[#09090b] min-h-[calc(100vh-9rem)] lg:min-h-screen z-20 overflow-x-hidden">
        <div className="w-full max-w-[320px] sm:max-w-[380px] mx-auto space-y-5 sm:space-y-6">
          
          <div className="text-center">
            <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-white tracking-wide">
              {mode === 'login' && 'Login'}
              {mode === 'register' && 'Cadastrar'}
              {mode === 'forgot-password' && 'Recuperar Senha'}
            </h2>
            {mode === 'forgot-password' && (
              <p className="text-xs text-gray-400 mt-2">
                Digite seu e-mail para receber o link de redefinição.
              </p>
            )}
          </div>

          {errorMessage && (
            <div className="p-3 rounded-2xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span className="flex-1 leading-snug">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-2xl bg-green-950/50 border border-green-500/40 text-green-200 text-xs flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
              <span className="flex-1 leading-snug">{successMessage}</span>
            </div>
          )}

          {mode === 'login' && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 py-3 px-5 rounded-full bg-[#161619] hover:bg-[#202025] border border-white/10 text-gray-200 text-sm font-medium transition-all active:scale-[0.98] shadow-sm cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Entrar com Google</span>
              </button>

              <button
                type="button"
                onClick={handleDiscordClick}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 py-3 px-5 rounded-full bg-[#161619] hover:bg-[#202025] border border-white/10 text-gray-200 text-sm font-medium transition-all active:scale-[0.98] shadow-sm cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4 fill-[#5865F2]" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                <span>Entrar com Discord</span>
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink mx-4 text-[11px] text-gray-500 uppercase tracking-widest font-mono">
                  OU
                </span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-1">
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Nome de exibição"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full rounded-full bg-[#121215] border border-white/10 focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/50 py-3 pl-5 pr-12 text-sm text-white placeholder-gray-500 outline-none transition-all"
                  />
                  <User className="w-4 h-4 text-gray-400 fill-gray-400 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <div className="relative">
                <input
                  type={mode === 'login' ? 'text' : 'email'}
                  required
                  placeholder={mode === 'login' ? 'Usuário' : 'E-mail'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-[#121215] border border-white/10 focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/50 py-3 pl-5 pr-12 text-sm text-white placeholder-gray-500 outline-none transition-all"
                />
                {mode === 'login' ? (
                  <User className="w-4 h-4 text-gray-400 fill-gray-400 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" />
                ) : (
                  <Mail className="w-4 h-4 text-gray-400 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" />
                )}
              </div>
            </div>

            {mode !== 'forgot-password' && (
              <div className="space-y-1">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full rounded-full bg-[#121215] border border-white/10 focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/50 py-3 pl-5 pr-12 text-sm text-white placeholder-gray-500 outline-none transition-all font-mono text-xs tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="p-1 text-gray-400 hover:text-white absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer transition-colors"
                  >
                    {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div className="space-y-1">
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Confirmar senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full rounded-full bg-[#121215] border border-white/10 focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/50 py-3 pl-5 pr-12 text-sm text-white placeholder-gray-500 outline-none transition-all font-mono text-xs tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                    className="p-1 text-gray-400 hover:text-white absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer transition-colors"
                  >
                    {showConfirmPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div className="flex justify-end pt-0.5">
                <button
                  type="button"
                  onClick={() => switchMode('forgot-password')}
                  className="text-xs text-[#3b82f6] hover:text-[#60a5fa] transition-colors cursor-pointer"
                >
                  Esqueceu a senha?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 rounded-full bg-[#18181c] hover:bg-[#222227] border border-white/10 text-gray-200 hover:text-white font-medium text-sm transition-all active:scale-[0.98] shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                  <span>Aguarde...</span>
                </>
              ) : (
                <span>
                  {mode === 'login' && 'Entrar'}
                  {mode === 'register' && 'Cadastrar'}
                  {mode === 'forgot-password' && 'Enviar instruções'}
                </span>
              )}
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-gray-400">
            {mode === 'login' && (
              <p>
                Não tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className="text-[#3b82f6] hover:text-[#60a5fa] font-medium transition-colors cursor-pointer ml-0.5"
                >
                  Cadastrar
                </button>
              </p>
            )}

            {mode === 'register' && (
              <p>
                Já tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-[#3b82f6] hover:text-[#60a5fa] font-medium transition-colors cursor-pointer ml-0.5"
                >
                  Entrar
                </button>
              </p>
            )}

            {mode === 'forgot-password' && (
              <p>
                Lembrou sua senha?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-[#3b82f6] hover:text-[#60a5fa] font-medium transition-colors cursor-pointer inline-flex items-center gap-1 ml-0.5"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Fazer Login</span>
                </button>
              </p>
            )}
          </div>

        </div>
      </div>

      {!isFirebaseConfigured && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50 p-3 rounded-2xl bg-amber-950/90 backdrop-blur border border-amber-500/40 text-amber-200 text-xs shadow-2xl flex items-start gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <span className="font-bold block">Aviso de Configuração</span>
            <span className="break-words">Variáveis de ambiente do Firebase ausentes no .env. Configure suas credenciais para autenticação em nuvem.</span>
          </div>
        </div>
      )}

    </div>
  );
};
