import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * COMPONENTE: AdminErrors
 *
 * Painel para monitoramento e gestão de erros do sistema
 * - Logs de erros em tempo real
 * - Filtros por severidade, data e origem
 * - Detalhes de stack traces
 * - Estatísticas de erros
 */
const AdminErrors = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-900 bg-clip-text text-transparent mb-2 flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-red-600" />
          Monitoramento de Erros
        </h1>
        <p className="text-gray-600">
          Visualize e gerencie erros do sistema em tempo real
        </p>
      </div>

      {/* Filtros */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar por mensagem, componente ou usuário..."
            className="w-full"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>
        <Button variant="outline">
          <Search className="w-4 h-4 mr-2" />
          Buscar
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Erros</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">0</p>
            <p className="text-xs text-gray-500 mt-1">Últimas 24h</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Críticos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-700">0</p>
            <p className="text-xs text-gray-500 mt-1">Precisam atenção</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avisos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">0</p>
            <p className="text-xs text-gray-500 mt-1">Não bloqueantes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Taxa de Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-700">0%</p>
            <p className="text-xs text-gray-500 mt-1">Do total de requisições</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Erros */}
      <Card>
        <CardHeader>
          <CardTitle>Erros Recentes</CardTitle>
          <CardDescription>
            Lista de erros capturados pelo sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold">Nenhum erro registrado</p>
            <p className="text-sm">O monitoramento de erros será implementado em breve</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminErrors;
