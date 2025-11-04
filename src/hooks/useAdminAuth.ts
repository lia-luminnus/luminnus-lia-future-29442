import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ADMIN_EMAILS = [
  "luminnus.lia.ai@gmail.com", // email autorizado como admin
];

export function useAdminAuth() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Verificação inline do isAdmin
  const isAdmin = user?.email === "luminnus.lia.ai@gmail.com";

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
    }
  }, [user, loading, navigate, location.pathname, isAdmin]);

  return {
    isAdmin,
    isLoading: loading,
    adminEmail: user?.email || "",
  };
}
