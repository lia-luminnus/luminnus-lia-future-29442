import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Brain, DollarSign, Zap, AlertTriangle, TrendingUp, Clock } from "lucide-react";
import {
  useMetricsOpenAI,
  useMetricsOpenAISummary,
  formatCurrency,
  formatNumber,
  COST_RATES,
} from "@/hooks/useMetrics";

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  color?: string;
}

const MetricCard = ({ title, value, description, icon, trend, color = "purple" }: MetricCardProps) => (
  <Card className={`bg-gradient-to-br from-${color}-50 to-white border-${color}-100`}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold text-${color}-900`}>{value}</div>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
      {trend && (
        <div className={`mt-2 flex items-center text-xs ${trend.value >= 0 ? "text-green-600" : "text-red-600"}`}>
          <TrendingUp className={`mr-1 h-3 w-3 ${trend.value < 0 ? "rotate-180" : ""}`} />
          {trend.value >= 0 ? "+" : ""}{trend.value}% {trend.label}
        </div>
      )}
    </CardContent>
  </Card>
);

const chartConfig = {
  tokens: { label: "Tokens", color: "hsl(262, 83%, 58%)" },
  input: { label: "Input", color: "hsl(262, 83%, 58%)" },
  output: { label: "Output", color: "hsl(330, 81%, 60%)" },
  custo: { label: "Custo", color: "hsl(142, 76%, 36%)" },
};

export const MetricsOpenAI = () => {
  const { data: metrics, isLoading: loadingMetrics } = useMetricsOpenAI(30);
  const { data: summary, isLoading: loadingSummary } = useMetricsOpenAISummary(30);

  // Prepare chart data - group by day
  const chartData = metrics
    ? Object.values(
        metrics.reduce((acc, m) => {
          const date = new Date(m.timestamp).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
          if (!acc[date]) {
            acc[date] = { date, input: 0, output: 0, custo: 0, requests: 0 };
          }
          acc[date].input += m.input_tokens || 0;
          acc[date].output += m.output_tokens || 0;
          acc[date].custo += m.custo || 0;
          acc[date].requests += 1;
          return acc;
        }, {} as Record<string, { date: string; input: number; output: number; custo: number; requests: number }>)
      ).slice(-14) // Last 14 days
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
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Consumo Hoje</p>
              <p className="text-2xl font-bold text-green-700">
                {formatNumber(chartData[chartData.length - 1]?.input + chartData[chartData.length - 1]?.output || 0)} tokens
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
          title="Total de Tokens"
          value={formatNumber(summary?.totalTokens || 0)}
          description="Input + Output (30 dias)"
          icon={<Zap className="w-4 h-4 text-purple-600" />}
        />
        <MetricCard
          title="Tokens Input"
          value={formatNumber(summary?.totalInputTokens || 0)}
          description={`${formatCurrency(COST_RATES.openai.inputPerToken * 1000000)}/1M`}
          icon={<Brain className="w-4 h-4 text-blue-600" />}
          color="blue"
        />
        <MetricCard
          title="Tokens Output"
          value={formatNumber(summary?.totalOutputTokens || 0)}
          description={`${formatCurrency(COST_RATES.openai.outputPerToken * 1000000)}/1M`}
          icon={<Brain className="w-4 h-4 text-pink-600" />}
          color="pink"
        />
        <MetricCard
          title="Custo por Request"
          value={formatCurrency(summary?.avgCostPerRequest || 0)}
          description={`${summary?.totalRequests || 0} requests`}
          icon={<DollarSign className="w-4 h-4 text-green-600" />}
          color="green"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Token Usage Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Uso de Tokens por Dia</CardTitle>
            <CardDescription>Input vs Output nos ultimos 14 dias</CardDescription>
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
                  dataKey="input"
                  stackId="1"
                  stroke="var(--color-input)"
                  fill="var(--color-input)"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="output"
                  stackId="1"
                  stroke="var(--color-output)"
                  fill="var(--color-output)"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Cost Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Custo Diario</CardTitle>
            <CardDescription>Custos em USD nos ultimos 14 dias</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(v) => `$${v.toFixed(3)}`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="custo" fill="var(--color-custo)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Table */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
          <CardDescription>Ultimas 20 requisicoes a API OpenAI</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead className="text-right">Input</TableHead>
                <TableHead className="text-right">Output</TableHead>
                <TableHead className="text-right">Custo</TableHead>
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
                  <TableCell>
                    <Badge variant="outline">{m.modelo}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatNumber(m.input_tokens)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatNumber(m.output_tokens)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-green-600">
                    {formatCurrency(m.custo)}
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
          <CardTitle className="text-sm">Informacoes de Precificacao - GPT-4o-mini</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Input:</span>
              <span className="ml-2 font-mono font-semibold">$0.15 / 1M tokens</span>
            </div>
            <div>
              <span className="text-gray-600">Output:</span>
              <span className="ml-2 font-mono font-semibold">$0.60 / 1M tokens</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsOpenAI;
