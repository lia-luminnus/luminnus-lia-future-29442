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
  ChevronLeft,
  Home,
  Bell
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
    <div className="flex flex-col h-full bg-card">
      {/* Logo */}
      <div className="p-5 border-b border-[var(--lum-border)] dark:border-[var(--lum-border-dark)]">
        <Link to="/imobiliaria" className="flex items-center gap-2 group">
          <img
            src={luminmusLogo}
            alt="Luminnus"
            className="h-10 w-auto transition-all duration-[var(--transition)] group-hover:scale-105"
          />
        </Link>
        <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
          <Home className="w-4 h-4 text-[#7B2FF7]" />
          <span className="font-medium">Area do Cliente</span>
        </div>
      </div>

      {/* User Info */}
      <div className="p-5 border-b border-[var(--lum-border)] dark:border-[var(--lum-border-dark)]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#7B2FF7] to-[#9F57FF] flex items-center justify-center shadow-[var(--shadow-purple)]">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {user?.user_metadata?.full_name || "Cliente"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setMobileMenuOpen(false)}
            className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-[var(--transition-smooth)] relative ${
              isActive(item.path)
                ? "bg-[#7B2FF7] text-white shadow-[var(--shadow-purple)]"
                : "text-muted-foreground hover:text-foreground hover:bg-[#7B2FF7]/10"
            }`}
          >
            {isActive(item.path) && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
            )}
            <item.icon className={`w-5 h-5 transition-transform duration-[var(--transition)] ${!isActive(item.path) ? 'group-hover:scale-110' : ''}`} />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-[var(--lum-border)] dark:border-[var(--lum-border-dark)] space-y-2">
        <Link
          to="/imobiliaria"
          className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all duration-[var(--transition-smooth)] group"
        >
          <ChevronLeft className="w-5 h-5 transition-transform duration-[var(--transition)] group-hover:-translate-x-1" />
          <span className="font-medium">Voltar ao Site</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-[var(--transition-smooth)] group"
        >
          <LogOut className="w-5 h-5 transition-transform duration-[var(--transition)] group-hover:translate-x-1" />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 bg-card border-r border-[var(--lum-border)] dark:border-[var(--lum-border-dark)] shadow-[var(--shadow-sm)]">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-b border-[var(--lum-border)] dark:border-[var(--lum-border-dark)] shadow-[var(--shadow-sm)]">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl">
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 border-r border-[var(--lum-border)] dark:border-[var(--lum-border-dark)]">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <Link to="/imobiliaria" className="flex items-center gap-2">
              <img src={luminmusLogo} alt="Luminnus" className="h-9 w-auto" />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-xl relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#7B2FF7] rounded-full" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:pl-72">
        {/* Desktop Header */}
        <header className="hidden lg:flex items-center justify-between p-5 border-b border-[var(--lum-border)] dark:border-[var(--lum-border-dark)] bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <h1 className="text-lg font-semibold text-foreground">
            {menuItems.find(item => isActive(item.path))?.label || "Dashboard"}
          </h1>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-xl relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#7B2FF7] rounded-full" />
            </Button>
            <ThemeToggle />
          </div>
        </header>

        {/* Page Content */}
        <div className="pt-20 lg:pt-0 min-h-screen">
          <div className="animate-fade-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClienteLayout;
