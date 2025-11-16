-- Migration: Adicionar campos adicionais à tabela plan_configs
-- Data: 2025-11-15
-- Descrição: Adiciona suporte a preços anuais, badges de popularidade, gradientes e descontos

-- Adicionar coluna annual_price (preço anual)
ALTER TABLE public.plan_configs
ADD COLUMN IF NOT EXISTS annual_price TEXT;

-- Adicionar coluna is_popular (badge "Mais Popular")
ALTER TABLE public.plan_configs
ADD COLUMN IF NOT EXISTS is_popular BOOLEAN DEFAULT false;

-- Adicionar coluna discount (percentual de desconto)
ALTER TABLE public.plan_configs
ADD COLUMN IF NOT EXISTS discount INTEGER DEFAULT 0;

-- Adicionar colunas de gradiente (para cores customizadas)
ALTER TABLE public.plan_configs
ADD COLUMN IF NOT EXISTS gradient_start TEXT;

ALTER TABLE public.plan_configs
ADD COLUMN IF NOT EXISTS gradient_end TEXT;

-- Comentários das colunas para documentação
COMMENT ON COLUMN public.plan_configs.annual_price IS 'Preço total anual do plano (ex: €291,60)';
COMMENT ON COLUMN public.plan_configs.is_popular IS 'Se true, exibe badge "Mais Popular" no card do plano';
COMMENT ON COLUMN public.plan_configs.discount IS 'Percentual de desconto para assinatura anual (0-100)';
COMMENT ON COLUMN public.plan_configs.gradient_start IS 'Cor HSL inicial do gradiente (ex: 262.1 83.3% 57.8%)';
COMMENT ON COLUMN public.plan_configs.gradient_end IS 'Cor HSL final do gradiente (ex: 330.4 81.2% 60.4%)';

-- Atualizar dados existentes com valores padrão (se houver)
UPDATE public.plan_configs
SET
  is_popular = CASE WHEN plan_name = 'Plus' THEN true ELSE false END,
  discount = CASE
    WHEN plan_name = 'Start' THEN 10
    WHEN plan_name IN ('Plus', 'Pro') THEN 20
    ELSE 0
  END
WHERE annual_price IS NULL;
