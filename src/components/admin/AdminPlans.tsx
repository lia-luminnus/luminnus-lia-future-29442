import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, Edit, Check, Sparkles, RefreshCw, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { plans as initialPlans, Plan } from "@/data/plansData";
import { supabase } from "@/integrations/supabase/client";
import { EditPlanModal } from "./EditPlanModal";
import { toast } from "sonner";

// Versão única para forçar rebuild: v2.0.0-2025-11-10
const COMPONENT_VERSION = "2.0.0-2025-11-10-" + Date.now();

export const AdminPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [refreshing, setRefreshing] = useState(false);

  // Carregar configurações do Supabase (se existirem)
  useEffect(() => {
    loadPlansFromSupabase();
  }, []);

  const loadPlansFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from('plan_configs' as any)
        .select('*');

      if (error) {
        console.log('Nenhuma configuração salva ainda, usando valores padrão');
        return;
      }

      if (data && data.length > 0) {
        // Mesclar dados do Supabase com dados locais
        const updatedPlans = plans.map(plan => {
          const savedPlan = (data as any[]).find(d => d.plan_name === plan.name);
          if (savedPlan) {
            return {
              ...plan,
              price: savedPlan.price || plan.price,
              description: savedPlan.description || plan.description,
              maxChannels: savedPlan.max_channels || plan.maxChannels,
              maxConversations: savedPlan.max_conversations || plan.maxConversations,
              maxMessages: savedPlan.max_messages || plan.maxMessages,
              features: savedPlan.features || plan.features,
            };
          }
          return plan;
        });
        setPlans(updatedPlans);
      }
    } catch (error) {
      console.error('Erro ao carregar planos:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadPlansFromSupabase();
      toast.success("Planos atualizados!", {
        description: "Os dados foram sincronizados com sucesso.",
        duration: 3000,
      });
    } catch (error) {
      toast.error("Erro ao atualizar", {
        description: "Não foi possível sincronizar os planos. Tente novamente.",
        duration: 4000,
      });
    } finally {
      setRefreshing(false);
    }
  };

  const scrollToSettings = () => {
    const settingsSection = document.getElementById('global-settings');
    if (settingsSection) {
      settingsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleEdit = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleSavePlan = (updatedPlan: Plan) => {
    setPlans((prev) =>
      prev.map((plan) => (plan.name === updatedPlan.name ? updatedPlan : plan))
    );
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-purple-900 bg-clip-text text-transparent flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-600" />
            Planos e Permissões
          </h2>
          <p className="text-muted-foreground mt-2">
            Configure limites, preços e recursos dos planos. As alterações serão refletidas automaticamente na página pública.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={scrollToSettings}
            variant="outline"
            className="flex items-center gap-2 border-purple-300 hover:bg-purple-50 hover:border-purple-400 transition-all"
          >
            <Settings className="w-4 h-4" />
            Configurações
          </Button>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:opacity-90 shadow-lg"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Atualizando...' : 'Atualizar Planos'}
          </Button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <Card key={`${plan.name}-${COMPONENT_VERSION}-${index}`} className="overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white">
            {/* Header colorido com gradiente do plano */}
            <div className={`bg-gradient-to-r ${plan.color} p-6 text-white relative overflow-hidden`}>
              {/* Efeito de brilho */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                  </div>
                  {plan.popular && (
                    <Badge className="bg-white/20 text-white border-white/30">
                      Mais Popular
                    </Badge>
                  )}
                </div>

                {/* Preço */}
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-white/80 text-sm">{plan.period}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <Badge className="bg-yellow-500/20 text-yellow-100 border-yellow-300/30">
                      -{plan.discount}% anual
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <CardContent className="space-y-6 p-6">
              {/* Description */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Descrição
                </Label>
                <p className="text-sm text-gray-800 font-medium">{plan.description}</p>
              </div>

              {/* Limits */}
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Limites do Plano
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-700 font-semibold">Canais</Label>
                      <div className="text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        {plan.maxChannels}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-gray-700 font-semibold">Conversas/mês</Label>
                      <div className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {plan.maxConversations}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-gray-700 font-semibold">Msgs/mês</Label>
                      <div className="text-sm font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        {plan.maxMessages}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Recursos Inclusos ({plan.features.length})
                </Label>
                <ul className="space-y-2 max-h-64 overflow-y-auto">
                  {plan.features.slice(0, 5).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                      <span className="text-gray-800 font-semibold">{feature}</span>
                    </li>
                  ))}
                  {plan.features.length > 5 && (
                    <li className="text-xs text-gray-700 font-medium italic">
                      + {plan.features.length - 5} recursos adicionais
                    </li>
                  )}
                </ul>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-300">
                <Button
                  onClick={() => handleEdit(plan)}
                  size="sm"
                  variant="outline"
                  className={`w-full border-2 border-gray-600 text-gray-900 font-bold hover:bg-gradient-to-r ${plan.color} hover:text-white hover:border-transparent transition-all shadow-md hover:shadow-lg`}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar Plano
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de Edição */}
      <EditPlanModal
        plan={selectedPlan}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSavePlan}
      />

      {/* Global Settings */}
      <Card id="global-settings" className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white scroll-mt-6">
        <CardHeader>
          <CardTitle className="text-xl bg-gradient-to-r from-purple-600 to-purple-900 bg-clip-text text-transparent">
            Configurações Globais de Planos
          </CardTitle>
          <CardDescription className="text-gray-700 font-medium">
            Defina configurações que afetam todos os planos do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="trial-days" className="text-sm font-semibold text-gray-900">
                Período de Teste (dias)
              </Label>
              <Input id="trial-days" type="number" defaultValue="7" className="h-9 bg-white text-gray-900 font-medium border-gray-300 focus:border-purple-500 focus:ring-purple-500" />
              <p className="text-xs text-gray-700 font-medium">
                Tempo de teste gratuito para novos usuários
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grace-period" className="text-sm font-semibold text-gray-900">
                Período de Tolerância (dias)
              </Label>
              <Input id="grace-period" type="number" defaultValue="3" className="h-9 bg-white text-gray-900 font-medium border-gray-300 focus:border-purple-500 focus:ring-purple-500" />
              <p className="text-xs text-gray-700 font-medium">
                Dias após vencimento antes de bloquear
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency" className="text-sm font-semibold text-gray-900">
                Moeda Padrão
              </Label>
              <Input id="currency" defaultValue="EUR" className="h-9 bg-white text-gray-900 font-medium border-gray-300 focus:border-purple-500 focus:ring-purple-500" />
              <p className="text-xs text-gray-700 font-medium">
                Será exibida nos preços (EUR, USD, BRL)
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:opacity-90 shadow-lg">
              <Save className="mr-2 h-4 w-4" />
              Salvar Configurações Globais
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <h4 className="font-semibold text-blue-900">Sincronização Automática</h4>
              <p className="text-sm text-blue-800">
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
