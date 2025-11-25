import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Eye, EyeOff, Loader2, Home } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import luminmusLogo from "@/assets/luminnus-logo-new.png";
import imobiliariaLoginBg from "@/assets/imobiliaria-login-bg.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signIn, signInWithGoogle, user, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redireciona usuários já autenticados
  useEffect(() => {
    if (user && role) {
      const from = location.state?.from?.pathname;
      if (from && from !== "/imobiliaria/login") {
        navigate(from, { replace: true });
      } else if (role === "admin") {
        navigate("/admin-imob", { replace: true });
      } else {
        navigate("/cliente", { replace: true });
      }
    }
  }, [user, role, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        if (error.message === "Invalid login credentials") {
          setError("Email ou senha incorretos");
        } else {
          setError(error.message);
        }
      }
      // O redirecionamento é feito pelo useEffect acima
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
    setLoading(false);
  }
};

const handleGoogleSignIn = async () => {
  setError("");
  setGoogleLoading(true);
  try {
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error.message);
    }
  } catch (err) {
    setError("Erro ao fazer login com Google. Tente novamente.");
  } finally {
    setGoogleLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3EEFF] to-white dark:from-[#0F0F14] dark:to-[#1A1A22] flex items-center justify-center p-4">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-6xl bg-card rounded-2xl shadow-2xl overflow-hidden">
        <div className="grid lg:grid-cols-2 min-h-[600px]">
          {/* Coluna Esquerda - Formulário */}
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              {/* Logo e Badge */}
              <Link to="/imobiliaria" className="inline-block mb-6">
                <img
                  src={luminmusLogo}
                  alt="Luminnus"
                  className="h-20 w-auto"
                />
              </Link>
              
              <div className="flex items-center gap-2 mb-6">
                <Building2 className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wide">
                  Imobiliária
                </span>
              </div>

              <h1 className="text-3xl font-bold text-foreground mb-2">
                Bem-vindo de volta
              </h1>
              <p className="text-muted-foreground mb-8">
                Acesse sua conta para gerenciar seus imóveis e acompanhar seu processo
              </p>

              {/* Formulário */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>

              {/* Separator */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">ou</span>
                </div>
              </div>

              {/* Google Sign In */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-12"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
              >
                {googleLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continuar com Google
                  </>
                )}
              </Button>

              {/* Links */}
              <div className="mt-6 space-y-3 text-center">
                <p className="text-sm text-muted-foreground">
                  Não tem uma conta?{" "}
                  <Link to="/imobiliaria/registro" className="text-primary hover:underline font-semibold">
                    Criar conta
                  </Link>
                </p>
                <Link 
                  to="/imobiliaria" 
                  className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Voltar para o site
                </Link>
              </div>
            </div>
          </div>

          {/* Coluna Direita - Imagem */}
          <div className="hidden lg:block relative overflow-hidden">
            <img
              src={imobiliariaLoginBg}
              alt="Casas coloridas de Aveiro"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/70 mix-blend-multiply" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
              <h2 className="text-4xl font-bold mb-4 text-center">
                Encontre o lar dos seus sonhos
              </h2>
              <p className="text-lg text-center text-white/90 max-w-md">
                Descubra imóveis exclusivos em Aveiro e região com a melhor assessoria do mercado
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
