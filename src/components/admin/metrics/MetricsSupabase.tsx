import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar, LineChart, Line } from "recharts";
import { Database, HardDrive, Radio, Download, Upload, AlertTriangle, Activity } from "lucide-react";
import {
  useMetricsSupabase,
  useMetricsSupabaseSummary,
  formatNumber,
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
  leituras: { label: "Leituras", color: "hsl(142, 76%, 36%)" },
  escritas: { label: "Escritas", color: "hsl(262, 83%, 58%)" },
  realtime: { label: "Realtime", color: "hsl(25, 95%, 53%)" },
  bandwidth: { label: "Bandwidth", color: "hsl(330, 81%, 60%)" },
};

// Format bytes
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const MetricsSupabase = () => {
  const { data: metrics, isLoading: loadingMetrics } = useMetricsSupabase(30);
  const { data: summary, isLoading: loadingSummary } = useMetricsSupabaseSummary(30);

  // Prepare chart data - group by day
  const chartData = metrics
    ? Object.values(
        metrics.reduce((acc, m) => {
          const date = new Date(m.timestamp).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
          if (!acc[date]) {
            acc[date] = { date, leituras: 0, escritas: 0, realtime: 0, bandwidth: 0 };
          }
          acc[date].leituras += m.leituras || 0;
          acc[date].escritas += m.escritas || 0;
          acc[date].realtime = Math.max(acc[date].realtime, m.realtime_connections || 0);
          acc[date].bandwidth += (m.bandwidth_bytes || 0) / (1024 * 1024); // Convert to MB
          return acc;
        }, {} as Record<string, { date: string; leituras: number; escritas: number; realtime: number; bandwidth: number }>)
      ).slice(-14)
    : [];

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
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Operacoes Hoje</p>
              <p className="text-2xl font-bold text-emerald-700">
                {formatNumber(
                  (chartData[chartData.length - 1]?.leituras || 0) +
                  (chartData[chartData.length - 1]?.escritas || 0)
                )}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Storage Atual</p>
              <p className="text-2xl font-bold text-blue-700">{formatBytes(summary?.storageBytes || 0)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Conexoes Realtime</p>
              <p className="text-2xl font-bold text-orange-700">{summary?.realtimeConnections || 0}</p>
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
          title="Total de Leituras"
          value={formatNumber(summary?.totalReads || 0)}
          description="SELECT queries (30 dias)"
          icon={<Download className="w-4 h-4 text-green-600" />}
          color="green"
        />
        <MetricCard
          title="Total de Escritas"
          value={formatNumber(summary?.totalWrites || 0)}
          description="INSERT/UPDATE/DELETE (30 dias)"
          icon={<Upload className="w-4 h-4 text-purple-600" />}
        />
        <MetricCard
          title="Storage"
          value={formatBytes(summary?.storageBytes || 0)}
          description={`${summary?.storageMB?.toFixed(2) || 0} MB`}
          icon={<HardDrive className="w-4 h-4 text-blue-600" />}
          color="blue"
        />
        <MetricCard
          title="Bandwidth"
          value={formatBytes(summary?.totalBandwidth || 0)}
          description="Transferencia total"
          icon={<Activity className="w-4 h-4 text-pink-600" />}
          color="pink"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Read/Write Operations Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Operacoes de Banco por Dia</CardTitle>
            <CardDescription>Leituras vs Escritas nos ultimos 14 dias</CardDescription>
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
                  dataKey="leituras"
                  stackId="1"
                  stroke="var(--color-leituras)"
                  fill="var(--color-leituras)"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="escritas"
                  stackId="1"
                  stroke="var(--color-escritas)"
                  fill="var(--color-escritas)"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Realtime Connections Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Conexoes Realtime</CardTitle>
            <CardDescription>Pico de conexoes por dia</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="realtime"
                  stroke="var(--color-realtime)"
                  strokeWidth={2}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bandwidth Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Bandwidth por Dia</CardTitle>
          <CardDescription>Transferencia de dados em MB</CardDescription>
        </CardHeader>
        <CardContent className="h-[250px]">
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

      {/* Recent Activity Table */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
          <CardDescription>Ultimas 20 metricas de banco</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead className="text-right">Leituras</TableHead>
                <TableHead className="text-right">Escritas</TableHead>
                <TableHead className="text-right">Storage</TableHead>
                <TableHead className="text-right">Realtime</TableHead>
                <TableHead className="text-right">Bandwidth</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics?.slice(0, 20).map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-mono text-xs">
                    {new Date(m.timestamp).toLocaleString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-right font-mono text-green-600">
                    {formatNumber(m.leituras)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-purple-600">
                    {formatNumber(m.escritas)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatBytes(m.storage_bytes || 0)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="gap-1">
                      <Radio className="w-3 h-3" />
                      {m.realtime_connections || 0}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatBytes(m.bandwidth_bytes || 0)}
                  </TableCell>
                  <TableCell>
                    {m.erro ? (
                      <Badge variant="destructive" className="gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Erro
                      </Badge>
                    ) : (
                      <Badge className="bg-green-500">OK</Badge>
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

      {/* Supabase Info */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-sm">Informacoes - Supabase</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Provedor:</span>
              <span className="ml-2 font-semibold">Supabase</span>
            </div>
            <div>
              <span className="text-gray-600">Database:</span>
              <span className="ml-2 font-semibold">PostgreSQL 15</span>
            </div>
            <div>
              <span className="text-gray-600">Realtime:</span>
              <span className="ml-2 font-semibold">Habilitado</span>
            </div>
            <div>
              <span className="text-gray-600">RLS:</span>
              <span className="ml-2 font-semibold">Ativo</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsSupabase;
