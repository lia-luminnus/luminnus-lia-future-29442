import { useState } from "react";
import { Menu, X, User, LogOut, Building2, Cpu } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import luminmusLogo from "@/assets/luminnus-logo-new.png";

const ADMIN_EMAIL = "luminnus.lia.ai@gmail.com";

const ImobiliariaHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isImobiliariaSection = location.pathname.startsWith('/imobiliaria');

  const handleLogout = async () => {
    await signOut();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md shadow-lg border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center cursor-pointer">
            <img
              src={luminmusLogo}
              alt="Luminnus - Inteligencia & Solucoes"
              className="h-16 lg:h-20 w-auto object-contain transition-all hover:scale-105"
            />
          </Link>

          {/* Tab Navigation - Desktop */}
          <nav className="hidden md:flex items-center">
            <div className="flex bg-muted rounded-lg p-1">
              <Link
                to="/"
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                  !isImobiliariaSection
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
                }`}
              >
                <Cpu className="w-4 h-4" />
                Tecnologia & LIA
              </Link>
              <Link
                to="/imobiliaria"
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                  isImobiliariaSection
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Imobiliaria
              </Link>
            </div>
          </nav>

          {/* Secondary Navigation for Imobiliaria - Desktop */}
          {isImobiliariaSection && (
            <nav className="hidden lg:flex items-center space-x-6">
              <Link
                to="/imobiliaria"
                className="text-foreground hover:text-primary transition-all font-medium"
              >
                Inicio
              </Link>
              <Link
                to="/imobiliaria/imoveis"
                className="text-foreground hover:text-primary transition-all font-medium"
              >
                Imoveis
              </Link>
              <Link
                to="/imobiliaria/contato"
                className="text-foreground hover:text-primary transition-all font-medium"
              >
                Contato
              </Link>
            </nav>
          )}

          {/* Action Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to={user.email === ADMIN_EMAIL ? "/admin-imob" : "/cliente"}
                  className="bg-primary text-primary-foreground font-semibold px-4 py-2 rounded-md shadow-md hover:bg-primary/90 transition-all flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  {user.email === ADMIN_EMAIL ? 'Painel Admin' : 'Minha Area'}
                </Link>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link
                to="/imobiliaria/login"
                className="bg-primary text-primary-foreground font-semibold px-5 py-2 rounded-md shadow-md hover:bg-primary/90 transition-all"
              >
                Entrar
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-background">
                <nav className="flex flex-col gap-4 mt-8">
                  {/* Tab Navigation - Mobile */}
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-md font-medium transition-all ${
                        !isImobiliariaSection
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <Cpu className="w-4 h-4" />
                      Tecnologia & LIA
                    </Link>
                    <Link
                      to="/imobiliaria"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-md font-medium transition-all ${
                        isImobiliariaSection
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      Imobiliaria
                    </Link>
                  </div>

                  <div className="border-t border-border my-2" />

                  {/* Imobiliaria Links */}
                  <Link
                    to="/imobiliaria"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 text-foreground hover:text-primary transition-colors font-medium"
                  >
                    Inicio
                  </Link>
                  <Link
                    to="/imobiliaria/imoveis"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 text-foreground hover:text-primary transition-colors font-medium"
                  >
                    Imoveis
                  </Link>
                  <Link
                    to="/imobiliaria/contato"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 text-foreground hover:text-primary transition-colors font-medium"
                  >
                    Contato
                  </Link>

                  <div className="border-t border-border my-2" />

                  {/* Auth Buttons - Mobile */}
                  {user ? (
                    <>
                      <Link
                        to={user.email === ADMIN_EMAIL ? "/admin-imob" : "/cliente"}
                        onClick={() => setMobileMenuOpen(false)}
                        className="bg-primary text-primary-foreground font-semibold px-4 py-3 rounded-md text-center flex items-center justify-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        {user.email === ADMIN_EMAIL ? 'Painel Admin' : 'Minha Area'}
                      </Link>
                      <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sair
                      </Button>
                    </>
                  ) : (
                    <Link
                      to="/imobiliaria/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="bg-primary text-primary-foreground font-semibold px-4 py-3 rounded-md text-center"
                    >
                      Entrar
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ImobiliariaHeader;
