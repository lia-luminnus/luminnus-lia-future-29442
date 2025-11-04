import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Settings,
  Wrench,
  MessageSquare,
  CreditCard,
  Code,
  LogOut,
  Menu,
  X,
  Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: "overview", label: "Visão Geral", icon: LayoutDashboard },
  { id: "lia-chat", label: "Assistente LIA", icon: Bot },
  { id: "users", label: "Gerenciar Usuários", icon: Users },
  { id: "lia-config", label: "Configurações da LIA", icon: Settings },
  { id: "tools", label: "Ferramentas e Testes", icon: Wrench },
  { id: "history", label: "Histórico de Interações", icon: MessageSquare },
  { id: "plans", label: "Planos e Permissões", icon: CreditCard },
  { id: "technical", label: "Configurações Técnicas", icon: Code },
];

export const AdminSidebar = ({ activeSection, onSectionChange }: AdminSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 text-white transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-center border-b border-purple-700 p-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold">LIA Admin</h1>
              <p className="text-sm text-purple-200">Painel de Controle</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-all",
                    isActive
                      ? "bg-white text-purple-900 shadow-lg"
                      : "text-purple-100 hover:bg-purple-700/50"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Footer - Logout */}
          <div className="border-t border-purple-700 p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-purple-100 hover:bg-purple-700/50 hover:text-white"
              onClick={handleSignOut}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sair do Admin
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
