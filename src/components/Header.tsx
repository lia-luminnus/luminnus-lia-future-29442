import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import luminmusLogo from "@/assets/luminnus-logo-gradient.png";
const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    t
  } = useLanguage();
  const navigate = useNavigate();
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
  return <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md shadow-lg border-b border-white/10">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <button onClick={handleHomeClick} className="flex items-center cursor-pointer bg-transparent border-0 p-0">
            <img src={luminmusLogo} alt="Luminnus - Inteligência & Soluções" className="h-32 lg:h-28 w-auto object-contain transition-all hover:scale-110" />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={handleHomeClick} className="text-white hover:text-accent transition-all font-medium drop-shadow-md">
              {t('nav_inicio')}
            </button>
            <button onClick={handleSolutionsClick} className="text-white hover:text-accent transition-all font-medium drop-shadow-md">
              {t('nav_solucoes')}
            </button>
            <Link to="/planos" className="text-white hover:text-accent transition-all font-medium drop-shadow-md">
              {t('nav_planos')}
            </Link>
            <button onClick={handleContactClick} className="text-white hover:text-accent transition-all font-medium drop-shadow-md">
              {t('nav_contato')}
            </button>
          </nav>

          {/* Action Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <a href="https://luminnus-lia-assistant.bubbleapps.io/" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-[#6A00FF] to-[#00C2FF] text-white font-semibold px-5 py-2 rounded-md shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
              {t('btn_login')}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && <nav className="md:hidden py-4 space-y-4 animate-fade-in border-t border-white/10 bg-black/40 backdrop-blur-md">
            <button onClick={handleHomeClick} className="block w-full text-left py-2 text-white hover:text-accent transition-colors font-medium">
              {t('nav_inicio')}
            </button>
            <button onClick={handleSolutionsClick} className="block w-full text-left py-2 text-white hover:text-accent transition-colors font-medium">
              {t('nav_solucoes')}
            </button>
            <Link to="/planos" className="block w-full text-left py-2 text-white hover:text-accent transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
              {t('nav_planos')}
            </Link>
            <button onClick={handleContactClick} className="block w-full text-left py-2 text-white hover:text-accent transition-colors font-medium">
              {t('nav_contato')}
            </button>
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex justify-center pb-2">
                <LanguageSwitcher />
              </div>
              <a href="https://luminnus-lia-assistant.bubbleapps.io/" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-[#6A00FF] to-[#00C2FF] text-white font-semibold px-5 py-2 rounded-md shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 text-center">
                {t('btn_login')}
              </a>
            </div>
          </nav>}
      </div>
    </header>;
};
export default Header;