import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area } from "recharts";
import { Server, Cpu, HardDrive, Activity, Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import {
  useMetricsRender,
  useMetricsRenderLatest,
  formatNumber,
} from "@/hooks/useMetrics";

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  color?: string;
  progress?: number;
}

const MetricCard = ({ title, value, description, icon, color = "purple", progress }: MetricCardProps) => (
  <Card className={`bg-gradient-to-br from-${color}-50 to-white border-${color}-100`}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold text-${color}-900`}>{value}</div>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
      {progress !== undefined && (
        <Progress value={progress} className="mt-2 h-2" />
      )}
    </CardContent>
  </Card>
);

const chartConfig = {
  cpu: { label: "CPU %", color: "hsl(262, 83%, 58%)" },
  memoria: { label: "Memoria %", color: "hsl(330, 81%, 60%)" },
  requests: { label: "Requests", color: "hsl(142, 76%, 36%)" },
};

// Format uptime
const formatUptime = (seconds: number | null): string => {
  if (!seconds) return "N/A";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
    operational: { color: "bg-green-500", icon: <CheckCircle className="w-3 h-3" /> },
    running: { color: "bg-green-500", icon: <CheckCircle className="w-3 h-3" /> },
    healthy: { color: "bg-green-500", icon: <CheckCircle className="w-3 h-3" /> },
    degraded: { color: "bg-yellow-500", icon: <AlertTriangle className="w-3 h-3" /> },
    down: { color: "bg-red-500", icon: <XCircle className="w-3 h-3" /> },
    unknown: { color: "bg-gray-500", icon: <Activity className="w-3 h-3" /> },
  };

  const config = statusConfig[status.toLowerCase()] || statusConfig.unknown;

  return (
    <Badge className={`${config.color} gap-1`}>
      {config.icon}
      {status}
    </Badge>
  );
};

export const MetricsRender = () => {
  const { data: metrics, isLoading: loadingMetrics } = useMetricsRender(30);
  const { data: latest, isLoading: loadingLatest } = useMetricsRenderLatest();

  // Prepare chart data - group by hour for last 24 hours
  const chartData = metrics
    ? Object.values(
        metrics
          .filter((m) => {
            const timestamp = new Date(m.timestamp);
            const dayAgo = new Date();
            dayAgo.setDate(dayAgo.getDate() - 1);
            return timestamp >= dayAgo;
          })
          .reduce((acc, m) => {
            const hour = new Date(m.timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
            if (!acc[hour]) {
              acc[hour] = { time: hour, cpu: 0, memoria: 0, requests: 0, count: 0 };
            }
            acc[hour].cpu += m.cpu_percent || 0;
            acc[hour].memoria += m.memoria_percent || 0;
            acc[hour].requests += m.requests_count || 0;
            acc[hour].count += 1;
            return acc;
          }, {} as Record<string, { time: string; cpu: number; memoria: number; requests: number; count: number }>)
      )
        .map((d) => ({
          time: d.time,
          cpu: d.count > 0 ? d.cpu / d.count : 0,
          memoria: d.count > 0 ? d.memoria / d.count : 0,
          requests: d.requests,
        }))
        .slice(-24)
    : [];

  // Calculate averages
  const avgCpu = metrics && metrics.length > 0
    ? metrics.reduce((sum, m) => sum + (m.cpu_percent || 0), 0) / metrics.length
    : 0;
  const avgMemoria = metrics && metrics.length > 0
    ? metrics.reduce((sum, m) => sum + (m.memoria_percent || 0), 0) / metrics.length
    : 0;

  const isLoading = loadingMetrics || loadingLatest;

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
      {/* Header Panel - Server Status */}
      <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Status do Servidor</p>
              <div className="mt-2">
                <StatusBadge status={latest?.status || "unknown"} />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Servico</p>
              <p className="text-2xl font-bold text-blue-700">{latest?.servico || "N/A"}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Uptime</p>
              <p className="text-2xl font-bold text-green-700">{formatUptime(latest?.uptime_seconds || null)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Ultima Verificacao</p>
              <p className="text-sm font-mono text-gray-700">
                {latest?.timestamp ? new Date(latest.timestamp).toLocaleString("pt-BR") : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="CPU Atual"
          value={`${latest?.cpu_percent?.toFixed(1) || 0}%`}
          description={`Media: ${avgCpu.toFixed(1)}%`}
          icon={<Cpu className="w-4 h-4 text-purple-600" />}
          progress={latest?.cpu_percent || 0}
        />
        <MetricCard
          title="Memoria Atual"
          value={`${latest?.memoria_percent?.toFixed(1) || 0}%`}
          description={`${latest?.memoria_mb || 0} MB usados`}
          icon={<HardDrive className="w-4 h-4 text-blue-600" />}
          color="blue"
          progress={latest?.memoria_percent || 0}
        />
        <MetricCard
          title="Requests (24h)"
          value={formatNumber(chartData.reduce((sum, d) => sum + d.requests, 0))}
          description="Total de requisicoes"
          icon={<Activity className="w-4 h-4 text-green-600" />}
          color="green"
        />
        <MetricCard
          title="Uptime"
          value={formatUptime(latest?.uptime_seconds || null)}
          description="Tempo online"
          icon={<Clock className="w-4 h-4 text-cyan-600" />}
          color="cyan"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPU/Memory Chart */}
        <Card>
          <CardHeader>
            <CardTitle>CPU e Memoria (24h)</CardTitle>
            <CardDescription>Uso de recursos do servidor</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" fontSize={10} />
                <YAxis fontSize={12} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="cpu"
                  stroke="var(--color-cpu)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="memoria"
                  stroke="var(--color-memoria)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Requests Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Requests (24h)</CardTitle>
            <CardDescription>Volume de requisicoes por hora</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" fontSize={10} />
                <YAxis fontSize={12} />
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
      </div>

      {/* Recent Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Historico de Status</CardTitle>
          <CardDescription>Ultimas 20 verificacoes de infraestrutura</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Servico</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">CPU</TableHead>
                <TableHead className="text-right">Memoria</TableHead>
                <TableHead className="text-right">Requests</TableHead>
                <TableHead>Erro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics?.slice(0, 20).map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-mono text-xs">
                    {new Date(m.timestamp).toLocaleString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{m.servico}</Badge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={m.status} />
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {m.cpu_percent?.toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {m.memoria_percent?.toFixed(1)}% ({m.memoria_mb} MB)
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatNumber(m.requests_count || 0)}
                  </TableCell>
                  <TableCell>
                    {m.erro ? (
                      <span className="text-xs text-red-600">{m.erro.substring(0, 30)}...</span>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
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

      {/* Server Info */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-sm">Informacoes do Servidor - Render.com</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Provedor:</span>
              <span className="ml-2 font-semibold">Render.com</span>
            </div>
            <div>
              <span className="text-gray-600">Tipo:</span>
              <span className="ml-2 font-semibold">Web Service</span>
            </div>
            <div>
              <span className="text-gray-600">Regiao:</span>
              <span className="ml-2 font-semibold">Oregon (US)</span>
            </div>
            <div>
              <span className="text-gray-600">Auto-scale:</span>
              <span className="ml-2 font-semibold">Habilitado</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsRender;
