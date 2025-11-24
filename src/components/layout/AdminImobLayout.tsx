import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Users,
  Building2,
  FileCheck,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Shield,
  Bell,
  Search
} from "lucide-react";
import luminmusLogo from "@/assets/luminnus-logo-new.png";
import { Input } from "@/components/ui/input";

interface AdminImobLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Painel", path: "/admin-imob" },
  { icon: Users, label: "Clientes", path: "/admin-imob/clientes" },
  { icon: Building2, label: "Imoveis", path: "/admin-imob/imoveis" },
  { icon: FileCheck, label: "Processos", path: "/admin-imob/processos" },
  { icon: Calendar, label: "Agenda", path: "/admin-imob/agenda" },
  { icon: Settings, label: "Configuracoes", path: "/admin-imob/configuracoes" },
];

const AdminImobLayout = ({ children }: AdminImobLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/imobiliaria");
  };

  const isActive = (path: string) => {
    if (path === "/admin-imob") {
      return location.pathname === "/admin-imob";
    }
    return location.pathname.startsWith(path);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#1A1A22] to-[#0F0F14]">
      {/* Logo */}
      <div className="p-5 border-b border-white/10">
        <Link to="/imobiliaria" className="flex items-center gap-2 group">
          <img
            src={luminmusLogo}
            alt="Luminnus"
            className="h-10 w-auto brightness-0 invert transition-all duration-[var(--transition)] group-hover:scale-105"
          />
        </Link>
        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#7B2FF7]/20 rounded-lg">
            <Shield className="w-3.5 h-3.5 text-[#9F57FF]" />
            <span className="text-xs font-semibold text-[#C7A4FF]">Admin</span>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#7B2FF7] to-[#9F57FF] flex items-center justify-center shadow-[var(--shadow-purple)]">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              Administrador
            </p>
            <p className="text-xs text-white/60 truncate">
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
                : "text-white/70 hover:text-white hover:bg-white/10"
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
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link
          to="/imobiliaria"
          className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-[var(--transition-smooth)] group"
        >
          <ChevronLeft className="w-5 h-5 transition-transform duration-[var(--transition)] group-hover:-translate-x-1" />
          <span className="font-medium">Voltar ao Site</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-[var(--transition-smooth)] group"
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
      <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 shadow-xl">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#1A1A22]/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-xl">
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 border-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <Link to="/imobiliaria" className="flex items-center gap-2">
              <img src={luminmusLogo} alt="Luminnus" className="h-9 w-auto brightness-0 invert" />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-xl relative">
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
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-foreground">
              {menuItems.find(item => isActive(item.path))?.label || "Painel"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                className="pl-10 w-64 bg-muted/50 border-0 focus-visible:ring-[#7B2FF7]"
              />
            </div>
            <Button variant="ghost" size="icon" className="rounded-xl relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#7B2FF7] rounded-full" />
            </Button>
            <ThemeToggle />
          </div>
        </header>

        {/* Page Content */}
        <div className="pt-20 lg:pt-0 min-h-screen bg-muted/30">
          <div className="animate-fade-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminImobLayout;
