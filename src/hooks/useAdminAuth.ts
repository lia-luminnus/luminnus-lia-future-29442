import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// ✅ Lista de e-mails autorizados como administradores
const ADMIN_EMAILS = [
  "luminnus.lia.ai@gmail.com",
  "admin@luminnus.com"
];

export const useAdminAuth = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const userIsAdmin = ADMIN_EMAILS.includes(user.email || "");
    setIsAdmin(userIsAdmin);

    if (!userIsAdmin) {
      navigate("/dashboard");
    } else {
      navigate("/admin-dashboard");
    }

    setIsLoading(false);
  }, [user, navigate]);

  return { isAdmin, isLoading };
};
