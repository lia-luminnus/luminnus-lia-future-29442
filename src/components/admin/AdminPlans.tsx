import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Save, Edit, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { plansData } from "@/data/plansData";

interface PlanConfig {
  id: string;
  name: string;
  price: string;
  description: string;
  maxChannels: string;
  maxConversations: string;
  maxMessages: string;
  features: string[];
}

export const AdminPlans = () => {
  const { toast } = useToast();
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [plans, setPlans] = useState<PlanConfig[]>([
    {
      id: "start",
      name: "Start",
      price: "27",
      description: "Perfeito para começar com automação",
      maxChannels: "1",
      maxConversations: "10",
      maxMessages: "100",
      features: [
        "1 canal de atendimento",
        "10 conversas por mês",
        "100 mensagens por mês",
        "Suporte por e-mail",
        "Automações básicas",
      ],
    },
    {
      id: "plus",
      name: "Plus",
      price: "147",
      description: "Para empresas em crescimento",
      maxChannels: "3",
      maxConversations: "100",
      maxMessages: "1000",
      features: [
        "3 canais de atendimento",
        "100 conversas por mês",
        "1000 mensagens por mês",
        "Suporte prioritário",
        "Integrações ilimitadas",
        "IA avançada",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: "997",
      description: "Solução completa para empresas",
      maxChannels: "Ilimitado",
      maxConversations: "Ilimitado",
      maxMessages: "Ilimitado",
      features: [
        "Canais ilimitados",
        "Conversas ilimitadas",
        "Mensagens ilimitadas",
        "Suporte 24/7",
        "IA personalizada",
        "WhatsApp Business API",
        "Relatórios avançados",
      ],
    },
  ]);

  const handleSave = (planId: string) => {
    toast({
      title: "Plano atualizado",
      description: `As configurações do plano ${planId.toUpperCase()} foram salvas.`,
    });
    setEditingPlan(null);

    // Aqui você salvaria no Supabase
    // await supabase.from('plan_configs').upsert({ ... });
  };

  const handleEdit = (planId: string) => {
    setEditingPlan(planId);
  };

  const updatePlanField = (planId: string, field: keyof PlanConfig, value: string) => {
    setPlans((prev) =>
      prev.map((plan) => (plan.id === planId ? { ...plan, [field]: value } : plan))
    );
  };

  const getPlanColor = (planId: string) => {
    const colors: Record<string, string> = {
      start: "from-blue-500 to-blue-600",
      plus: "from-purple-500 to-purple-600",
      pro: "from-amber-500 to-amber-600",
    };
    return colors[planId] || "from-gray-500 to-gray-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-purple-900">
          Planos e Permissões
        </h2>
        <p className="text-muted-foreground">
          Configure limites, preços e descrições dos planos
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const isEditing = editingPlan === plan.id;

          return (
            <Card key={plan.id} className="overflow-hidden">
              {/* Header colorido */}
              <div className={`bg-gradient-to-r ${getPlanColor(plan.id)} p-6 text-white`}>
                <div className="flex items-start justify-between">
                  <div>
                    {isEditing ? (
                      <Input
                        value={plan.name}
                        onChange={(e) => updatePlanField(plan.id, "name", e.target.value)}
                        className="mb-2 bg-white/20 text-white placeholder:text-white/70"
                      />
                    ) : (
                      <h3 className="text-2xl font-bold">{plan.name}</h3>
                    )}
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-bold">
                        {isEditing ? (
                          <Input
                            value={plan.price}
                            onChange={(e) => updatePlanField(plan.id, "price", e.target.value)}
                            className="w-24 bg-white/20 text-white"
                            type="number"
                          />
                        ) : (
                          `€${plan.price}`
                        )}
                      </span>
                      <span className="text-white/80">/mês</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {plan.id.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Body */}
              <CardContent className="space-y-4 p-6">
                {/* Description */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground">
                    DESCRIÇÃO
                  </Label>
                  {isEditing ? (
                    <Textarea
                      value={plan.description}
                      onChange={(e) => updatePlanField(plan.id, "description", e.target.value)}
                      rows={2}
                      className="resize-none text-sm"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  )}
                </div>

                {/* Limits */}
                <div className="grid gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Canais</Label>
                    {isEditing ? (
                      <Input
                        value={plan.maxChannels}
                        onChange={(e) => updatePlanField(plan.id, "maxChannels", e.target.value)}
                        className="h-8"
                      />
                    ) : (
                      <div className="text-sm font-semibold">{plan.maxChannels}</div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Conversas/mês</Label>
                    {isEditing ? (
                      <Input
                        value={plan.maxConversations}
                        onChange={(e) =>
                          updatePlanField(plan.id, "maxConversations", e.target.value)
                        }
                        className="h-8"
                      />
                    ) : (
                      <div className="text-sm font-semibold">{plan.maxConversations}</div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Mensagens/mês</Label>
                    {isEditing ? (
                      <Input
                        value={plan.maxMessages}
                        onChange={(e) => updatePlanField(plan.id, "maxMessages", e.target.value)}
                        className="h-8"
                      />
                    ) : (
                      <div className="text-sm font-semibold">{plan.maxMessages}</div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground">
                    RECURSOS
                  </Label>
                  <ul className="space-y-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="pt-4">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSave(plan.id)}
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Salvar
                      </Button>
                      <Button
                        onClick={() => setEditingPlan(null)}
                        size="sm"
                        variant="outline"
                      >
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleEdit(plan.id)}
                      size="sm"
                      variant="outline"
                      className="w-full"
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
      <Card>
        <CardHeader>
          <CardTitle>Configurações Globais</CardTitle>
          <CardDescription>
            Defina configurações que afetam todos os planos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="trial-days">Período de Teste (dias)</Label>
              <Input id="trial-days" type="number" defaultValue="7" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="grace-period">Período de Tolerância (dias)</Label>
              <Input id="grace-period" type="number" defaultValue="3" />
            </div>
          </div>

          <div className="flex justify-end">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Save className="mr-2 h-4 w-4" />
              Salvar Configurações Globais
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
