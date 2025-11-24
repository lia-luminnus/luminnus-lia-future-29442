import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { AccountMenu } from "@/components/AccountMenu";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Building2, Sparkles } from "lucide-react";

export function UnifiedHeader() {
  const location = useLocation();
  const { user } = useAuth();

  // Detecta em qual "mundo" o usuário está
  const isInImobiliaria = 
    location.pathname.startsWith('/imobiliaria') || 
    location.pathname.startsWith('/cliente') || 
    location.pathname.startsWith('/admin-imob');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo / Brand */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Luminnus
            </span>
          </Link>
        </div>

        {/* Abas Principais */}
        <nav className="flex items-center gap-1 mx-auto">
          <Link to="/">
            <Button 
              variant={!isInImobiliaria ? "default" : "ghost"}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Tecnologia & LIA
            </Button>
          </Link>
          
          <Link to="/imobiliaria">
            <Button 
              variant={isInImobiliaria ? "default" : "ghost"}
              className="gap-2"
            >
              <Building2 className="h-4 w-4" />
              Imobiliária
            </Button>
          </Link>
        </nav>

        {/* Menu do Usuário / Theme Toggle */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user && <AccountMenu />}
        </div>
      </div>
    </header>
  );
}
