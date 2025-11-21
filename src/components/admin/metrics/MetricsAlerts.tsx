import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  Bell,
  BellOff,
  CheckCircle,
  Clock,
  Info,
  Settings,
  XCircle,
  Plus,
  Trash2,
  Brain,
  Mic,
  Server,
  Cloud,
  Database,
} from "lucide-react";
import {
  useMetricsAlerts,
  useMetricsAlertConfigs,
  useResolveAlert,
  useUpdateAlertConfig,
  useCreateAlertConfig,
  ProviderType,
} from "@/hooks/useMetrics";
import { useToast } from "@/hooks/use-toast";

// Severity badge component
const SeverityBadge = ({ severity }: { severity: string }) => {
  const config: Record<string, { color: string; icon: React.ReactNode }> = {
    info: { color: "bg-blue-500", icon: <Info className="w-3 h-3" /> },
    warning: { color: "bg-yellow-500", icon: <AlertTriangle className="w-3 h-3" /> },
    critical: { color: "bg-red-500", icon: <XCircle className="w-3 h-3" /> },
  };
  const cfg = config[severity] || config.warning;
  return (
    <Badge className={`${cfg.color} gap-1`}>
      {cfg.icon}
      {severity}
    </Badge>
  );
};

// Provider icon component
const ProviderIcon = ({ provider }: { provider: string }) => {
  const icons: Record<string, React.ReactNode> = {
    openai: <Brain className="w-4 h-4 text-green-600" />,
    cartesia: <Mic className="w-4 h-4 text-pink-600" />,
    render: <Server className="w-4 h-4 text-cyan-600" />,
    cloudflare: <Cloud className="w-4 h-4 text-orange-600" />,
    supabase: <Database className="w-4 h-4 text-emerald-600" />,
    system: <Settings className="w-4 h-4 text-gray-600" />,
  };
  return icons[provider] || icons.system;
};

// Alert type options
const ALERT_TYPES = [
  { value: "limite_token_diario", label: "Limite de Token Diario" },
  { value: "pico_custo", label: "Pico Anomalo de Custo" },
  { value: "falha_api", label: "Falhas de API" },
  { value: "uso_fora_horario", label: "Uso Fora do Horario Comercial" },
  { value: "limite_requests", label: "Limite de Requests" },
  { value: "cpu_alta", label: "CPU Alta" },
  { value: "memoria_alta", label: "Memoria Alta" },
  { value: "tempo_resposta", label: "Tempo de Resposta Alto" },
];

const PROVIDERS: { value: ProviderType | "system"; label: string }[] = [
  { value: "openai", label: "OpenAI" },
  { value: "cartesia", label: "Cartesia" },
  { value: "render", label: "Render" },
  { value: "cloudflare", label: "Cloudflare" },
  { value: "supabase", label: "Supabase" },
  { value: "system", label: "Sistema" },
];

