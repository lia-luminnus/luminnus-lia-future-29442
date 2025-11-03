import { useState } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminLiaConfig } from "@/components/admin/AdminLiaConfig";
import { AdminTools } from "@/components/admin/AdminTools";
import { AdminHistory } from "@/components/admin/AdminHistory";
import { AdminPlans } from "@/components/admin/AdminPlans";
import { AdminTechnical } from "@/components/admin/AdminTechnical";
import { Loader2 } from "lucide-react";

const AdminDashboard = () => {
  const { isAdmin, isLoading, adminEmail } = useAdminAuth();
  const [activeSection, setActiveSection] = useState("overview");

  // Enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-purple-600" />
          <p className="mt-4 text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Se não for admin, o hook já redireciona, mas por segurança mostramos isso
  if (!isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Acesso Negado</h1>
          <p className="mt-2 text-muted-foreground">
            Você não tem permissão para acessar esta página.
          </p>
        </div>
      </div>
    );
  }

  // Renderiza a seção ativa
  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <AdminOverview />;
      case "users":
        return <AdminUsers />;
      case "lia-config":
        return <AdminLiaConfig />;
      case "tools":
        return <AdminTools />;
      case "history":
        return <AdminHistory />;
      case "plans":
        return <AdminPlans />;
      case "technical":
        return <AdminTechnical />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      {/* Main Content */}
      <main className="flex-1 md:ml-64">
        {/* Top Bar */}
        <div className="border-b bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {activeSection === "overview" && "Visão Geral"}
                {activeSection === "users" && "Gerenciar Usuários"}
                {activeSection === "lia-config" && "Configurações da LIA"}
                {activeSection === "tools" && "Ferramentas e Testes"}
                {activeSection === "history" && "Histórico de Interações"}
                {activeSection === "plans" && "Planos e Permissões"}
                {activeSection === "technical" && "Configurações Técnicas"}
              </h1>
              <p className="text-sm text-muted-foreground">
                Logado como: <span className="font-medium">{adminEmail}</span>
              </p>
            </div>
            <div className="hidden items-center gap-4 md:flex">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">Painel Admin</div>
                <div className="text-xs text-muted-foreground">Sistema LIA</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {renderSection()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
