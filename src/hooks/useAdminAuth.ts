```ts
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";

const ADMIN_EMAILS = [
  "luminus.lia.ai@gmail.com", // email autorizado como admin
];

export function useAdminAuth() {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const isAdmin = ADMIN_EMAILS.includes(user.email ?? "");

    if (isAdmin && router.pathname !== "/admin-dashboard") {
      router.push("/admin-dashboard");
    } else if (!isAdmin && router.pathname.startsWith("/admin-dashboard")) {
      router.push("/dashboard");
    }
  }, [user, router]);
}