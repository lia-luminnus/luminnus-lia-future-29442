import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// 🔐 Lista de emails autorizados como administradores
const ADMIN_EMAILS = [
  "meuemail@dominio.com",
  "admin@luminnus.com",
  // Adicione mais emails autorizados aqui
  "luminnus.lia.ai@gmail.com",
];

/**
 * Hook para verificar se o usuário atual é um administrador
 * Redireciona automaticamente se não tiver permissão
 */
export const useAdminAuth = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      // Não está logado, redireciona para login
      navigate("/auth");
      return;
    }

    // Verifica se o email do usuário está na lista de admins
    const userIsAdmin = ADMIN_EMAILS.includes(user.email || "");
    setIsAdmin(userIsAdmin);

    if (!userIsAdmin) {
      // Não é admin, redireciona para dashboard normal
      navigate("/dashboard");
    }

    setIsLoading(false);
  }, [user, navigate]);

  return { isAdmin, isLoading, adminEmail: user?.email };
};

/**
 * Verifica se um email é admin (sem redirecionar)
 */
export const isAdminEmail = (email: string | undefined): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email);
};
