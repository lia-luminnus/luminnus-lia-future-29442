import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_EMAILS = [
  "luminnus.lia.ai@gmail.com", // email autorizado como admin
];

export function useAdminAuth() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasActivePlan, setHasActivePlan] = useState<boolean | null>(null);

  // Verificação inline do isAdmin
  const isAdmin = user?.email === "luminnus.lia.ai@gmail.com";

  // Verifica se o usuário tem plano ativo
  useEffect(() => {
    const checkUserPlan = async () => {
      if (!user || isAdmin) {
        setHasActivePlan(null);
        return;
      }

      try {
        const { data } = await supabase
          .from('planos')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'ativo')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        setHasActivePlan(!!data);
      } catch (error) {
        console.error('Erro ao verificar plano:', error);
        setHasActivePlan(false);
      }
    };

    checkUserPlan();
  }, [user, isAdmin]);

  useEffect(() => {
    // Se ainda estiver carregando, não faz nada
    if (loading) return;

    // Se não tiver usuário autenticado e estiver tentando acessar admin
    if (!user && location.pathname.startsWith("/admin-dashboard")) {
      navigate("/auth");
      return;
    }

    // Se tiver usuário, verifica se é admin
    if (user?.email) {
      // Redireciona admin para dashboard admin se estiver em outra página após login
      if (isAdmin && location.pathname === "/auth") {
        navigate("/admin-dashboard");
      }
      // Redireciona não-admin para dashboard normal se tentar acessar área admin
      else if (!isAdmin && location.pathname.startsWith("/admin-dashboard")) {
        navigate("/dashboard");
      }
      // Para usuários comuns após login, verifica plano
      else if (!isAdmin && location.pathname === "/auth" && hasActivePlan !== null) {
        if (hasActivePlan) {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      }
    }
  }, [user, loading, navigate, location.pathname, isAdmin, hasActivePlan]);

  return {
    isAdmin,
    isLoading: loading,
    adminEmail: user?.email || "",
    hasActivePlan,
  };
}
