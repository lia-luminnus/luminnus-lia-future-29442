import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { plans as staticPlans } from '@/data/plansData';

/**
 * Interface do Plano (compatível com plan_configs do Supabase)
 */
export interface PlanFromDB {
  id: string;
  plan_name: string;
  price: string;
  annual_price?: string;
  description: string;
  max_channels: string;
  max_conversations: string;
  max_messages: string;
  features: string[];
  is_popular?: boolean;
  gradient_start?: string;
  gradient_end?: string;
  discount?: number;
  lia_quote?: string;
  custom_cta_text?: string;
  custom_cta_action?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Interface do Plano para uso no frontend
 */
export interface Plan {
  name: string;
  price: string;
  annualPrice: string;
  period: string;
  description: string;
  features: string[];
  color: string;
  popular: boolean;
  discount: number;
  liaQuote: string;
  maxChannels: string | number;
  maxConversations: string | number;
  maxMessages: string | number;
  customCTA?: {
    text: string;
    action: string;
  };
}

/**
 * Converte plano do formato do banco para o formato do frontend
 */
function convertPlanFromDB(dbPlan: PlanFromDB): Plan {
  const gradientStart = dbPlan.gradient_start || '262.1 83.3% 57.8%';
  const gradientEnd = dbPlan.gradient_end || '330.4 81.2% 60.4%';

  return {
    name: dbPlan.plan_name,
    price: dbPlan.price,
    annualPrice: dbPlan.annual_price || dbPlan.price,
    period: '/mês',
    description: dbPlan.description,
    features: dbPlan.features || [],
    color: `from-[hsl(${gradientStart})] to-[hsl(${gradientEnd})]`,
    popular: dbPlan.is_popular || false,
    discount: dbPlan.discount || 0,
    liaQuote: dbPlan.lia_quote || '',
    maxChannels: dbPlan.max_channels,
    maxConversations: dbPlan.max_conversations,
    maxMessages: dbPlan.max_messages,
    customCTA: dbPlan.custom_cta_text && dbPlan.custom_cta_action ? {
      text: dbPlan.custom_cta_text,
      action: dbPlan.custom_cta_action
    } : undefined
  };
}

/**
 * Hook para buscar planos do Supabase
 * Fallback para dados estáticos se não houver dados no banco
 */
export function usePlans() {
  const [plans, setPlans] = useState<Plan[]>(staticPlans);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar planos do Supabase
      const { data, error: fetchError } = await supabase
        .from('plan_configs')
        .select('*')
        .order('created_at', { ascending: true });

      if (fetchError) {
        console.error('Erro ao carregar planos do Supabase:', fetchError);
        // Usar dados estáticos como fallback
        setPlans(staticPlans);
        setError(fetchError);
        return;
      }

      if (data && data.length > 0) {
        // Converter planos do formato do banco para o formato do frontend
        const convertedPlans = data.map(convertPlanFromDB);
        setPlans(convertedPlans);
      } else {
        // Se não houver planos no banco, usar dados estáticos
        console.log('Nenhum plano encontrado no Supabase, usando dados estáticos');
        setPlans(staticPlans);
      }
    } catch (err) {
      console.error('Erro ao carregar planos:', err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      // Usar dados estáticos como fallback
      setPlans(staticPlans);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    loadPlans();
  };

  return {
    plans,
    loading,
    error,
    refetch
  };
}
