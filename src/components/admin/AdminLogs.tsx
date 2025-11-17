import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * COMPONENTE: AdminLogs
 *
 * Painel para visualização de logs do sistema
 * - Logs de aplicação
 * - Logs de API
 * - Logs de autenticação
 * - Exportação de logs
 */
const AdminLogs = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-900 bg-clip-text text-transparent mb-2 flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-600" />
          Logs do Sistema
        </h1>
        <p className="text-gray-600">
          Visualize e exporte logs de atividades do sistema
        </p>
      </div>

      {/* Filtros e Ações */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar nos logs..."
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
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </div>

      {/* Cards de Tipos de Log */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:border-blue-500 transition-colors">
          <CardHeader>
            <CardTitle className="text-lg">Logs de Aplicação</CardTitle>
            <CardDescription>Eventos gerais da aplicação</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">0 eventos</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-green-500 transition-colors">
          <CardHeader>
            <CardTitle className="text-lg">Logs de API</CardTitle>
            <CardDescription>Requisições e respostas da API</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">0 requisições</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-purple-500 transition-colors">
          <CardHeader>
            <CardTitle className="text-lg">Logs de Autenticação</CardTitle>
            <CardDescription>Logins e ações de usuários</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">0 ações</p>
          </CardContent>
        </Card>
      </div>

      {/* Área de Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline de Logs</CardTitle>
          <CardDescription>
            Histórico cronológico de eventos do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold">Nenhum log disponível</p>
            <p className="text-sm">O sistema de logs será implementado em breve</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogs;
