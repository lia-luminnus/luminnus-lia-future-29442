import { useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardUserMenu from '@/components/DashboardUserMenu';
import DashboardHome from '@/components/dashboard/DashboardHome';
import DashboardConversas from '@/components/dashboard/DashboardConversas';
import DashboardAgenda from '@/components/dashboard/DashboardAgenda';
import DashboardChat from '@/components/dashboard/DashboardChat';
import DashboardPlano from '@/components/dashboard/DashboardPlano';
import DashboardConfiguracoes from '@/components/dashboard/DashboardConfiguracoes';
import DashboardIntegracoes from '@/components/dashboard/DashboardIntegracoes';

/**
 * PÁGINA: Dashboard
 *
 * Dashboard principal do cliente com:
 * - Sidebar fixa à esquerda com navegação
 * - UserMenu no topo direito
 * - Área de conteúdo dinâmico baseado na rota
 * - Proteção de rota (apenas usuários autenticados)
 */
const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  /**
   * VERIFICAÇÃO DE AUTENTICAÇÃO
   * Redireciona para /auth se não estiver logado
   */
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  /**
   * LOADING STATE
   * Mostra spinner enquanto verifica autenticação
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0B0F] via-[#1a1a2e] to-[#0B0B0F] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  /**
   * PROTEÇÃO ADICIONAL
   * Se não houver usuário após o loading, não renderiza nada
   */
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0B0F] via-[#1a1a2e] to-[#0B0B0F]">
      {/* SIDEBAR */}
      <DashboardSidebar />

      {/* CONTEÚDO PRINCIPAL */}
      <div className="ml-64 min-h-screen">
        {/* HEADER COM USER MENU */}
        <header className="sticky top-0 z-40 bg-[#0B0B0F]/80 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-end px-8 py-4">
            <DashboardUserMenu />
          </div>
        </header>

        {/* ÁREA DE CONTEÚDO */}
        <main className="p-8">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/conversas" element={<DashboardConversas />} />
            <Route path="/agenda" element={<DashboardAgenda />} />
            <Route path="/chat" element={<DashboardChat />} />
            <Route path="/plano" element={<DashboardPlano />} />
            <Route path="/configuracoes" element={<DashboardConfiguracoes />} />
            <Route path="/integracoes" element={<DashboardIntegracoes />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
