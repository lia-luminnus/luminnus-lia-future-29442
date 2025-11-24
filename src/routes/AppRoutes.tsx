import { Routes, Route } from "react-router-dom";
import PrivateRoute from "@/components/PrivateRoute";

// Main Site Pages
import Index from "@/pages/Index";
import Plans from "@/pages/Plans";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import ClientArea from "@/pages/ClientArea";
import MyAccount from "@/pages/MyAccount";
import NotFound from "@/pages/NotFound";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import AdminConfig from "@/pages/AdminConfig";
import AdminDashboard from "@/pages/AdminDashboard";

// Imobiliaria Public Pages
import ImobiliariaHome from "@/pages/imobiliaria/Home";
import ListaImoveis from "@/pages/imobiliaria/ListaImoveis";
import DetalhesImovel from "@/pages/imobiliaria/DetalhesImovel";
import Contato from "@/pages/imobiliaria/Contato";

// Auth Pages (Imobiliaria)
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

// Cliente Pages (Imobiliaria)
import ClienteDashboard from "@/pages/cliente/Dashboard";
import ClienteAgenda from "@/pages/cliente/Agenda";
import ClienteStatus from "@/pages/cliente/Status";
import ClienteImoveisSugeridos from "@/pages/cliente/ImoveisSugeridos";
import ClienteMeusDados from "@/pages/cliente/MeusDados";

// Admin Imobiliaria Pages
import AdminPainel from "@/pages/admin/Painel";
import AdminClientes from "@/pages/admin/Clientes";
import AdminImoveis from "@/pages/admin/Imoveis";
import AdminProcessos from "@/pages/admin/Processos";
import AdminAgenda from "@/pages/admin/Agenda";
import AdminConfiguracoes from "@/pages/admin/Configuracoes";

/**
 * AppRoutes Component
 *
 * Centralized routing configuration with:
 * - Public routes (accessible without authentication)
 * - Cliente routes (requires cliente role)
 * - Admin routes (requires admin role)
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* ==================== PUBLIC ROUTES ==================== */}

      {/* Main Site Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/planos" element={<Plans />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/area-do-cliente" element={<ClientArea />} />
      <Route path="/minha-conta" element={<MyAccount />} />
      <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
      <Route path="/termos-de-uso" element={<TermsOfService />} />

      {/* Imobiliaria Public Routes */}
      <Route path="/imobiliaria" element={<ImobiliariaHome />} />
      <Route path="/imobiliaria/imoveis" element={<ListaImoveis />} />
      <Route path="/imobiliaria/imovel/:id" element={<DetalhesImovel />} />
      <Route path="/imobiliaria/contato" element={<Contato />} />
      <Route path="/imobiliaria/login" element={<Login />} />
      <Route path="/imobiliaria/registro" element={<Register />} />

      {/* ==================== CLIENTE ROUTES (Protected) ==================== */}

      <Route
        path="/cliente"
        element={
          <PrivateRoute role="cliente" redirectTo="/imobiliaria/login">
            <ClienteDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/cliente/agenda"
        element={
          <PrivateRoute role="cliente" redirectTo="/imobiliaria/login">
            <ClienteAgenda />
          </PrivateRoute>
        }
      />
      <Route
        path="/cliente/status"
        element={
          <PrivateRoute role="cliente" redirectTo="/imobiliaria/login">
            <ClienteStatus />
          </PrivateRoute>
        }
      />
      <Route
        path="/cliente/imoveis-sugeridos"
        element={
          <PrivateRoute role="cliente" redirectTo="/imobiliaria/login">
            <ClienteImoveisSugeridos />
          </PrivateRoute>
        }
      />
      <Route
        path="/cliente/meus-dados"
        element={
          <PrivateRoute role="cliente" redirectTo="/imobiliaria/login">
            <ClienteMeusDados />
          </PrivateRoute>
        }
      />

      {/* ==================== ADMIN IMOBILIARIA ROUTES (Protected) ==================== */}

      <Route
        path="/admin-imob"
        element={
          <PrivateRoute role="admin" redirectTo="/imobiliaria/login">
            <AdminPainel />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin-imob/clientes"
        element={
          <PrivateRoute role="admin" redirectTo="/imobiliaria/login">
            <AdminClientes />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin-imob/imoveis"
        element={
          <PrivateRoute role="admin" redirectTo="/imobiliaria/login">
            <AdminImoveis />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin-imob/processos"
        element={
          <PrivateRoute role="admin" redirectTo="/imobiliaria/login">
            <AdminProcessos />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin-imob/agenda"
        element={
          <PrivateRoute role="admin" redirectTo="/imobiliaria/login">
            <AdminAgenda />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin-imob/configuracoes"
        element={
          <PrivateRoute role="admin" redirectTo="/imobiliaria/login">
            <AdminConfiguracoes />
          </PrivateRoute>
        }
      />

      {/* ==================== ADMIN SYSTEM ROUTES ==================== */}

      {/* Rota secreta de admin - protegida por senha */}
      <Route path="/config-lia-admin" element={<AdminConfig />} />
      {/* Painel Admin completo - protegido por email autorizado */}
      <Route path="/admin-dashboard" element={<AdminDashboard />} />

      {/* ==================== CATCH-ALL ROUTE ==================== */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
