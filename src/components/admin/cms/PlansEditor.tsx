import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { EditPlanModal } from '../EditPlanModal';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Save, Sparkles } from 'lucide-react';

export const PlansEditor = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('plan_configs')
        .select('*')
        .order('created_at', { ascending: true });

      setPlans(data || []);
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plan: any) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleSave = async (updatedPlan: any) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
    );
    setIsModalOpen(false);
    setSelectedPlan(null);
    await loadPlans();
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Editor de Planos</CardTitle>
          <CardDescription>
            Edite os planos disponíveis: preços, limites e recursos
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-5"
              style={{
                background: `linear-gradient(135deg, hsl(${plan.gradient_start || '262.1 83.3% 57.8%'}), hsl(${plan.gradient_end || '330.4 81.2% 60.4%'}))`,
              }}
            />
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <CardTitle>{plan.plan_name}</CardTitle>
                {plan.is_popular && (
                  <Badge variant="secondary">Popular</Badge>
                )}
              </div>
              <CardDescription className="text-2xl font-bold">
                {plan.price}
              </CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                
                <div className="space-y-1 text-sm">
                  <p><strong>Canais:</strong> {plan.max_channels}</p>
                  <p><strong>Conversas:</strong> {plan.max_conversations}</p>
                  <p><strong>Mensagens:</strong> {plan.max_messages}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold">Recursos:</p>
                <div className="space-y-1">
                  {plan.features?.slice(0, 3).map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                  {plan.features?.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{plan.features.length - 3} recursos adicionais
                    </p>
                  )}
                </div>
              </div>

              <Button
                className="w-full"
                variant="outline"
                onClick={() => handleEdit(plan)}
              >
                ✏️ Editar Plano
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedPlan && (
        <EditPlanModal
          plan={selectedPlan}
          isOpen={isModalOpen}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}

      {/* Global Settings */}
      <Card id="global-settings" className="border-2 border-primary/20 scroll-mt-6">
        <CardHeader>
          <CardTitle className="text-xl">
            Configurações Globais de Planos
          </CardTitle>
          <CardDescription>
            Defina configurações que afetam todos os planos do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="trial-days" className="text-sm font-semibold">
                Período de Teste (dias)
              </Label>
              <Input id="trial-days" type="number" defaultValue="7" />
              <p className="text-xs text-muted-foreground">
                Tempo de teste gratuito para novos usuários
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grace-period" className="text-sm font-semibold">
                Período de Tolerância (dias)
              </Label>
              <Input id="grace-period" type="number" defaultValue="3" />
              <p className="text-xs text-muted-foreground">
                Dias após vencimento antes de bloquear
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency" className="text-sm font-semibold">
                Moeda Padrão
              </Label>
              <Input id="currency" defaultValue="EUR" />
              <p className="text-xs text-muted-foreground">
                Será exibida nos preços (EUR, USD, BRL)
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Salvar Configurações Globais
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">Sincronização Automática</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                As alterações feitas aqui serão refletidas automaticamente na página pública de planos (/planos).
                Os limites configurados serão aplicados aos usuários de cada plano em tempo real.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
