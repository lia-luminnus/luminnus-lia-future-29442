import { useState } from "react";
import { Menu, X, User, LogOut, Building2, Cpu } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import luminmusLogo from "@/assets/luminnus-logo-new.png";

const ImobiliariaHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isImobiliariaSection = location.pathname.startsWith('/imobiliaria');

  const handleLogout = async () => {
    await signOut();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const isActiveLink = (path: string) => {
    if (path === '/imobiliaria') {
      return location.pathname === '/imobiliaria';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl shadow-[var(--shadow-sm)] border-b border-[var(--lum-border)] dark:border-[var(--lum-border-dark)] animate-fade-in">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center cursor-pointer group">
            <img
              src={luminmusLogo}
              alt="Luminnus - Inteligencia & Solucoes"
              className="h-14 lg:h-18 w-auto object-contain transition-all duration-[var(--transition)] group-hover:scale-105 group-hover:brightness-110"
            />
          </Link>

          {/* Tab Navigation - Desktop */}
          <nav className="hidden md:flex items-center">
            <div className="flex bg-muted/50 rounded-xl p-1.5 backdrop-blur-sm border border-[var(--lum-border)] dark:border-[var(--lum-border-dark)]">
              <Link
                to="/"
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-[var(--transition-smooth)] ${
                  !isImobiliariaSection
                    ? 'bg-[#7B2FF7] text-white shadow-[var(--shadow-purple)]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
                }`}
              >
                <Cpu className="w-4 h-4" />
                Tecnologia & LIA
              </Link>
              <Link
                to="/imobiliaria"
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-[var(--transition-smooth)] ${
                  isImobiliariaSection
                    ? 'bg-[#7B2FF7] text-white shadow-[var(--shadow-purple)]'
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
            <nav className="hidden lg:flex items-center space-x-8">
              {[
                { path: '/imobiliaria', label: 'Inicio', exact: true },
                { path: '/imobiliaria/imoveis', label: 'Imoveis' },
                { path: '/imobiliaria/contato', label: 'Contato' },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-foreground font-medium transition-all duration-[var(--transition)] hover:text-[#7B2FF7] ${
                    (link.exact ? location.pathname === link.path : location.pathname.startsWith(link.path))
                      ? 'text-[#7B2FF7]'
                      : ''
                  }`}
                >
                  {link.label}
                  {(link.exact ? location.pathname === link.path : location.pathname.startsWith(link.path)) && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#7B2FF7] rounded-full animate-scale-in" />
                  )}
                </Link>
              ))}
            </nav>
          )}

          {/* Action Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={role === 'admin' ? "/admin-dashboard" : "/cliente/dashboard"}
                  className="bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-xl shadow-lg hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  {role === 'admin' ? 'Painel Admin' : 'Minha Área'}
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-xl shadow-lg hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-300"
              >
                Entrar
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl">
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-background border-l border-[var(--lum-border)] dark:border-[var(--lum-border-dark)]">
                <nav className="flex flex-col gap-4 mt-8">
                  {/* Tab Navigation - Mobile */}
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-[var(--transition-smooth)] ${
                        !isImobiliariaSection
                          ? 'bg-[#7B2FF7] text-white shadow-[var(--shadow-purple)]'
                          : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <Cpu className="w-5 h-5" />
                      Tecnologia & LIA
                    </Link>
                    <Link
                      to="/imobiliaria"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-[var(--transition-smooth)] ${
                        isImobiliariaSection
                          ? 'bg-[#7B2FF7] text-white shadow-[var(--shadow-purple)]'
                          : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <Building2 className="w-5 h-5" />
                      Imobiliaria
                    </Link>
                  </div>

                  <div className="border-t border-[var(--lum-border)] dark:border-[var(--lum-border-dark)] my-2" />

                  {/* Imobiliaria Links */}
                  {[
                    { path: '/imobiliaria', label: 'Inicio' },
                    { path: '/imobiliaria/imoveis', label: 'Imoveis' },
                    { path: '/imobiliaria/contato', label: 'Contato' },
                  ].map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-lg font-medium transition-all duration-[var(--transition)] ${
                        isActiveLink(link.path)
                          ? 'text-[#7B2FF7] bg-[#7B2FF7]/10'
                          : 'text-foreground hover:text-[#7B2FF7] hover:bg-muted'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}

                  <div className="border-t border-[var(--lum-border)] dark:border-[var(--lum-border-dark)] my-2" />

                  {/* Auth Buttons - Mobile */}
                  {user ? (
                    <>
                      <Link
                        to={role === 'admin' ? "/admin-dashboard" : "/cliente/dashboard"}
                        onClick={() => setMobileMenuOpen(false)}
                        className="bg-primary text-primary-foreground font-semibold px-4 py-3.5 rounded-xl text-center flex items-center justify-center gap-2 shadow-lg hover:bg-primary/90 transition-all duration-300"
                      >
                        <User className="w-5 h-5" />
                        {role === 'admin' ? 'Painel Admin' : 'Minha Área'}
                      </Link>
                      <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:hover:bg-red-900/20"
                      >
                        <LogOut className="w-4 h-4" />
                        Sair
                      </Button>
                    </>
                  ) : (
                    <Link
                      to="/auth"
                      onClick={() => setMobileMenuOpen(false)}
                      className="bg-primary text-primary-foreground font-semibold px-4 py-3.5 rounded-xl text-center shadow-lg hover:bg-primary/90 transition-all duration-300"
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
