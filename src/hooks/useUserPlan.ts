import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

/**
 * INTERFACE DO PLANO DO USUÁRIO
 * Define a estrutura dos dados de plano
 */
export interface UserPlan {
  id: string;
  user_id: string;
  plan_name: 'Start' | 'Plus' | 'Pro';
  status: 'ativo' | 'inativo' | 'cancelado';
  created_at: string;
  updated_at: string;
}

/**
 * HOOK PERSONALIZADO: useUserPlan
 *
 * Verifica se o usuário possui um plano ativo no Supabase
 *
 * @returns {Object} Objeto contendo:
 *   - userPlan: Dados do plano do usuário (ou null se não tiver)
 *   - hasActivePlan: Boolean indicando se o usuário tem plano ativo
 *   - loading: Boolean indicando se está carregando os dados
 *   - refetch: Função para recarregar os dados do plano
 *
 * @example
 * const { userPlan, hasActivePlan, loading } = useUserPlan();
 *
 * if (loading) return <div>Carregando...</div>;
 * if (hasActivePlan) {
 *   console.log('Plano:', userPlan.plan_name);
 * }
 */
export const useUserPlan = () => {
  const { user } = useAuth();
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * FUNÇÃO PARA BUSCAR PLANO DO USUÁRIO
   * Consulta a tabela user_plans no Supabase
   */
  const fetchUserPlan = async () => {
    if (!user) {
      setUserPlan(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Busca o plano do usuário na tabela user_plans
      const { data, error } = await supabase
        .from('user_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'ativo')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar plano do usuário:', error);
        setUserPlan(null);
      } else {
        setUserPlan(data);
      }
    } catch (error) {
      console.error('Erro ao buscar plano do usuário:', error);
      setUserPlan(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * EFEITO: BUSCAR PLANO QUANDO O USUÁRIO MUDAR
   * Recarrega os dados do plano sempre que o usuário autenticado mudar
   */
  useEffect(() => {
    fetchUserPlan();
  }, [user]);

  /**
   * COMPUTED: hasActivePlan
   * Verifica se o usuário tem um plano com status 'ativo'
   */
  const hasActivePlan = userPlan !== null && userPlan.status === 'ativo';

  return {
    userPlan,
    hasActivePlan,
    loading,
    refetch: fetchUserPlan,
  };
};
