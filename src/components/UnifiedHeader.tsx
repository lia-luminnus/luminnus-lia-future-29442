import { useState } from "react";
import { Menu, X, User, LogOut, Shield, Building2 } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import AccountMenu from "@/components/AccountMenu";
import luminmusLogo from "@/assets/luminnus-logo-new.png";

const ADMIN_EMAIL = "luminnus.lia.ai@gmail.com";

const UnifiedHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Detecta automaticamente qual aba está ativa baseado na rota
  const isImobiliariaSection = location.pathname.startsWith('/imobiliaria') || 
                                location.pathname.startsWith('/cliente') || 
                                location.pathname.startsWith('/admin-imob');

  const [activeTab, setActiveTab] = useState(isImobiliariaSection ? "imobiliaria" : "tecnologia");

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
      setMobileMenuOpen(false);
    }
  };

  const handleHomeClick = () => {
    const currentPath = window.location.pathname;
    if (currentPath === '/') {
      scrollToSection("inicio");
    } else {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById("inicio");
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      }, 100);
    }
    setMobileMenuOpen(false);
  };

  const handleSolutionsClick = () => {
    const currentPath = window.location.pathname;
    if (currentPath === '/') {
      scrollToSection("solucoes");
    } else {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById("solucoes");
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      }, 100);
    }
    setMobileMenuOpen(false);
  };

  const handleContactClick = () => {
    const currentPath = window.location.pathname;
    if (currentPath === '/') {
      scrollToSection("contato");
    } else {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById("contato");
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      }, 100);
    }
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "tecnologia") {
      navigate('/');
    } else {
      navigate('/imobiliaria');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md shadow-lg border-b border-white/10">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <button 
            onClick={handleHomeClick} 
            className="flex items-center cursor-pointer bg-transparent border-0 p-0"
          >
            <img 
              src={luminmusLogo} 
              alt="Luminnus - Inteligência & Soluções" 
              className="h-20 lg:h-28 w-auto object-contain transition-all hover:scale-110" 
            />
          </button>

          {/* Desktop Tabs + Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {/* Tabs */}
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full p-1 border border-white/10">
              <button
                onClick={() => handleTabChange("tecnologia")}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  activeTab === "tecnologia"
                    ? "bg-gradient-to-r from-[#6A00FF] to-[#00C2FF] text-white shadow-lg"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Tecnologia & LIA
              </button>
              <button
                onClick={() => handleTabChange("imobiliaria")}
                className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                  activeTab === "imobiliaria"
                    ? "bg-gradient-to-r from-[#6A00FF] to-[#00C2FF] text-white shadow-lg"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <Building2 className="w-4 h-4" />
                Imobiliária
              </button>
            </div>

            {/* Navigation based on active tab */}
            <nav className="flex items-center space-x-6">
              {activeTab === "tecnologia" ? (
                <>
                  <button 
                    onClick={handleHomeClick} 
                    className="text-white hover:text-accent transition-all font-medium drop-shadow-md"
                  >
                    {t('nav_inicio')}
                  </button>
                  <button 
                    onClick={handleSolutionsClick} 
                    className="text-white hover:text-accent transition-all font-medium drop-shadow-md"
                  >
                    {t('nav_solucoes')}
                  </button>
                  <Link 
                    to="/planos" 
                    className="text-white hover:text-accent transition-all font-medium drop-shadow-md"
                  >
                    {t('nav_planos')}
                  </Link>
                  <button 
                    onClick={handleContactClick} 
                    className="text-white hover:text-accent transition-all font-medium drop-shadow-md"
                  >
                    {t('nav_contato')}
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/imobiliaria" 
                    className={`text-white hover:text-accent transition-all font-medium drop-shadow-md ${
                      location.pathname === '/imobiliaria' ? 'text-accent' : ''
                    }`}
                  >
                    Início
                  </Link>
                  <Link 
                    to="/imobiliaria/imoveis" 
                    className={`text-white hover:text-accent transition-all font-medium drop-shadow-md ${
                      location.pathname === '/imobiliaria/imoveis' ? 'text-accent' : ''
                    }`}
                  >
                    Imóveis
                  </Link>
                  <Link 
                    to="/imobiliaria/contato" 
                    className={`text-white hover:text-accent transition-all font-medium drop-shadow-md ${
                      location.pathname === '/imobiliaria/contato' ? 'text-accent' : ''
                    }`}
                  >
                    Contato
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Action Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {activeTab === "tecnologia" && <LanguageSwitcher />}

            {user ? (
              isImobiliariaSection ? (
                <div className="flex items-center gap-2">
                  <Link
                    to={user.email === ADMIN_EMAIL ? "/admin-imob" : "/cliente"}
                    className="bg-gradient-to-r from-[#6A00FF] to-[#00C2FF] text-white font-semibold px-4 py-2 rounded-md shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
                  >
                    {user.email === ADMIN_EMAIL ? (
                      <>
                        <Shield className="w-4 h-4" />
                        Painel Admin
                      </>
                    ) : (
                      <>
                        <User className="w-4 h-4" />
                        Minha Área
                      </>
                    )}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-white hover:text-accent transition-all"
                    title="Sair"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <AccountMenu />
              )
            ) : (
              <Link
                to={activeTab === "imobiliaria" ? "/imobiliaria/login" : "/auth"}
                className="bg-gradient-to-r from-[#6A00FF] to-[#00C2FF] text-white font-semibold px-5 py-2 rounded-md shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                {activeTab === "imobiliaria" ? "Entrar" : t('btn_login')}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <button className="p-2 text-white">
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background/95 backdrop-blur-md">
              <nav className="flex flex-col gap-6 mt-8">
                {/* Mobile Tabs */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      handleTabChange("tecnologia");
                      setMobileMenuOpen(false);
                    }}
                    className={`px-4 py-3 rounded-lg font-medium transition-all text-left ${
                      activeTab === "tecnologia"
                        ? "bg-gradient-to-r from-[#6A00FF] to-[#00C2FF] text-white"
                        : "bg-card text-foreground hover:bg-accent"
                    }`}
                  >
                    Tecnologia & LIA
                  </button>
                  <button
                    onClick={() => {
                      handleTabChange("imobiliaria");
                      setMobileMenuOpen(false);
                    }}
                    className={`px-4 py-3 rounded-lg font-medium transition-all text-left flex items-center gap-2 ${
                      activeTab === "imobiliaria"
                        ? "bg-gradient-to-r from-[#6A00FF] to-[#00C2FF] text-white"
                        : "bg-card text-foreground hover:bg-accent"
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    Imobiliária
                  </button>
                </div>

                {/* Mobile Navigation */}
                <div className="flex flex-col gap-3 border-t border-border pt-4">
                  {activeTab === "tecnologia" ? (
                    <>
                      <button 
                        onClick={handleHomeClick} 
                        className="text-foreground hover:text-accent transition-colors font-medium text-left py-2"
                      >
                        {t('nav_inicio')}
                      </button>
                      <button 
                        onClick={handleSolutionsClick} 
                        className="text-foreground hover:text-accent transition-colors font-medium text-left py-2"
                      >
                        {t('nav_solucoes')}
                      </button>
                      <Link 
                        to="/planos" 
                        className="text-foreground hover:text-accent transition-colors font-medium py-2" 
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t('nav_planos')}
                      </Link>
                      <button 
                        onClick={handleContactClick} 
                        className="text-foreground hover:text-accent transition-colors font-medium text-left py-2"
                      >
                        {t('nav_contato')}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/imobiliaria" 
                        className="text-foreground hover:text-accent transition-colors font-medium py-2" 
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Início
                      </Link>
                      <Link 
                        to="/imobiliaria/imoveis" 
                        className="text-foreground hover:text-accent transition-colors font-medium py-2" 
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Imóveis
                      </Link>
                      <Link 
                        to="/imobiliaria/contato" 
                        className="text-foreground hover:text-accent transition-colors font-medium py-2" 
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Contato
                      </Link>
                    </>
                  )}
                </div>

                {/* Mobile Actions */}
                <div className="flex flex-col gap-3 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <ThemeToggle />
                    {activeTab === "tecnologia" && <LanguageSwitcher />}
                  </div>

                  {user ? (
                    <>
                      <Link
                        to={
                          isImobiliariaSection 
                            ? (user.email === ADMIN_EMAIL ? "/admin-imob" : "/cliente")
                            : (user.email === ADMIN_EMAIL ? "/admin-dashboard" : "/dashboard")
                        }
                        className="bg-gradient-to-r from-[#6A00FF] to-[#00C2FF] text-white font-semibold px-5 py-3 rounded-md shadow-md hover:shadow-lg transition-all duration-300 text-center flex items-center justify-center gap-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {user.email === ADMIN_EMAIL ? (
                          <>
                            <Shield className="w-4 h-4" />
                            Painel Admin
                          </>
                        ) : (
                          <>
                            <User className="w-4 h-4" />
                            {isImobiliariaSection ? "Minha Área" : "Área do Cliente"}
                          </>
                        )}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="bg-white/10 hover:bg-white/20 text-foreground font-semibold px-5 py-3 rounded-md shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 border border-border"
                      >
                        <LogOut className="w-4 h-4" />
                        Sair
                      </button>
                    </>
                  ) : (
                    <Link
                      to={activeTab === "imobiliaria" ? "/imobiliaria/login" : "/auth"}
                      className="bg-gradient-to-r from-[#6A00FF] to-[#00C2FF] text-white font-semibold px-5 py-3 rounded-md shadow-md hover:shadow-lg transition-all duration-300 text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {activeTab === "imobiliaria" ? "Entrar" : t('btn_login')}
                    </Link>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default UnifiedHeader;
