import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import luminmusLogo from "@/assets/luminnus-logo-new.png";
import loginBg from "@/assets/imobiliaria-login-bg.jpg";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas nao coincidem");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter no minimo 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(email, password, fullName, phone, address);
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("Erro ao criar conta. Tente novamente.");
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

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F3EEFF] to-white dark:from-[#0F0F14] dark:to-[#1A1A22] flex items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Conta criada!</h2>
            <p className="text-muted-foreground mb-6">
              Verifique seu email para confirmar sua conta e comecar a usar a plataforma.
            </p>
            <Button onClick={() => navigate("/imobiliaria/login")} className="w-full">
              Ir para o Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3EEFF] to-white dark:from-[#0F0F14] dark:to-[#1A1A22]">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <div className="min-h-screen grid lg:grid-cols-2">
        {/* Left Column - Form */}
        <div className="flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md space-y-8">
            {/* Logo and Header */}
            <div className="text-center space-y-6">
              <Link to="/imobiliaria" className="inline-block">
                <img
                  src={luminmusLogo}
                  alt="Luminnus"
                  className="h-20 w-auto mx-auto"
                />
              </Link>
              
              <div className="flex items-center justify-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wide">Imobiliária</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Criar sua conta
                </h1>
                <p className="text-muted-foreground">
                  Cadastre-se para acompanhar seus imóveis favoritos
                </p>
              </div>
            </div>

            {/* Registration Form */}
            <div className="space-y-6">
              {error && (
                <div className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome completo</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Seu nome completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Seu endereço completo"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 pr-10"
                      required
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar senha</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>

                <Button type="submit" className="w-full h-12" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Criando conta...
                    </>
                  ) : (
                    "Criar conta"
                  )}
                </Button>
              </form>

              {/* Separator */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">ou</span>
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

              {/* Footer Links */}
              <div className="space-y-4 pt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Já tem uma conta?{" "}
                  <Link to="/imobiliaria/login" className="text-primary hover:underline font-medium">
                    Entrar
                  </Link>
                </p>
                <Link
                  to="/imobiliaria"
                  className="inline-block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Voltar para o site
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="hidden lg:block relative">
          <img
            src={loginBg}
            alt="Vista aérea de Aveiro"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-transparent" />
          <div className="relative h-full flex items-center justify-center p-12">
            <div className="max-w-md text-white space-y-6">
              <h2 className="text-4xl font-bold leading-tight">
                Encontre seu imóvel dos sonhos
              </h2>
              <p className="text-lg text-white/90">
                Cadastre-se agora e tenha acesso exclusivo às melhores ofertas de imóveis
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
