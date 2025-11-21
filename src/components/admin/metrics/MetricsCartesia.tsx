import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar } from "recharts";
import { Mic, DollarSign, Clock, AlertTriangle, TrendingUp, Volume2 } from "lucide-react";
import {
  useMetricsCartesia,
  useMetricsCartesiaSummary,
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
  caracteres: { label: "Caracteres", color: "hsl(262, 83%, 58%)" },
  duracao: { label: "Duracao (s)", color: "hsl(330, 81%, 60%)" },
  custo: { label: "Custo", color: "hsl(142, 76%, 36%)" },
};

// Format duration
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}m ${secs}s`;
};

export const MetricsCartesia = () => {
  const { data: metrics, isLoading: loadingMetrics } = useMetricsCartesia(30);
  const { data: summary, isLoading: loadingSummary } = useMetricsCartesiaSummary(30);

  // Prepare chart data - group by day
  const chartData = metrics
    ? Object.values(
        metrics.reduce((acc, m) => {
          const date = new Date(m.timestamp).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
          if (!acc[date]) {
            acc[date] = { date, caracteres: 0, duracao: 0, custo: 0, requests: 0 };
          }
          acc[date].caracteres += m.caracteres || 0;
          acc[date].duracao += m.duracao_segundos || 0;
          acc[date].custo += m.custo || 0;
          acc[date].requests += 1;
          return acc;
        }, {} as Record<string, { date: string; caracteres: number; duracao: number; custo: number; requests: number }>)
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
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Audio Gerado Hoje</p>
              <p className="text-2xl font-bold text-pink-700">
                {formatDuration(chartData[chartData.length - 1]?.duracao || 0)}
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
          title="Total de Caracteres"
          value={formatNumber(summary?.totalChars || 0)}
          description="Processados (30 dias)"
          icon={<Mic className="w-4 h-4 text-purple-600" />}
        />
        <MetricCard
          title="Duracao Total"
          value={formatDuration(summary?.totalDurationSeconds || 0)}
          description={`${summary?.totalDurationMinutes?.toFixed(1) || 0} minutos`}
          icon={<Clock className="w-4 h-4 text-blue-600" />}
          color="blue"
        />
        <MetricCard
          title="Requisicoes TTS"
          value={formatNumber(summary?.totalRequests || 0)}
          description="Conversoes de texto para voz"
          icon={<Volume2 className="w-4 h-4 text-pink-600" />}
          color="pink"
        />
        <MetricCard
          title="Custo Total"
          value={formatCurrency(summary?.totalCost || 0)}
          description="Ultimos 30 dias"
          icon={<DollarSign className="w-4 h-4 text-green-600" />}
          color="green"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Character Usage Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Caracteres por Dia</CardTitle>
            <CardDescription>Volume processado nos ultimos 14 dias</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="caracteres"
                  stroke="var(--color-caracteres)"
                  fill="var(--color-caracteres)"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Duration Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Duracao de Audio por Dia</CardTitle>
            <CardDescription>Tempo de audio gerado (segundos)</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(v) => `${v}s`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="duracao" fill="var(--color-duracao)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Table */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
          <CardDescription>Ultimas 20 conversoes TTS</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead className="text-right">Caracteres</TableHead>
                <TableHead className="text-right">Duracao</TableHead>
                <TableHead className="text-right">Custo</TableHead>
                <TableHead>Voz</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics?.slice(0, 20).map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-mono text-xs">
                    {new Date(m.timestamp).toLocaleString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatNumber(m.caracteres)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatDuration(m.duracao_segundos)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-green-600">
                    {formatCurrency(m.custo)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{m.voz_id || "default"}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">{m.origem || "-"}</TableCell>
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

      {/* Pricing Info */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-sm">Informacoes de Precificacao - Cartesia TTS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Taxa de conversao:</span>
              <span className="ml-2 font-mono font-semibold">850 caracteres = 1 minuto de audio</span>
            </div>
            <div>
              <span className="text-gray-600">Estimativa:</span>
              <span className="ml-2 font-mono font-semibold">~14 caracteres/segundo</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsCartesia;
