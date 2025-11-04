import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

const ADMIN_EMAILS = ["luminnus.lia.ai@gmail.com"];

/**
 * INTERFACE DO CONTEXTO DE AUTENTICAÇÃO
 * Define os tipos e métodos disponíveis no AuthContext
 */
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

/**
 * FUNÇÃO HELPER: TRADUZ ERROS DO SUPABASE PARA PORTUGUÊS
 * Recebe um erro do Supabase e retorna uma mensagem amigável
 */
const getErrorMessage = (error: any): string => {
  if (!error) return 'Erro desconhecido';

  // Erro de credenciais inválidas (mensagem específica solicitada)
  if (error.message?.includes('Invalid login credentials') ||
      error.message?.includes('Invalid email or password')) {
    return 'E-mail ou senha inválidos';
  }

  // Erro de email já cadastrado
  if (error.message?.includes('User already registered') ||
      error.message?.includes('already exists')) {
    return 'Este email já está cadastrado';
  }

  // Erro de senha fraca
  if (error.message?.includes('Password should be at least')) {
    return 'A senha deve ter no mínimo 6 caracteres';
  }

  // Erro de email inválido
  if (error.message?.includes('Invalid email') ||
      error.message?.includes('valid email')) {
    return 'Email inválido';
  }

  // Erro de rede/conexão (mensagem específica solicitada)
  if (error.message?.includes('Failed to fetch') ||
      error.message?.includes('Network') ||
      error.message?.includes('network') ||
      error.message?.includes('connection')) {
    return 'Erro ao conectar. Tente novamente.';
  }

  // Erro de tempo de conexão esgotado
  if (error.message?.includes('timeout')) {
    return 'Erro ao conectar. Tente novamente.';
  }

  // Erro de campos vazios (será capturado na validação do form)
  if (error.message?.includes('required') ||
      error.message?.includes('empty')) {
    return 'Preencha todos os campos';
  }

  // Retorna a mensagem original se não for reconhecida
  return error.message || 'Erro ao conectar. Tente novamente.';
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  /**
   * FUNÇÃO DE LOGIN
   * Autentica o usuário com email e senha
   * Retorna erro traduzido em português se houver falha
   * Redireciona automaticamente admins para /admin-dashboard
   */
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return { error: { message: getErrorMessage(error) } };
    }

    // Verifica se o usuário é admin e redireciona
    if (data?.user?.email && ADMIN_EMAILS.includes(data.user.email)) {
      window.location.href = '/admin-dashboard';
    }

    return { error: null };
  };

  /**
   * FUNÇÃO DE CADASTRO
   * Cria uma nova conta de usuário
   * Retorna erro traduzido em português se houver falha
   */
  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { full_name: fullName }
      }
    });

    if (error) {
      return { error: { message: getErrorMessage(error) } };
    }

    return { error: null };
  };

  /**
   * FUNÇÃO DE LOGIN COM GOOGLE
   * Autentica o usuário usando OAuth do Google
   * Redireciona para a Área do Cliente após sucesso
   */
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });

    if (error) {
      return { error: { message: getErrorMessage(error) } };
    }

    return { error: null };
  };

  /**
   * FUNÇÃO DE LOGOUT
   * Remove a sessão do usuário e limpa os dados de autenticação
   */
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
