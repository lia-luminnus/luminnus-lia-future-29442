-- Migration: Create Metrics Tables for Provider Monitoring
-- Description: Creates 7 tables for tracking metrics from OpenAI, Cartesia, Render, Cloudflare, Supabase, alerts, and daily summaries

-- ============================================
-- Table: metrics_openai
-- Tracks OpenAI GPT-4o-mini API usage and costs
-- ============================================
CREATE TABLE IF NOT EXISTS public.metrics_openai (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    usuario_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    detalhes JSONB,
    custo DECIMAL(12, 6) NOT NULL DEFAULT 0,
    input_tokens INTEGER NOT NULL DEFAULT 0,
    output_tokens INTEGER NOT NULL DEFAULT 0,
    modelo VARCHAR(100) NOT NULL DEFAULT 'gpt-4o-mini',
    origem VARCHAR(100),
    erro TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for metrics_openai
CREATE INDEX IF NOT EXISTS idx_metrics_openai_empresa ON public.metrics_openai(empresa_id);
CREATE INDEX IF NOT EXISTS idx_metrics_openai_timestamp ON public.metrics_openai(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_metrics_openai_created ON public.metrics_openai(created_at DESC);

-- ============================================
-- Table: metrics_cartesia
-- Tracks Cartesia TTS usage (850 chars = 1 min audio)
-- ============================================
CREATE TABLE IF NOT EXISTS public.metrics_cartesia (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    usuario_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    detalhes JSONB,
    custo DECIMAL(12, 6) NOT NULL DEFAULT 0,
    caracteres INTEGER NOT NULL DEFAULT 0,
    duracao_segundos DECIMAL(10, 2) NOT NULL DEFAULT 0,
    voz_id VARCHAR(100),
    origem VARCHAR(100),
    erro TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for metrics_cartesia
CREATE INDEX IF NOT EXISTS idx_metrics_cartesia_empresa ON public.metrics_cartesia(empresa_id);
CREATE INDEX IF NOT EXISTS idx_metrics_cartesia_timestamp ON public.metrics_cartesia(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_metrics_cartesia_created ON public.metrics_cartesia(created_at DESC);

-- ============================================
-- Table: metrics_render
-- Tracks Render.com infrastructure status
-- ============================================
CREATE TABLE IF NOT EXISTS public.metrics_render (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    detalhes JSONB,
    servico VARCHAR(100) NOT NULL DEFAULT 'main',
    status VARCHAR(50) NOT NULL DEFAULT 'unknown',
    cpu_percent DECIMAL(5, 2),
    memoria_percent DECIMAL(5, 2),
    memoria_mb INTEGER,
    uptime_seconds BIGINT,
    requests_count INTEGER,
    erro TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for metrics_render
CREATE INDEX IF NOT EXISTS idx_metrics_render_empresa ON public.metrics_render(empresa_id);
CREATE INDEX IF NOT EXISTS idx_metrics_render_timestamp ON public.metrics_render(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_metrics_render_servico ON public.metrics_render(servico);
CREATE INDEX IF NOT EXISTS idx_metrics_render_status ON public.metrics_render(status);

-- ============================================
-- Table: metrics_cloudflare
-- Tracks Cloudflare Workers usage (US$ 0.50 / 1M requests)
-- ============================================
CREATE TABLE IF NOT EXISTS public.metrics_cloudflare (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    detalhes JSONB,
    custo DECIMAL(12, 6) NOT NULL DEFAULT 0,
    requests_count INTEGER NOT NULL DEFAULT 0,
    worker_name VARCHAR(100),
    cpu_time_ms INTEGER,
    bandwidth_bytes BIGINT,
    erros_count INTEGER DEFAULT 0,
    origem VARCHAR(100),
    erro TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for metrics_cloudflare
CREATE INDEX IF NOT EXISTS idx_metrics_cloudflare_empresa ON public.metrics_cloudflare(empresa_id);
CREATE INDEX IF NOT EXISTS idx_metrics_cloudflare_timestamp ON public.metrics_cloudflare(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_metrics_cloudflare_worker ON public.metrics_cloudflare(worker_name);

-- ============================================
-- Table: metrics_supabase
-- Tracks Supabase usage (reads, writes, storage, realtime)
-- ============================================
CREATE TABLE IF NOT EXISTS public.metrics_supabase (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    detalhes JSONB,
    leituras INTEGER NOT NULL DEFAULT 0,
    escritas INTEGER NOT NULL DEFAULT 0,
    storage_bytes BIGINT,
    realtime_connections INTEGER,
    bandwidth_bytes BIGINT,
    origem VARCHAR(100),
    erro TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for metrics_supabase
CREATE INDEX IF NOT EXISTS idx_metrics_supabase_empresa ON public.metrics_supabase(empresa_id);
CREATE INDEX IF NOT EXISTS idx_metrics_supabase_timestamp ON public.metrics_supabase(timestamp DESC);

-- ============================================
-- Table: metrics_alerts
-- Configurable alerts system
-- ============================================
CREATE TABLE IF NOT EXISTS public.metrics_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    tipo VARCHAR(100) NOT NULL,
    severidade VARCHAR(20) NOT NULL DEFAULT 'warning' CHECK (severidade IN ('info', 'warning', 'critical')),
    mensagem TEXT NOT NULL,
    provedor VARCHAR(50) NOT NULL CHECK (provedor IN ('openai', 'cartesia', 'render', 'cloudflare', 'supabase', 'system')),
    valor_atual DECIMAL(15, 4),
    valor_limite DECIMAL(15, 4),
    resolvido BOOLEAN NOT NULL DEFAULT FALSE,
    resolvido_em TIMESTAMPTZ,
    detalhes JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for metrics_alerts
CREATE INDEX IF NOT EXISTS idx_metrics_alerts_empresa ON public.metrics_alerts(empresa_id);
CREATE INDEX IF NOT EXISTS idx_metrics_alerts_provedor ON public.metrics_alerts(provedor);
CREATE INDEX IF NOT EXISTS idx_metrics_alerts_resolvido ON public.metrics_alerts(resolvido);
CREATE INDEX IF NOT EXISTS idx_metrics_alerts_severidade ON public.metrics_alerts(severidade);
CREATE INDEX IF NOT EXISTS idx_metrics_alerts_created ON public.metrics_alerts(created_at DESC);

-- ============================================
-- Table: metrics_daily_summary
-- Daily aggregated metrics per provider
-- ============================================
CREATE TABLE IF NOT EXISTS public.metrics_daily_summary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    data DATE NOT NULL,
    provedor VARCHAR(50) NOT NULL CHECK (provedor IN ('openai', 'cartesia', 'render', 'cloudflare', 'supabase')),
    total_requests INTEGER NOT NULL DEFAULT 0,
    total_custo DECIMAL(12, 4) NOT NULL DEFAULT 0,
    total_erros INTEGER NOT NULL DEFAULT 0,
    detalhes JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(empresa_id, data, provedor)
);

-- Indexes for metrics_daily_summary
CREATE INDEX IF NOT EXISTS idx_metrics_daily_summary_empresa ON public.metrics_daily_summary(empresa_id);
CREATE INDEX IF NOT EXISTS idx_metrics_daily_summary_data ON public.metrics_daily_summary(data DESC);
CREATE INDEX IF NOT EXISTS idx_metrics_daily_summary_provedor ON public.metrics_daily_summary(provedor);

-- ============================================
-- Table: metrics_alert_configs
-- Configuration for alert thresholds
-- ============================================
CREATE TABLE IF NOT EXISTS public.metrics_alert_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    provedor VARCHAR(50) NOT NULL CHECK (provedor IN ('openai', 'cartesia', 'render', 'cloudflare', 'supabase', 'system')),
    tipo VARCHAR(100) NOT NULL,
    limite_valor DECIMAL(15, 4) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    notificar_email BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(empresa_id, provedor, tipo)
);

-- Indexes for metrics_alert_configs
CREATE INDEX IF NOT EXISTS idx_metrics_alert_configs_empresa ON public.metrics_alert_configs(empresa_id);
CREATE INDEX IF NOT EXISTS idx_metrics_alert_configs_provedor ON public.metrics_alert_configs(provedor);

-- ============================================
-- RLS Policies
-- ============================================

-- Enable RLS on all metrics tables
ALTER TABLE public.metrics_openai ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics_cartesia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics_render ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics_cloudflare ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics_supabase ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics_daily_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics_alert_configs ENABLE ROW LEVEL SECURITY;

-- Admin can read all metrics (using service role or specific admin check)
-- For now, allow authenticated users to read all metrics for admin dashboard

CREATE POLICY "Allow authenticated read on metrics_openai"
    ON public.metrics_openai FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated read on metrics_cartesia"
    ON public.metrics_cartesia FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated read on metrics_render"
    ON public.metrics_render FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated read on metrics_cloudflare"
    ON public.metrics_cloudflare FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated read on metrics_supabase"
    ON public.metrics_supabase FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated read on metrics_alerts"
    ON public.metrics_alerts FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated read on metrics_daily_summary"
    ON public.metrics_daily_summary FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated read on metrics_alert_configs"
    ON public.metrics_alert_configs FOR SELECT
    TO authenticated
    USING (true);

-- Allow service role to insert/update metrics (for backend workers)
CREATE POLICY "Allow service insert on metrics_openai"
    ON public.metrics_openai FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow service insert on metrics_cartesia"
    ON public.metrics_cartesia FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow service insert on metrics_render"
    ON public.metrics_render FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow service insert on metrics_cloudflare"
    ON public.metrics_cloudflare FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow service insert on metrics_supabase"
    ON public.metrics_supabase FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow service insert on metrics_alerts"
    ON public.metrics_alerts FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow service upsert on metrics_daily_summary"
    ON public.metrics_daily_summary FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow service update on metrics_daily_summary"
    ON public.metrics_daily_summary FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Allow service insert on metrics_alert_configs"
    ON public.metrics_alert_configs FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow service update on metrics_alert_configs"
    ON public.metrics_alert_configs FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Allow service update on metrics_alerts"
    ON public.metrics_alerts FOR UPDATE
    TO authenticated
    USING (true);

-- ============================================
-- Helper Functions
-- ============================================

-- Function to calculate OpenAI cost based on tokens
-- GPT-4o-mini: $0.15/1M input, $0.60/1M output
CREATE OR REPLACE FUNCTION calculate_openai_cost(input_tokens INTEGER, output_tokens INTEGER)
RETURNS DECIMAL(12, 6) AS $$
BEGIN
    RETURN (input_tokens * 0.00000015) + (output_tokens * 0.0000006);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to calculate Cartesia cost based on characters
-- 850 characters = 1 minute of audio
CREATE OR REPLACE FUNCTION calculate_cartesia_duration(caracteres INTEGER)
RETURNS DECIMAL(10, 2) AS $$
BEGIN
    RETURN (caracteres::DECIMAL / 850) * 60; -- Returns duration in seconds
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to calculate Cloudflare cost
-- $0.50 per 1M requests
CREATE OR REPLACE FUNCTION calculate_cloudflare_cost(requests INTEGER)
RETURNS DECIMAL(12, 6) AS $$
BEGIN
    RETURN requests * 0.0000005;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to upsert daily summary
CREATE OR REPLACE FUNCTION upsert_daily_summary(
    p_empresa_id UUID,
    p_provedor VARCHAR(50),
    p_requests INTEGER DEFAULT 0,
    p_custo DECIMAL DEFAULT 0,
    p_erros INTEGER DEFAULT 0,
    p_detalhes JSONB DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    INSERT INTO public.metrics_daily_summary (empresa_id, data, provedor, total_requests, total_custo, total_erros, detalhes)
    VALUES (p_empresa_id, CURRENT_DATE, p_provedor, p_requests, p_custo, p_erros, p_detalhes)
    ON CONFLICT (empresa_id, data, provedor)
    DO UPDATE SET
        total_requests = metrics_daily_summary.total_requests + EXCLUDED.total_requests,
        total_custo = metrics_daily_summary.total_custo + EXCLUDED.total_custo,
        total_erros = metrics_daily_summary.total_erros + EXCLUDED.total_erros,
        detalhes = COALESCE(EXCLUDED.detalhes, metrics_daily_summary.detalhes);
END;
$$ LANGUAGE plpgsql;

-- Comment on tables
COMMENT ON TABLE public.metrics_openai IS 'Tracks OpenAI API usage and costs (GPT-4o-mini)';
COMMENT ON TABLE public.metrics_cartesia IS 'Tracks Cartesia TTS usage and costs';
COMMENT ON TABLE public.metrics_render IS 'Tracks Render.com infrastructure status';
COMMENT ON TABLE public.metrics_cloudflare IS 'Tracks Cloudflare Workers usage and costs';
COMMENT ON TABLE public.metrics_supabase IS 'Tracks Supabase database usage';
COMMENT ON TABLE public.metrics_alerts IS 'System alerts for anomalies and limits';
COMMENT ON TABLE public.metrics_daily_summary IS 'Daily aggregated metrics per provider';
COMMENT ON TABLE public.metrics_alert_configs IS 'Configuration for alert thresholds';
