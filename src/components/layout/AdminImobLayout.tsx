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
  Shield
} from "lucide-react";
import luminmusLogo from "@/assets/luminnus-logo-new.png";

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
    <div className="flex flex-col h-full bg-gradient-to-b from-primary/95 to-primary">
      {/* Logo */}
      <div className="p-4 border-b border-white/10">
        <Link to="/imobiliaria" className="flex items-center gap-2">
          <img src={luminmusLogo} alt="Luminnus" className="h-10 w-auto brightness-0 invert" />
        </Link>
        <div className="flex items-center gap-2 mt-2 text-sm text-white/80">
          <Shield className="w-4 h-4" />
          Painel Administrativo
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              Admin
            </p>
            <p className="text-xs text-white/70 truncate">
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
                ? "bg-white text-primary"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link
          to="/imobiliaria"
          className="flex items-center gap-3 px-3 py-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Voltar ao Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
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
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 border-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <Link to="/imobiliaria" className="flex items-center gap-2">
              <img src={luminmusLogo} alt="Luminnus" className="h-8 w-auto brightness-0 invert" />
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:pl-64">
        {/* Desktop Header */}
        <header className="hidden lg:flex items-center justify-between p-4 border-b border-border bg-card/50">
          <h1 className="text-lg font-semibold text-foreground">
            {menuItems.find(item => isActive(item.path))?.label || "Painel"}
          </h1>
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

export default AdminImobLayout;
