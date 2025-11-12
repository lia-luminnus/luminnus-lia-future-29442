-- Adicionar campos faltantes à tabela plan_configs
ALTER TABLE plan_configs 
ADD COLUMN IF NOT EXISTS annual_price text,
ADD COLUMN IF NOT EXISTS is_popular boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS gradient_start text,
ADD COLUMN IF NOT EXISTS gradient_end text,
ADD COLUMN IF NOT EXISTS custom_cta_text text,
ADD COLUMN IF NOT EXISTS custom_cta_action text,
ADD COLUMN IF NOT EXISTS lia_quote text,
ADD COLUMN IF NOT EXISTS discount_percentage integer DEFAULT 0;

-- Inserir plano Plus com dados completos
INSERT INTO plan_configs (
  plan_name, price, annual_price, description,
  max_channels, max_conversations, max_messages,
  is_popular, gradient_start, gradient_end,
  discount_percentage, lia_quote,
  features
) VALUES (
  'Plus',
  '€147',
  '€1411',
  'Para empresas em crescimento que precisam escalar',
  '5',
  '500',
  '5000',
  true,
  '262.1 83.3% 57.8%',
  '330.4 81.2% 60.4%',
  20,
  'O Plano Plus é ideal para empresas que estão crescendo e precisam de automação mais robusta. Com múltiplos canais e integrações avançadas, você pode gerenciar todo seu atendimento em um só lugar.',
  ARRAY[
    'WhatsApp Business (vários números)',
    'Chat integrado (com histórico)',
    'E-mail profissional',
    'Messenger (Facebook), Telegram, Instagram Direct',
    '10 fluxos de automação customizados',
    'Agenda integrada (Google, Outlook)',
    'Integração com CRM (HubSpot, RD Station, Pipedrive)',
    'Etiquetas automáticas',
    'Relatórios detalhados',
    'Assistente LIA com personalidade customizável',
    'Suporte prioritário',
    'Até 3 usuários',
    'IA avançada'
  ]
)
ON CONFLICT (plan_name) DO UPDATE SET
  annual_price = EXCLUDED.annual_price,
  is_popular = EXCLUDED.is_popular,
  gradient_start = EXCLUDED.gradient_start,
  gradient_end = EXCLUDED.gradient_end,
  discount_percentage = EXCLUDED.discount_percentage,
  lia_quote = EXCLUDED.lia_quote,
  features = EXCLUDED.features;

-- Inserir plano Pro com dados completos
INSERT INTO plan_configs (
  plan_name, price, annual_price, description,
  max_channels, max_conversations, max_messages,
  is_popular, gradient_start, gradient_end,
  discount_percentage, lia_quote,
  custom_cta_text, custom_cta_action,
  features
) VALUES (
  'Pro',
  'A partir de €997',
  'Consulte-nos',
  'Solução enterprise totalmente personalizada',
  'Ilimitado',
  'Ilimitado',
  'Ilimitado',
  false,
  '330.4 81.2% 60.4%',
  '24.6 95% 53.1%',
  10,
  'O Plano Pro é a escolha para empresas que querem uma solução sob medida. Com integrações customizadas, IA personalizada e suporte dedicado, construímos a LIA perfeita para seu negócio.',
  'Falar com Consultor',
  'https://wa.me/351920161066?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20o%20Plano%20Pro',
  ARRAY[
    'Acesso ilimitado a canais e integrações',
    'Construtor visual de fluxos com IA',
    'Integração com ERP (SAP, Conta Azul, Bling)',
    'Sistemas financeiros e bancários',
    'Ferramentas internas da empresa',
    'Integração por API e Webhooks',
    'Criação de relatórios financeiros inteligentes',
    'Criação de múltiplas instâncias personalizadas da LIA',
    'Gestão de equipe com permissões',
    'Suporte com gestor dedicado',
    '10+ usuários',
    'Implantação assistida',
    'IA personalizada'
  ]
)
ON CONFLICT (plan_name) DO UPDATE SET
  annual_price = EXCLUDED.annual_price,
  is_popular = EXCLUDED.is_popular,
  gradient_start = EXCLUDED.gradient_start,
  gradient_end = EXCLUDED.gradient_end,
  discount_percentage = EXCLUDED.discount_percentage,
  lia_quote = EXCLUDED.lia_quote,
  custom_cta_text = EXCLUDED.custom_cta_text,
  custom_cta_action = EXCLUDED.custom_cta_action,
  features = EXCLUDED.features;

-- Atualizar plano Start existente com os campos novos
UPDATE plan_configs 
SET 
  gradient_start = '217.2 91.2% 59.8%',
  gradient_end = '262.1 83.3% 57.8%',
  discount_percentage = 20,
  is_popular = false,
  annual_price = '€470',
  lia_quote = 'O Plano Start é perfeito para quem está começando a automatizar o atendimento. Você terá acesso aos principais canais de comunicação e poderá criar suas primeiras automações com a LIA.'
WHERE plan_name = 'Start' AND gradient_start IS NULL;