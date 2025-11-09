import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, Edit, Check, X, Plus, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { plans as initialPlans, Plan } from "@/data/plansData";
import { supabase } from "@/integrations/supabase/client";

// Lista completa de recursos disponíveis para todos os planos
const allAvailableFeatures = [
  "Integração com WhatsApp (1 número)",
  "WhatsApp Business (vários números)",
  "Chat online no site (widget simples)",
  "Chat integrado (com histórico)",
  "Integração com e-mail",
  "E-mail profissional",
  "Messenger (Facebook), Telegram, Instagram Direct",
  "Criação de 1 fluxo de automação",
  "10 fluxos de automação customizados",
  "Construtor visual de fluxos com IA",
  "Agendamento simples (Google Agenda)",
  "Agenda integrada (Google, Outlook)",
  "Google Sheets / Excel online",
  "Integração com CRM (HubSpot, RD Station, Pipedrive)",
  "Integração com ERP (SAP, Conta Azul, Bling)",
  "Sistemas financeiros e bancários",
  "Ferramentas internas da empresa",
  "Integração por API e Webhooks",
  "Gatilhos por palavras-chave",
  "Etiquetas automáticas",
  "Relatórios básicos de atendimento",
  "Relatórios detalhados",
  "Criação de relatórios financeiros inteligentes",
  "Acesso à LIA via painel (respostas simples)",
  "Assistente LIA com personalidade customizável",
  "Criação de múltiplas instâncias personalizadas da LIA",
  "Acesso ilimitado a canais e integrações",
  "Gestão de equipe com permissões",
  "Suporte por e-mail",
  "Suporte prioritário",
  "Suporte com gestor dedicado",
  "Suporte 24/7",
  "1 usuário",
  "Até 3 usuários",
  "10+ usuários",
  "Implantação assistida",
  "IA avançada",
  "IA personalizada",
];

