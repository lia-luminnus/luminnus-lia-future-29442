import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ADMIN_EMAILS = [
  "luminus.lia.ai@gmail.com",
];

/**
 * Função auxiliar para verificar se um email é de administrador
 */
export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email);
}

/**
 * Hook para autenticação e controle de acesso de administradores
 * Retorna: { isAdmin, isLoading, adminEmail }
 */
export function useAdminAuth() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

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
      const adminStatus = isAdminEmail(user.email);
      setIsAdmin(adminStatus);

      // Redireciona admin para dashboard admin se estiver em outra página após login
      if (adminStatus && location.pathname === "/auth") {
        navigate("/admin-dashboard");
      }
      // Redireciona não-admin para dashboard normal se tentar acessar área admin
      else if (!adminStatus && location.pathname.startsWith("/admin-dashboard")) {
        navigate("/dashboard");
      }
    } else {
      setIsAdmin(false);
    }
  }, [user, loading, navigate, location.pathname]);

  return {
    isAdmin,
    isLoading: loading,
    adminEmail: user?.email || null,
  };
}
