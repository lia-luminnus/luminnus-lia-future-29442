import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Calendar,
  FileCheck,
  Building2,
  User,
  LogOut,
  Menu,
  X,
  ChevronLeft
} from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import luminmusLogo from "@/assets/luminnus-logo-new.png";

interface ClienteLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/cliente" },
  { icon: Calendar, label: "Agenda", path: "/cliente/agenda" },
  { icon: FileCheck, label: "Status", path: "/cliente/status" },
  { icon: Building2, label: "Imoveis Sugeridos", path: "/cliente/imoveis-sugeridos" },
  { icon: User, label: "Meus Dados", path: "/cliente/meus-dados" },
];

const ClienteLayout = ({ children }: ClienteLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/imobiliaria");
  };

  const isActive = (path: string) => {
    if (path === "/cliente") {
      return location.pathname === "/cliente";
    }
    return location.pathname.startsWith(path);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <Link to="/imobiliaria" className="flex items-center gap-2">
          <img src={luminmusLogo} alt="Luminnus" className="h-10 w-auto" />
        </Link>
        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
          <Building2 className="w-4 h-4 text-primary" />
          Area do Cliente
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.user_metadata?.full_name || "Cliente"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              isActive(item.path)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-border space-y-2">
        <Link
          to="/imobiliaria"
          className="flex items-center gap-3 px-3 py-2.5 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Voltar ao Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-card border-r border-border">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <Link to="/imobiliaria" className="flex items-center gap-2">
              <img src={luminmusLogo} alt="Luminnus" className="h-8 w-auto" />
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:pl-64">
        {/* Desktop Header */}
        <header className="hidden lg:flex items-center justify-end p-4 border-b border-border bg-card/50">
          <ThemeToggle />
        </header>

        {/* Page Content */}
        <div className="pt-20 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
};

export default ClienteLayout;
