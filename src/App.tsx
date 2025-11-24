import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Plans from "./pages/Plans";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ClientArea from "./pages/ClientArea";
import MyAccount from "./pages/MyAccount";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import AdminConfig from "./pages/AdminConfig";
import AdminDashboard from "./pages/AdminDashboard";

// Imobiliaria Pages
import ImobiliariaHome from "./pages/imobiliaria/Home";
import ListaImoveis from "./pages/imobiliaria/ListaImoveis";
import DetalhesImovel from "./pages/imobiliaria/DetalhesImovel";
import Contato from "./pages/imobiliaria/Contato";

// Auth Pages (Imobiliaria)
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Cliente Pages (Imobiliaria)
import ClienteDashboard from "./pages/cliente/Dashboard";
import ClienteAgenda from "./pages/cliente/Agenda";
import ClienteStatus from "./pages/cliente/Status";
import ClienteImoveisSugeridos from "./pages/cliente/ImoveisSugeridos";
import ClienteMeusDados from "./pages/cliente/MeusDados";

// Admin Imobiliaria Pages
import AdminPainel from "./pages/admin/Painel";
import AdminClientes from "./pages/admin/Clientes";
import AdminImoveis from "./pages/admin/Imoveis";
import AdminProcessos from "./pages/admin/Processos";
import AdminAgenda from "./pages/admin/Agenda";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
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

                {/* Cliente (Imobiliaria) Routes */}
                <Route path="/cliente" element={<ClienteDashboard />} />
                <Route path="/cliente/agenda" element={<ClienteAgenda />} />
                <Route path="/cliente/status" element={<ClienteStatus />} />
                <Route path="/cliente/imoveis-sugeridos" element={<ClienteImoveisSugeridos />} />
                <Route path="/cliente/meus-dados" element={<ClienteMeusDados />} />

                {/* Admin Imobiliaria Routes */}
                <Route path="/admin-imob" element={<AdminPainel />} />
                <Route path="/admin-imob/clientes" element={<AdminClientes />} />
                <Route path="/admin-imob/imoveis" element={<AdminImoveis />} />
                <Route path="/admin-imob/processos" element={<AdminProcessos />} />
                <Route path="/admin-imob/agenda" element={<AdminAgenda />} />

                {/* Rota secreta de admin - protegida por senha */}
                <Route path="/config-lia-admin" element={<AdminConfig />} />
                {/* Painel Admin completo - protegido por email autorizado */}
                <Route path="/admin-dashboard" element={<AdminDashboard />} />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
