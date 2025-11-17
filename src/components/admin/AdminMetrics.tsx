import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, MessageSquare, Clock, Zap } from "lucide-react";

/**
 * COMPONENTE: AdminMetrics
 *
 * Painel para visualização de métricas e analytics
 * - Consumo de tokens por empresa
 * - Mensagens processadas
 * - Tempo de resposta médio
 * - Taxa de conversão
 * - Gráficos e estatísticas
 */
const AdminMetrics = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-900 bg-clip-text text-transparent mb-2 flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-purple-600" />
          Métricas e Analytics
        </h1>
        <p className="text-gray-600">
          Acompanhe o desempenho e uso da plataforma
        </p>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Mensagens Hoje</CardTitle>
            <MessageSquare className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">0</p>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              +0% vs ontem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tokens Consumidos</CardTitle>
            <Zap className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">0</p>
            <p className="text-xs text-gray-500 mt-1">Últimas 24h</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Usuários Ativos</CardTitle>
            <Users className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">0</p>
            <p className="text-xs text-gray-500 mt-1">Agora</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tempo Médio</CardTitle>
            <Clock className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">0s</p>
            <p className="text-xs text-gray-500 mt-1">Resposta da LIA</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mensagens por Dia</CardTitle>
            <CardDescription>Volume de mensagens processadas nos últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-sm">Gráfico será implementado em breve</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consumo de Tokens</CardTitle>
            <CardDescription>Uso de tokens por empresa nos últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Zap className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-sm">Gráfico será implementado em breve</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Uso por Empresa */}
      <Card>
        <CardHeader>
          <CardTitle>Uso por Empresa</CardTitle>
          <CardDescription>
            Detalhamento de consumo por cliente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold">Nenhum dado disponível</p>
            <p className="text-sm">Métricas detalhadas serão exibidas aqui</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMetrics;
