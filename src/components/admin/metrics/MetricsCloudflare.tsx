import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar } from "recharts";
import { Cloud, Globe, DollarSign, AlertTriangle, Zap, Download } from "lucide-react";
import {
  useMetricsCloudflare,
  useMetricsCloudflareSummary,
  formatCurrency,
  formatNumber,
  COST_RATES,
} from "@/hooks/useMetrics";

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  color?: string;
}

const MetricCard = ({ title, value, description, icon, color = "purple" }: MetricCardProps) => (
  <Card className={`bg-gradient-to-br from-${color}-50 to-white border-${color}-100`}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold text-${color}-900`}>{value}</div>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </CardContent>
  </Card>
);

const chartConfig = {
  requests: { label: "Requests", color: "hsl(25, 95%, 53%)" },
  bandwidth: { label: "Bandwidth (MB)", color: "hsl(262, 83%, 58%)" },
  custo: { label: "Custo", color: "hsl(142, 76%, 36%)" },
  erros: { label: "Erros", color: "hsl(0, 84%, 60%)" },
};

// Format bytes
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const MetricsCloudflare = () => {
  const { data: metrics, isLoading: loadingMetrics } = useMetricsCloudflare(30);
  const { data: summary, isLoading: loadingSummary } = useMetricsCloudflareSummary(30);

  // Prepare chart data - group by day
  const chartData = metrics
    ? Object.values(
        metrics.reduce((acc, m) => {
          const date = new Date(m.timestamp).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
          if (!acc[date]) {
            acc[date] = { date, requests: 0, bandwidth: 0, custo: 0, erros: 0 };
          }
          acc[date].requests += m.requests_count || 0;
          acc[date].bandwidth += (m.bandwidth_bytes || 0) / (1024 * 1024); // Convert to MB
          acc[date].custo += m.custo || 0;
          acc[date].erros += m.erros_count || 0;
          return acc;
        }, {} as Record<string, { date: string; requests: number; bandwidth: number; custo: number; erros: number }>)
      ).slice(-14)
    : [];

  // Calculate projections
  const dailyAvg = summary ? summary.totalCost / 30 : 0;
  const monthlyProjection = dailyAvg * 30;

  const isLoading = loadingMetrics || loadingSummary;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
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
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Requests Hoje</p>
              <p className="text-2xl font-bold text-orange-700">
                {formatNumber(chartData[chartData.length - 1]?.requests || 0)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Projecao Mensal</p>
              <p className="text-2xl font-bold text-blue-700">{formatCurrency(monthlyProjection)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Custo Total (30d)</p>
              <p className="text-2xl font-bold text-purple-700">{formatCurrency(summary?.totalCost || 0)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Status</p>
              <Badge className="mt-1 bg-green-500">Operacional</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total de Requests"
          value={formatNumber(summary?.totalRequests || 0)}
          description="Ultimos 30 dias"
          icon={<Globe className="w-4 h-4 text-orange-600" />}
          color="orange"
        />
        <MetricCard
          title="Bandwidth Total"
          value={formatBytes(summary?.totalBandwidth || 0)}
          description={`${summary?.totalBandwidthMB?.toFixed(2) || 0} MB`}
          icon={<Download className="w-4 h-4 text-blue-600" />}
          color="blue"
        />
        <MetricCard
          title="Custo Total"
          value={formatCurrency(summary?.totalCost || 0)}
          description={`$0.50 / 1M requests`}
          icon={<DollarSign className="w-4 h-4 text-green-600" />}
          color="green"
        />
        <MetricCard
          title="Erros"
          value={formatNumber(summary?.totalErrors || 0)}
          description="Total de erros registrados"
          icon={<AlertTriangle className="w-4 h-4 text-red-600" />}
          color="red"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requests Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Requests por Dia</CardTitle>
            <CardDescription>Volume de requisicoes nos Workers</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="requests"
                  stroke="var(--color-requests)"
                  fill="var(--color-requests)"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Bandwidth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Bandwidth por Dia</CardTitle>
            <CardDescription>Trafego em MB nos ultimos 14 dias</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(v) => `${v.toFixed(0)} MB`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="bandwidth" fill="var(--color-bandwidth)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Cost Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Evolucao de Custos</CardTitle>
          <CardDescription>Custo diario dos Workers nos ultimos 14 dias</CardDescription>
        </CardHeader>
        <CardContent className="h-[250px]">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} tickFormatter={(v) => `$${v.toFixed(4)}`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="custo"
                stroke="var(--color-custo)"
                fill="var(--color-custo)"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Recent Activity Table */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
          <CardDescription>Ultimas 20 metricas de Workers</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Worker</TableHead>
                <TableHead className="text-right">Requests</TableHead>
                <TableHead className="text-right">Bandwidth</TableHead>
                <TableHead className="text-right">CPU Time</TableHead>
                <TableHead className="text-right">Custo</TableHead>
                <TableHead className="text-right">Erros</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics?.slice(0, 20).map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-mono text-xs">
                    {new Date(m.timestamp).toLocaleString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1">
                      <Cloud className="w-3 h-3" />
                      {m.worker_name || "default"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatNumber(m.requests_count)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatBytes(m.bandwidth_bytes || 0)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {m.cpu_time_ms || 0} ms
                  </TableCell>
                  <TableCell className="text-right font-mono text-green-600">
                    {formatCurrency(m.custo)}
                  </TableCell>
                  <TableCell className="text-right">
                    {(m.erros_count || 0) > 0 ? (
                      <Badge variant="destructive">{m.erros_count}</Badge>
                    ) : (
                      <span className="text-gray-400">0</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {(!metrics || metrics.length === 0) && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Nenhuma metrica registrada ainda
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pricing Info */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-sm">Informacoes de Precificacao - Cloudflare Workers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Custo:</span>
              <span className="ml-2 font-mono font-semibold">$0.50 / 1M requests</span>
            </div>
            <div>
              <span className="text-gray-600">Free Tier:</span>
              <span className="ml-2 font-semibold">100k requests/dia</span>
            </div>
            <div>
              <span className="text-gray-600">CPU Time:</span>
              <span className="ml-2 font-semibold">10ms por request</span>
            </div>
            <div>
              <span className="text-gray-600">Bandwidth:</span>
              <span className="ml-2 font-semibold">Ilimitado</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsCloudflare;
