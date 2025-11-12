import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Plan {
  id: string;
  name: string;
  price: string;
  annualPrice?: string;
  description: string;
  color: string;
  popular: boolean;
  discount: number;
  maxChannels: string;
  maxConversations: string;
  maxMessages: string;
  features: string[];
  liaQuote?: string;
  period?: string;
  customCTA?: {
    text: string;
    action: string;
  };
}

export const usePlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    const { data, error } = await supabase
      .from('plan_configs')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data) {
      const formattedPlans: Plan[] = (data as any[]).map((plan: any) => ({
        id: plan.id,
        name: plan.plan_name,
        price: plan.price || '€0',
        annualPrice: plan.annual_price,
        description: plan.description || '',
        color: `from-[hsl(${plan.gradient_start || '0 0% 50%'})] to-[hsl(${plan.gradient_end || '0 0% 50%'})]`,
        popular: plan.is_popular || false,
        discount: plan.discount_percentage || 0,
        maxChannels: plan.max_channels || '0',
        maxConversations: plan.max_conversations || '0',
        maxMessages: plan.max_messages || '0',
        features: plan.features || [],
        liaQuote: plan.lia_quote,
        period: '/mês',
        customCTA: plan.custom_cta_text ? {
          text: plan.custom_cta_text,
          action: plan.custom_cta_action || '#'
        } : undefined,
      }));
      setPlans(formattedPlans);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPlans();

    // Realtime subscription para atualizações automáticas
    const channel = supabase
      .channel('plans_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'plan_configs'
      }, () => {
        fetchPlans();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { plans, loading };
};
