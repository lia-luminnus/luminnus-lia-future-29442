import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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

  // Erro de credenciais inválidas
  if (error.message?.includes('Invalid login credentials')) {
    return 'Email ou senha incorretos';
  }

  // Erro de email já cadastrado
  if (error.message?.includes('User already registered')) {
    return 'Este email já está cadastrado';
  }

  // Erro de senha fraca
  if (error.message?.includes('Password should be at least')) {
    return 'A senha deve ter no mínimo 6 caracteres';
  }

  // Erro de email inválido
  if (error.message?.includes('Invalid email')) {
    return 'Email inválido';
  }

  // Erro de rede/conexão
  if (error.message?.includes('Failed to fetch') || error.message?.includes('Network')) {
    return 'Erro de conexão com o banco de dados. Verifique sua internet.';
  }

  // Erro de tempo de conexão esgotado
  if (error.message?.includes('timeout')) {
    return 'Tempo de conexão esgotado. Tente novamente.';
  }

  // Retorna a mensagem original se não for reconhecida
  return error.message || 'Erro ao processar a solicitação';
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
   */
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return { error: { message: getErrorMessage(error) } };
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
        emailRedirectTo: `${window.location.origin}/area-do-cliente`,
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
        redirectTo: `${window.location.origin}/area-do-cliente`,
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
