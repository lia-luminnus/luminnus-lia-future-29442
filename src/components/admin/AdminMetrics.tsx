import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart3,
  Brain,
  Mic,
  Server,
  Cloud,
  Database,
  Bell,
  RefreshCw,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import {
  MetricsOpenAI,
  MetricsCartesia,
  MetricsRender,
  MetricsCloudflare,
  MetricsSupabase,
  MetricsAlerts,
} from "./metrics";
import {
  useMetricsDashboard,
  useProviderStatus,
  formatCurrency,
  formatNumber,
} from "@/hooks/useMetrics";

/**
 * COMPONENTE: AdminMetrics
 *
 * Painel completo para visualizacao de metricas e analytics
 * - Monitoramento de provedores: OpenAI, Cartesia, Render, Cloudflare, Supabase
 * - Graficos, tabelas e indicadores
 * - Sistema de alertas configuraveis
 * - Consumo diario, projecao mensal e custos
 */

// Provider status indicator
const StatusIndicator = ({ status }: { status: string }) => {
  const statusConfig: Record<string, { color: string; label: string }> = {
    operational: { color: "bg-green-500", label: "Operacional" },
    running: { color: "bg-green-500", label: "Executando" },
    healthy: { color: "bg-green-500", label: "Saudavel" },
    degraded: { color: "bg-yellow-500", label: "Degradado" },
    down: { color: "bg-red-500", label: "Fora" },
    unknown: { color: "bg-gray-400", label: "Desconhecido" },
  };
  const config = statusConfig[status.toLowerCase()] || statusConfig.unknown;
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${config.color} animate-pulse`} />
      <span className="text-xs text-gray-600">{config.label}</span>
    </div>
  );
};

const AdminMetrics = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const dashboard = useMetricsDashboard(30);
  const { data: providerStatus, refetch: refetchStatus } = useProviderStatus();

  const handleRefresh = () => {
    dashboard.refetch();
    refetchStatus();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-900 bg-clip-text text-transparent mb-2 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-purple-600" />
            Metricas e Analytics
          </h1>
          <p className="text-gray-600">
            Monitoramento completo dos provedores e custos da plataforma
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </Button>
          {dashboard.totals.unresolvedAlerts > 0 && (
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="w-3 h-3" />
              {dashboard.totals.unresolvedAlerts} alertas
            </Badge>
          )}
        </div>
      </div>

      {/* Global Summary Panel */}
      <Card className="bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 border-purple-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* Daily Cost */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-xs text-gray-600">Custo Hoje</span>
              </div>
              <p className="text-xl font-bold text-green-700">
                {dashboard.isLoading ? (
                  <Skeleton className="h-6 w-20 mx-auto" />
                ) : (
                  formatCurrency(dashboard.totals.dailyAvg)
                )}
              </p>
            </div>

            {/* Monthly Projection */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-gray-600">Projecao Mensal</span>
              </div>
              <p className="text-xl font-bold text-blue-700">
                {dashboard.isLoading ? (
                  <Skeleton className="h-6 w-20 mx-auto" />
                ) : (
                  formatCurrency(dashboard.totals.monthlyProjection)
                )}
              </p>
            </div>

            {/* Total Cost 30d */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <BarChart3 className="w-4 h-4 text-purple-600" />
                <span className="text-xs text-gray-600">Total (30d)</span>
              </div>
              <p className="text-xl font-bold text-purple-700">
                {dashboard.isLoading ? (
                  <Skeleton className="h-6 w-20 mx-auto" />
                ) : (
                  formatCurrency(dashboard.totals.totalCost)
                )}
              </p>
            </div>

            {/* OpenAI Tokens */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Brain className="w-4 h-4 text-green-600" />
                <span className="text-xs text-gray-600">Tokens OpenAI</span>
              </div>
              <p className="text-xl font-bold text-green-700">
                {dashboard.isLoading ? (
                  <Skeleton className="h-6 w-20 mx-auto" />
                ) : (
                  formatNumber(dashboard.openai?.totalTokens || 0)
                )}
              </p>
            </div>

            {/* Cartesia Minutes */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Mic className="w-4 h-4 text-pink-600" />
                <span className="text-xs text-gray-600">Audio (min)</span>
              </div>
              <p className="text-xl font-bold text-pink-700">
                {dashboard.isLoading ? (
                  <Skeleton className="h-6 w-20 mx-auto" />
                ) : (
                  (dashboard.cartesia?.totalDurationMinutes || 0).toFixed(1)
                )}
              </p>
            </div>

            {/* Cloudflare Requests */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Cloud className="w-4 h-4 text-orange-600" />
                <span className="text-xs text-gray-600">Requests CF</span>
              </div>
              <p className="text-xl font-bold text-orange-700">
                {dashboard.isLoading ? (
                  <Skeleton className="h-6 w-20 mx-auto" />
                ) : (
                  formatNumber(dashboard.cloudflare?.totalRequests || 0)
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Provider Status Bar */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="text-sm font-medium text-gray-700">Status dos Provedores:</span>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-green-600" />
                <span className="text-sm">OpenAI</span>
                <StatusIndicator status={providerStatus?.openai || "unknown"} />
              </div>
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-pink-600" />
                <span className="text-sm">Cartesia</span>
                <StatusIndicator status={providerStatus?.cartesia || "unknown"} />
              </div>
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-600" />
                <span className="text-sm">Render</span>
                <StatusIndicator status={providerStatus?.render || "unknown"} />
              </div>
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-orange-600" />
                <span className="text-sm">Cloudflare</span>
                <StatusIndicator status={providerStatus?.cloudflare || "unknown"} />
              </div>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600" />
                <span className="text-sm">Supabase</span>
                <StatusIndicator status={providerStatus?.supabase || "unknown"} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 gap-1 h-auto p-1">
          <TabsTrigger value="overview" className="gap-2 py-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Visao Geral</span>
          </TabsTrigger>
          <TabsTrigger value="openai" className="gap-2 py-2">
            <Brain className="w-4 h-4" />
            <span className="hidden sm:inline">OpenAI</span>
          </TabsTrigger>
          <TabsTrigger value="cartesia" className="gap-2 py-2">
            <Mic className="w-4 h-4" />
            <span className="hidden sm:inline">Cartesia</span>
          </TabsTrigger>
          <TabsTrigger value="render" className="gap-2 py-2">
            <Server className="w-4 h-4" />
            <span className="hidden sm:inline">Render</span>
          </TabsTrigger>
          <TabsTrigger value="cloudflare" className="gap-2 py-2">
            <Cloud className="w-4 h-4" />
            <span className="hidden sm:inline">Cloudflare</span>
          </TabsTrigger>
          <TabsTrigger value="supabase" className="gap-2 py-2">
            <Database className="w-4 h-4" />
            <span className="hidden sm:inline">Supabase</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="gap-2 py-2 relative">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Alertas</span>
            {dashboard.totals.unresolvedAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {dashboard.totals.unresolvedAlerts}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* OpenAI Summary Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("openai")}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Brain className="w-5 h-5 text-green-600" />
                  OpenAI GPT-4o-mini
                </CardTitle>
                <StatusIndicator status={providerStatus?.openai || "unknown"} />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tokens (30d)</span>
                    <span className="font-mono font-semibold">
                      {formatNumber(dashboard.openai?.totalTokens || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Custo (30d)</span>
                    <span className="font-mono font-semibold text-green-600">
                      {formatCurrency(dashboard.openai?.totalCost || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Requests</span>
                    <span className="font-mono">{formatNumber(dashboard.openai?.totalRequests || 0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cartesia Summary Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("cartesia")}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Mic className="w-5 h-5 text-pink-600" />
                  Cartesia TTS
                </CardTitle>
                <StatusIndicator status={providerStatus?.cartesia || "unknown"} />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Caracteres (30d)</span>
                    <span className="font-mono font-semibold">
                      {formatNumber(dashboard.cartesia?.totalChars || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Duracao</span>
                    <span className="font-mono font-semibold">
                      {(dashboard.cartesia?.totalDurationMinutes || 0).toFixed(1)} min
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Custo (30d)</span>
                    <span className="font-mono font-semibold text-green-600">
                      {formatCurrency(dashboard.cartesia?.totalCost || 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Render Summary Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("render")}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Server className="w-5 h-5 text-cyan-600" />
                  Render
                </CardTitle>
                <StatusIndicator status={providerStatus?.render || "unknown"} />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge className="bg-green-500">{dashboard.render?.status || "N/A"}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">CPU</span>
                    <span className="font-mono">{dashboard.render?.cpu_percent?.toFixed(1) || 0}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Memoria</span>
                    <span className="font-mono">{dashboard.render?.memoria_percent?.toFixed(1) || 0}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cloudflare Summary Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("cloudflare")}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-orange-600" />
                  Cloudflare Workers
                </CardTitle>
                <StatusIndicator status={providerStatus?.cloudflare || "unknown"} />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Requests (30d)</span>
                    <span className="font-mono font-semibold">
                      {formatNumber(dashboard.cloudflare?.totalRequests || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Custo (30d)</span>
                    <span className="font-mono font-semibold text-green-600">
                      {formatCurrency(dashboard.cloudflare?.totalCost || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Bandwidth</span>
                    <span className="font-mono">
                      {(dashboard.cloudflare?.totalBandwidthMB || 0).toFixed(2)} MB
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Supabase Summary Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("supabase")}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-600" />
                  Supabase
                </CardTitle>
                <StatusIndicator status={providerStatus?.supabase || "unknown"} />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Leituras (30d)</span>
                    <span className="font-mono font-semibold">
                      {formatNumber(dashboard.supabase?.totalReads || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Escritas (30d)</span>
                    <span className="font-mono font-semibold">
                      {formatNumber(dashboard.supabase?.totalWrites || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Storage</span>
                    <span className="font-mono">
                      {(dashboard.supabase?.storageMB || 0).toFixed(2)} MB
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alerts Summary Card */}
            <Card
              className={`hover:shadow-lg transition-shadow cursor-pointer ${
                dashboard.totals.unresolvedAlerts > 0 ? "border-yellow-300 bg-yellow-50" : ""
              }`}
              onClick={() => setActiveTab("alerts")}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Bell className={`w-5 h-5 ${dashboard.totals.unresolvedAlerts > 0 ? "text-yellow-600" : "text-gray-600"}`} />
                  Alertas
                </CardTitle>
                {dashboard.totals.unresolvedAlerts > 0 ? (
                  <Badge variant="destructive">{dashboard.totals.unresolvedAlerts} ativos</Badge>
                ) : (
                  <Badge className="bg-green-500">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    OK
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Alertas Ativos</span>
                    <span className="font-mono font-semibold">
                      {dashboard.totals.unresolvedAlerts}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Alertas</span>
                    <span className="font-mono">{dashboard.alerts?.length || 0}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Clique para gerenciar alertas e configuracoes
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* OpenAI Tab */}
        <TabsContent value="openai" className="mt-6">
          <MetricsOpenAI />
        </TabsContent>

        {/* Cartesia Tab */}
        <TabsContent value="cartesia" className="mt-6">
          <MetricsCartesia />
        </TabsContent>

        {/* Render Tab */}
        <TabsContent value="render" className="mt-6">
          <MetricsRender />
        </TabsContent>

        {/* Cloudflare Tab */}
        <TabsContent value="cloudflare" className="mt-6">
          <MetricsCloudflare />
        </TabsContent>

        {/* Supabase Tab */}
        <TabsContent value="supabase" className="mt-6">
          <MetricsSupabase />
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="mt-6">
          <MetricsAlerts />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminMetrics;
