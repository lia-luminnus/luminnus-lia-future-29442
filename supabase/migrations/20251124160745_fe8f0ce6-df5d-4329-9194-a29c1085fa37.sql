-- ========================================
-- PARTE 1: SISTEMA DE ROLES SEGURO
-- ========================================

-- Criar enum para roles
CREATE TYPE public.app_role AS ENUM ('admin', 'cliente');

-- Criar tabela de roles separada (segurança)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Função segura para verificar roles (previne recursão)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Políticas RLS para user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ========================================
-- PARTE 2: TABELAS DO SISTEMA IMOBILIÁRIO
-- ========================================

-- Tabela de clientes
CREATE TABLE public.clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telefone TEXT,
  endereco TEXT,
  status_processo TEXT DEFAULT 'inicial',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.clientes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.clientes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all clients" ON public.clientes
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all clients" ON public.clientes
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Tabela de imóveis
CREATE TABLE public.imoveis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  localizacao TEXT NOT NULL,
  tipologia TEXT,
  preco DECIMAL(12,2) NOT NULL,
  area DECIMAL(10,2),
  banheiros INTEGER,
  quartos INTEGER,
  fotos TEXT[],
  disponivel BOOLEAN DEFAULT true,
  descricao TEXT,
  caracteristicas TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.imoveis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view available properties" ON public.imoveis
  FOR SELECT USING (disponivel = true);

CREATE POLICY "Admins can manage properties" ON public.imoveis
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Tabela de processos
CREATE TABLE public.processos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE NOT NULL,
  etapa_atual INTEGER DEFAULT 1,
  observacoes TEXT,
  status TEXT DEFAULT 'em_andamento',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.processos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own process" ON public.processos
  FOR SELECT USING (
    cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can manage all processes" ON public.processos
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_processos_updated_at
  BEFORE UPDATE ON public.processos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Tabela de agenda
CREATE TABLE public.agenda (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE NOT NULL,
  data DATE NOT NULL,
  hora TIME NOT NULL,
  tipo TEXT NOT NULL,
  descricao TEXT,
  status TEXT DEFAULT 'agendado',
  imovel_id UUID REFERENCES public.imoveis(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.agenda ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own agenda" ON public.agenda
  FOR SELECT USING (
    cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can manage all agenda" ON public.agenda
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Tabela de imóveis sugeridos
CREATE TABLE public.imoveis_sugeridos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE NOT NULL,
  imovel_id UUID REFERENCES public.imoveis(id) ON DELETE CASCADE NOT NULL,
  nota_lia TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cliente_id, imovel_id)
);

ALTER TABLE public.imoveis_sugeridos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own suggestions" ON public.imoveis_sugeridos
  FOR SELECT USING (
    cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can manage suggestions" ON public.imoveis_sugeridos
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Tabela de notificações
CREATE TABLE public.notificacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  lida BOOLEAN DEFAULT false,
  origem TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notificacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON public.notificacoes
  FOR SELECT USING (
    cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own notifications" ON public.notificacoes
  FOR UPDATE USING (
    cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid())
  );

-- ========================================
-- PARTE 3: TABELAS DO ADMIN DASHBOARD
-- ========================================

-- Tabela de empresas
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  cnpj TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  phone TEXT,
  plan TEXT DEFAULT 'Start',
  status TEXT DEFAULT 'active',
  users_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage companies" ON public.companies
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Tabela de erros do sistema
CREATE TABLE public.system_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  severity TEXT NOT NULL,
  message TEXT NOT NULL,
  component TEXT,
  stack_trace TEXT,
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.system_errors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage errors" ON public.system_errors
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Tabela de logs do sistema
CREATE TABLE public.system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  level TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage logs" ON public.system_logs
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ========================================
-- PARTE 4: ATUALIZAR LIA CONFIGURATIONS
-- ========================================

ALTER TABLE public.lia_configurations 
  ADD COLUMN IF NOT EXISTS openai_model TEXT DEFAULT 'gpt-4o-mini',
  ADD COLUMN IF NOT EXISTS temperature DECIMAL(3,2) DEFAULT 0.7,
  ADD COLUMN IF NOT EXISTS max_tokens INTEGER DEFAULT 1000;