export const MetricsAlerts = () => {
  const [showResolved, setShowResolved] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ProviderType | "system" | "all">("all");
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [newConfig, setNewConfig] = useState({
    provedor: "openai" as ProviderType | "system",
    tipo: "limite_token_diario",
    limite_valor: 0,
    ativo: true,
    notificar_email: false,
  });

  const { toast } = useToast();

  const { data: alerts, isLoading: loadingAlerts } = useMetricsAlerts(
    showResolved ? undefined : false,
    selectedProvider === "all" ? undefined : selectedProvider as ProviderType
  );
  const { data: configs, isLoading: loadingConfigs } = useMetricsAlertConfigs();
  const resolveAlert = useResolveAlert();
  const updateConfig = useUpdateAlertConfig();
  const createConfig = useCreateAlertConfig();

  const handleResolve = async (alertId: string) => {
    try {
      await resolveAlert.mutateAsync(alertId);
      toast({
        title: "Alerta resolvido",
        description: "O alerta foi marcado como resolvido.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Nao foi possivel resolver o alerta.",
        variant: "destructive",
      });
    }
  };

  const handleToggleConfig = async (configId: string, ativo: boolean) => {
    try {
      await updateConfig.mutateAsync({ id: configId, ativo });
      toast({
        title: ativo ? "Alerta ativado" : "Alerta desativado",
        description: `Configuracao de alerta ${ativo ? "ativada" : "desativada"}.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Nao foi possivel atualizar a configuracao.",
        variant: "destructive",
      });
    }
  };

  const handleCreateConfig = async () => {
    try {
      await createConfig.mutateAsync({
        provedor: newConfig.provedor,
        tipo: newConfig.tipo,
        limite_valor: newConfig.limite_valor,
        ativo: newConfig.ativo,
        notificar_email: newConfig.notificar_email,
        empresa_id: null,
      });
      toast({
        title: "Configuracao criada",
        description: "Nova configuracao de alerta criada com sucesso.",
      });
      setIsConfigDialogOpen(false);
      setNewConfig({
        provedor: "openai",
        tipo: "limite_token_diario",
        limite_valor: 0,
        ativo: true,
        notificar_email: false,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Nao foi possivel criar a configuracao.",
        variant: "destructive",
      });
    }
  };

  const unresolvedCount = alerts?.filter((a) => !a.resolvido).length || 0;
  const criticalCount = alerts?.filter((a) => !a.resolvido && a.severidade === "critical").length || 0;

  const isLoading = loadingAlerts || loadingConfigs;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-[100px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px]" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={unresolvedCount > 0 ? "bg-yellow-50 border-yellow-200" : "bg-green-50 border-green-200"}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Alertas Ativos</CardTitle>
            {unresolvedCount > 0 ? (
              <Bell className="w-4 h-4 text-yellow-600" />
            ) : (
              <BellOff className="w-4 h-4 text-green-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${unresolvedCount > 0 ? "text-yellow-700" : "text-green-700"}`}>
              {unresolvedCount}
            </div>
            <p className="text-xs text-gray-500 mt-1">Aguardando resolucao</p>
          </CardContent>
        </Card>

        <Card className={criticalCount > 0 ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Alertas Criticos</CardTitle>
            <XCircle className={`w-4 h-4 ${criticalCount > 0 ? "text-red-600" : "text-gray-400"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${criticalCount > 0 ? "text-red-700" : "text-gray-500"}`}>
              {criticalCount}
            </div>
            <p className="text-xs text-gray-500 mt-1">Requerem atencao imediata</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Configs Ativas</CardTitle>
            <Settings className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">
              {configs?.filter((c) => c.ativo).length || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Regras de monitoramento</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Central de Alertas</CardTitle>
              <CardDescription>Gerencie alertas e configuracoes de monitoramento</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Select
                value={selectedProvider}
                onValueChange={(value) => setSelectedProvider(value as ProviderType | "all")}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Provedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {PROVIDERS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Switch checked={showResolved} onCheckedChange={setShowResolved} />
                <span className="text-sm text-gray-600">Mostrar resolvidos</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Provedor</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Severidade</TableHead>
                <TableHead>Mensagem</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts?.map((alert) => (
                <TableRow key={alert.id} className={alert.resolvido ? "opacity-50" : ""}>
                  <TableCell className="font-mono text-xs">
                    {new Date(alert.created_at).toLocaleString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ProviderIcon provider={alert.provedor} />
                      <span className="capitalize">{alert.provedor}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{alert.tipo}</Badge>
                  </TableCell>
                  <TableCell>
                    <SeverityBadge severity={alert.severidade} />
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={alert.mensagem}>
                    {alert.mensagem}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {alert.valor_atual?.toFixed(2)}
                    {alert.valor_limite && (
                      <span className="text-gray-400"> / {alert.valor_limite}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {alert.resolvido ? (
                      <Badge className="bg-gray-500 gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Resolvido
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-500 gap-1">
                        <Clock className="w-3 h-3" />
                        Ativo
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {!alert.resolvido && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResolve(alert.id)}
                        disabled={resolveAlert.isPending}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Resolver
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {(!alerts || alerts.length === 0) && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    <BellOff className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    Nenhum alerta encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Alert Configurations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Configuracoes de Alertas</CardTitle>
              <CardDescription>Configure limites e regras de monitoramento</CardDescription>
            </div>
            <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Configuracao
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nova Configuracao de Alerta</DialogTitle>
                  <DialogDescription>
                    Configure uma nova regra de monitoramento para os provedores.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Provedor</label>
                    <Select
                      value={newConfig.provedor}
                      onValueChange={(value) =>
                        setNewConfig({ ...newConfig, provedor: value as ProviderType | "system" })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PROVIDERS.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo de Alerta</label>
                    <Select
                      value={newConfig.tipo}
                      onValueChange={(value) => setNewConfig({ ...newConfig, tipo: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ALERT_TYPES.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Valor Limite</label>
                    <Input
                      type="number"
                      value={newConfig.limite_valor}
                      onChange={(e) =>
                        setNewConfig({ ...newConfig, limite_valor: parseFloat(e.target.value) || 0 })
                      }
                      placeholder="Ex: 10000 (tokens), 1.00 (USD)"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={newConfig.ativo}
                        onCheckedChange={(checked) => setNewConfig({ ...newConfig, ativo: checked })}
                      />
                      <span className="text-sm">Ativo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={newConfig.notificar_email}
                        onCheckedChange={(checked) =>
                          setNewConfig({ ...newConfig, notificar_email: checked })
                        }
                      />
                      <span className="text-sm">Notificar por email</span>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={handleCreateConfig}
                    disabled={createConfig.isPending}
                  >
                    Criar Configuracao
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provedor</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Limite</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {configs?.map((config) => (
                <TableRow key={config.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ProviderIcon provider={config.provedor} />
                      <span className="capitalize">{config.provedor}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {ALERT_TYPES.find((t) => t.value === config.tipo)?.label || config.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">{config.limite_valor}</TableCell>
                  <TableCell>
                    {config.notificar_email ? (
                      <Badge className="bg-blue-500">Sim</Badge>
                    ) : (
                      <span className="text-gray-400">Nao</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={config.ativo}
                      onCheckedChange={(checked) => handleToggleConfig(config.id, checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {(!configs || configs.length === 0) && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    <Settings className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    Nenhuma configuracao de alerta cadastrada
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Alert Types Info */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-sm">Tipos de Alertas Disponiveis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-semibold text-yellow-600">Limite Token Diario:</span>
              <p className="text-gray-600 text-xs">Alerta quando tokens excedem limite diario</p>
            </div>
            <div>
              <span className="font-semibold text-red-600">Pico de Custo:</span>
              <p className="text-gray-600 text-xs">Detecta anomalias em custos</p>
            </div>
            <div>
              <span className="font-semibold text-orange-600">Falhas de API:</span>
              <p className="text-gray-600 text-xs">Monitora erros nas APIs</p>
            </div>
            <div>
              <span className="font-semibold text-purple-600">Uso Fora Horario:</span>
              <p className="text-gray-600 text-xs">Atividade fora do horario comercial</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsAlerts;