export const AdminPlans = () => {
  const { toast } = useToast();
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [saving, setSaving] = useState(false);

  // Carregar configurações do Supabase (se existirem)
  useEffect(() => {
    loadPlansFromSupabase();
  }, []);

  const loadPlansFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from('plan_configs')
        .select('*');

      if (error) {
        console.log('Nenhuma configuração salva ainda, usando valores padrão');
        return;
      }

      if (data && data.length > 0) {
        // Mesclar dados do Supabase com dados locais
        const updatedPlans = plans.map(plan => {
          const savedPlan = data.find(d => d.plan_name === plan.name);
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

  const handleSave = async (planName: string) => {
    setSaving(true);
    const plan = plans.find(p => p.name === planName);

    if (!plan) return;

    try {
      // Salvar no Supabase
      const { error } = await supabase
        .from('plan_configs')
        .upsert({
          plan_name: plan.name,
          price: plan.price,
          description: plan.description,
          max_channels: plan.maxChannels,
          max_conversations: plan.maxConversations,
          max_messages: plan.maxMessages,
          features: plan.features,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'plan_name'
        });

      if (error) throw error;

      toast({
        title: "Plano atualizado com sucesso!",
        description: `As configurações do plano ${planName} foram salvas e refletirão na página pública.`,
        className: "bg-green-50 border-green-200",
      });

      setEditingPlan(null);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (planName: string) => {
    setEditingPlan(planName);
  };

  const updatePlanField = (planName: string, field: keyof Plan, value: any) => {
    setPlans((prev) =>
      prev.map((plan) => (plan.name === planName ? { ...plan, [field]: value } : plan))
    );
  };

  const toggleFeature = (planName: string, feature: string) => {
    setPlans((prev) =>
      prev.map((plan) => {
        if (plan.name === planName) {
          const features = plan.features.includes(feature)
            ? plan.features.filter(f => f !== feature)
            : [...plan.features, feature];
          return { ...plan, features };
        }
        return plan;
      })
    );
  };

  const addCustomFeature = (planName: string, feature: string) => {
    if (!feature.trim()) return;

    setPlans((prev) =>
      prev.map((plan) => {
        if (plan.name === planName && !plan.features.includes(feature)) {
          return { ...plan, features: [...plan.features, feature] };
        }
        return plan;
      })
    );
  };

  const removeFeature = (planName: string, feature: string) => {
    setPlans((prev) =>
      prev.map((plan) => {
        if (plan.name === planName) {
          return { ...plan, features: plan.features.filter(f => f !== feature) };
        }
        return plan;
      })
    );
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
      </div>

      {/* Plans Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const isEditing = editingPlan === plan.name;

          return (
            <Card key={plan.name} className="overflow-hidden hover:shadow-2xl transition-all duration-300">
              {/* Header colorido com gradiente do plano */}
              <div className={`bg-gradient-to-r ${plan.color} p-6 text-white relative overflow-hidden`}>
                {/* Efeito de brilho */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {isEditing ? (
                        <Input
                          value={plan.name}
                          onChange={(e) => updatePlanField(plan.name, "name", e.target.value)}
                          className="mb-2 bg-white/20 text-white placeholder:text-white/70 border-white/30 font-bold text-xl"
                          disabled
                        />
                      ) : (
                        <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                      )}
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
                      {isEditing ? (
                        <div className="flex-1">
                          <Label className="text-white/90 text-xs mb-1">Preço Mensal</Label>
                          <Input
                            value={plan.price}
                            onChange={(e) => updatePlanField(plan.name, "price", e.target.value)}
                            className="bg-white/20 text-white placeholder:text-white/70 border-white/30 text-2xl font-bold"
                          />
                        </div>
                      ) : (
                        <span className="text-4xl font-bold">{plan.price}</span>
                      )}
                      <span className="text-white/80 text-sm">{plan.period}</span>
                    </div>

                    {isEditing && (
                      <div>
                        <Label className="text-white/90 text-xs mb-1">Preço Anual</Label>
                        <Input
                          value={plan.annualPrice}
                          onChange={(e) => updatePlanField(plan.name, "annualPrice", e.target.value)}
                          className="bg-white/20 text-white placeholder:text-white/70 border-white/30"
                        />
                      </div>
                    )}

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
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Descrição
                  </Label>
                  {isEditing ? (
                    <Textarea
                      value={plan.description}
                      onChange={(e) => updatePlanField(plan.name, "description", e.target.value)}
                      rows={2}
                      className="resize-none text-sm"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  )}
                </div>

                {/* Limits */}
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Limites do Plano
                    </Label>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Canais</Label>
                        {isEditing ? (
                          <Input
                            value={plan.maxChannels}
                            onChange={(e) => updatePlanField(plan.name, "maxChannels", e.target.value)}
                            className="h-8 text-sm"
                          />
                        ) : (
                          <div className="text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            {plan.maxChannels}
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Conversas/mês</Label>
                        {isEditing ? (
                          <Input
                            value={plan.maxConversations}
                            onChange={(e) => updatePlanField(plan.name, "maxConversations", e.target.value)}
                            className="h-8 text-sm"
                          />
                        ) : (
                          <div className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {plan.maxConversations}
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Msgs/mês</Label>
                        {isEditing ? (
                          <Input
                            value={plan.maxMessages}
                            onChange={(e) => updatePlanField(plan.name, "maxMessages", e.target.value)}
                            className="h-8 text-sm"
                          />
                        ) : (
                          <div className="text-sm font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                            {plan.maxMessages}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Recursos Inclusos
                  </Label>

                  {isEditing ? (
                    <div className="space-y-3">
                      {/* Recursos selecionados */}
                      <div className="max-h-64 overflow-y-auto border rounded-lg p-3 space-y-2">
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-2 p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                            <span className="text-xs flex-1">{feature}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFeature(plan.name, feature)}
                              className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      {/* Adicionar recurso personalizado */}
                      <div className="flex gap-2">
                        <Input
                          id={`custom-feature-${plan.name}`}
                          placeholder="Digite um novo recurso..."
                          className="text-xs h-8"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              addCustomFeature(plan.name, e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const input = document.getElementById(`custom-feature-${plan.name}`) as HTMLInputElement;
                            if (input) {
                              addCustomFeature(plan.name, input.value);
                              input.value = '';
                            }
                          }}
                          className="h-8 px-2"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Lista de recursos disponíveis para adicionar */}
                      <details className="text-xs">
                        <summary className="cursor-pointer text-purple-600 hover:text-purple-700 font-medium">
                          Ver recursos disponíveis ({allAvailableFeatures.length})
                        </summary>
                        <div className="mt-2 max-h-48 overflow-y-auto border rounded p-2 space-y-1">
                          {allAvailableFeatures
                            .filter(f => !plan.features.includes(f))
                            .map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded">
                                <Checkbox
                                  id={`feature-${plan.name}-${idx}`}
                                  onCheckedChange={() => toggleFeature(plan.name, feature)}
                                />
                                <label
                                  htmlFor={`feature-${plan.name}-${idx}`}
                                  className="text-xs cursor-pointer flex-1"
                                >
                                  {feature}
                                </label>
                              </div>
                            ))}
                        </div>
                      </details>
                    </div>
                  ) : (
                    <ul className="space-y-2 max-h-64 overflow-y-auto">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                          <span className="text-gray-900">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-4 border-t">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSave(plan.name)}
                        size="sm"
                        disabled={saving}
                        className={`flex-1 bg-gradient-to-r ${plan.color} hover:opacity-90 transition-all shadow-lg`}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {saving ? 'Salvando...' : 'Salvar'}
                      </Button>
                      <Button
                        onClick={() => setEditingPlan(null)}
                        size="sm"
                        variant="outline"
                        disabled={saving}
                      >
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleEdit(plan.name)}
                      size="sm"
                      variant="outline"
                      className={`w-full border-2 hover:bg-gradient-to-r ${plan.color} hover:text-white hover:border-transparent transition-all`}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Editar Plano
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Global Settings */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
        <CardHeader>
          <CardTitle className="text-xl bg-gradient-to-r from-purple-600 to-purple-900 bg-clip-text text-transparent">
            Configurações Globais de Planos
          </CardTitle>
          <CardDescription>
            Defina configurações que afetam todos os planos do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="trial-days" className="text-sm font-semibold text-gray-900">
                Período de Teste (dias)
              </Label>
              <Input id="trial-days" type="number" defaultValue="7" className="h-9 text-gray-900" />
              <p className="text-xs text-muted-foreground">
                Tempo de teste gratuito para novos usuários
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grace-period" className="text-sm font-semibold text-gray-900">
                Período de Tolerância (dias)
              </Label>
              <Input id="grace-period" type="number" defaultValue="3" className="h-9 text-gray-900" />
              <p className="text-xs text-muted-foreground">
                Dias após vencimento antes de bloquear
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency" className="text-sm font-semibold text-gray-900">
                Moeda Padrão
              </Label>
              <Input id="currency" defaultValue="EUR" className="h-9 text-gray-900" />
              <p className="text-xs text-muted-foreground">
                Moeda exibida nos preços (EUR, USD, BRL)
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
