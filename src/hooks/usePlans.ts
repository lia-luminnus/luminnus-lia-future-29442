import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { plans as staticPlans, Plan } from '@/data/plansData';

/**
 * Hook customizado para carregar planos
 *
 * ESTRATÉGIA:
 * 1. Tentar carregar do Supabase (plan_configs)
 * 2. Se falhar ou estiver vazio, usar dados estáticos (plansData.ts)
 * 3. Merge dos dados: priorizar Supabase, mas manter estrutura do plansData
 *
 * IMPORTANTE: Isso garante sincronização automática entre Admin → Site
 */

interface PlanConfig {
  id?: string;
  plan_name: string;
  price?: string;
  annual_price?: string;
  description?: string;
  max_channels?: string;
  max_conversations?: string;
  max_messages?: string;
  features?: string[];
  is_popular?: boolean;
  gradient_start?: string;
  gradient_end?: string;
  discount?: number;
}

export function usePlans() {
  const [plans, setPlans] = useState<Plan[]>(staticPlans);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'static' | 'supabase'>('static');

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('[usePlans] Carregando planos do Supabase...');

      const { data, error: supabaseError } = await supabase
        .from('plan_configs')
        .select('*')
        .order('created_at', { ascending: true });

      if (supabaseError) {
        console.error('[usePlans] Erro ao carregar do Supabase:', supabaseError);
        throw supabaseError;
      }

      if (!data || data.length === 0) {
        console.warn('[usePlans] Nenhum plano encontrado no Supabase. Usando dados estáticos.');
        setPlans(staticPlans);
        setSource('static');
        return;
      }

      console.log(`[usePlans] ✅ ${data.length} planos carregados do Supabase`);

      // Mapear dados do Supabase para o formato esperado pelo componente
      const mergedPlans = data.map((config: PlanConfig) => {
        // Encontrar plano estático correspondente para pegar dados que não estão no DB
        const staticPlan = staticPlans.find(p => p.name === config.plan_name);

        // Merge: priorizar dados do Supabase, mas usar estáticos como fallback
        return {
          name: config.plan_name,
          price: config.price || staticPlan?.price || '€0',
          annualPrice: config.annual_price || staticPlan?.annualPrice || '€0',
          period: '/mês', // Sempre mensal
          description: config.description || staticPlan?.description || '',
          features: config.features || staticPlan?.features || [],
          color: staticPlan?.color || 'from-[#7C3AED] to-[#FF2E9E]', // Usar cor estática
          popular: config.is_popular ?? staticPlan?.popular ?? false,
          discount: config.discount ?? staticPlan?.discount ?? 0,
          liaQuote: staticPlan?.liaQuote || '', // Manter citação estática
          maxChannels: config.max_channels || staticPlan?.maxChannels || '0',
          maxConversations: config.max_conversations || staticPlan?.maxConversations || '0',
          maxMessages: config.max_messages || staticPlan?.maxMessages || '0',
          customCTA: staticPlan?.customCTA, // Manter CTA customizado
        } as Plan;
      });

      setPlans(mergedPlans);
      setSource('supabase');

      console.log('[usePlans] Planos mesclados com sucesso:', mergedPlans);

    } catch (err) {
      console.error('[usePlans] Erro ao carregar planos:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');

      // Fallback para dados estáticos
      console.log('[usePlans] 🔄 Usando dados estáticos como fallback');
      setPlans(staticPlans);
      setSource('static');

    } finally {
      setLoading(false);
    }
  };

  return {
    plans,
    loading,
    error,
    source, // Útil para debugging
    reload: loadPlans, // Permite recarregar manualmente
  };
}
