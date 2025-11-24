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
import AdminLiaChat from "@/components/admin/AdminLiaChat";
import AdminErrors from "@/components/admin/AdminErrors";
import AdminLogs from "@/components/admin/AdminLogs";
import AdminCompanies from "@/components/admin/AdminCompanies";
import AdminIntegrations from "@/components/admin/AdminIntegrations";
import AdminMetrics from "@/components/admin/AdminMetrics";
import AdminSupport from "@/components/admin/AdminSupport";
import AdminLiaCoreUpdates from "@/components/admin/AdminLiaCoreUpdates";
import AdminBuscas from "@/components/admin/AdminBuscas";
import AdminPainel from "@/pages/admin/Painel";
import AdminClientes from "@/pages/admin/Clientes";
import AdminImoveis from "@/pages/admin/Imoveis";
import AdminAgenda from "@/pages/admin/Agenda";
import AdminProcessos from "@/pages/admin/Processos";
import AdminConfiguracoes from "@/pages/admin/Configuracoes";
import { Loader2 } from "lucide-react";

const AdminDashboard = () => {
  const { isAdmin, isLoading, adminEmail } = useAdminAuth();
  const [activeSection, setActiveSection] = useState("overview");
  const [activeContext, setActiveContext] = useState<"lia" | "imobiliaria">("lia");

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
    if (activeContext === "imobiliaria") {
      switch (activeSection) {
        case "imob-inicio":
          return <AdminPainel />;
        case "imob-clientes":
          return <AdminClientes />;
        case "imob-imoveis":
          return <AdminImoveis />;
        case "imob-agenda":
          return <AdminAgenda />;
        case "imob-processos":
          return <AdminProcessos />;
        case "imob-buscas":
          return <AdminBuscas />;
        case "imob-config":
          return <AdminConfiguracoes />;
        default:
          return <AdminPainel />;
      }
    }

    switch (activeSection) {
      case "overview":
        return <AdminOverview />;
      case "lia-chat":
        return <AdminLiaChat />;
      case "users":
        return <AdminUsers />;
      case "companies":
        return <AdminCompanies />;
      case "lia-config":
        return <AdminLiaConfig />;
      case "lia-core-updates":
        return <AdminLiaCoreUpdates />;
      case "tools":
        return <AdminTools />;
      case "history":
        return <AdminHistory />;
      case "plans":
        return <AdminPlans />;
      case "integrations":
        return <AdminIntegrations />;
      case "metrics":
        return <AdminMetrics />;
      case "support":
        return <AdminSupport />;
      case "logs":
        return <AdminLogs />;
      case "errors":
        return <AdminErrors />;
      case "technical":
        return <AdminTechnical />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <AdminSidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        activeContext={activeContext}
        onContextChange={setActiveContext}
      />

      {/* Main Content */}
      <main className="flex-1 md:ml-64">
        {/* Top Bar */}
        <div className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {activeContext === "imobiliaria" ? (
                  <>
                    {activeSection === "imob-inicio" && "Dashboard Imobiliária"}
                    {activeSection === "imob-clientes" && "Gestão de Clientes"}
                    {activeSection === "imob-imoveis" && "Gestão de Imóveis"}
                    {activeSection === "imob-agenda" && "Agenda"}
                    {activeSection === "imob-processos" && "Processos"}
                    {activeSection === "imob-buscas" && "Buscas de Clientes"}
                    {activeSection === "imob-config" && "Configurações"}
                  </>
                ) : (
                  <>
                    {activeSection === "overview" && "Visão Geral"}
                    {activeSection === "lia-chat" && "Assistente LIA"}
                    {activeSection === "users" && "Gerenciar Usuários"}
                    {activeSection === "companies" && "Gestão de Empresas"}
                    {activeSection === "lia-config" && "Configurações da LIA"}
                    {activeSection === "lia-core-updates" && "LIA Core Updates"}
                    {activeSection === "tools" && "Ferramentas e Testes"}
                    {activeSection === "history" && "Histórico de Interações"}
                    {activeSection === "plans" && "Planos e Permissões"}
                    {activeSection === "integrations" && "Integrações"}
                    {activeSection === "metrics" && "Métricas e Analytics"}
                    {activeSection === "support" && "Suporte"}
                    {activeSection === "logs" && "Logs do Sistema"}
                    {activeSection === "errors" && "Monitoramento de Erros"}
                    {activeSection === "technical" && "Configurações Técnicas"}
                  </>
                )}
              </h1>
              <p className="text-sm text-muted-foreground">
                Logado como: <span className="font-medium">{adminEmail}</span>
              </p>
            </div>
            <div className="hidden items-center gap-4 md:flex">
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">Painel Admin</div>
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
