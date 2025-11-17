import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * COMPONENTE: AdminCompanies
 *
 * Painel para gestão de empresas clientes
 * - Lista de empresas
 * - Detalhes de planos contratados
 * - Consumo de recursos
 * - Gestão de usuários por empresa
 */
const AdminCompanies = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-900 bg-clip-text text-transparent mb-2 flex items-center gap-3">
          <Building2 className="w-8 h-8 text-indigo-600" />
          Gestão de Empresas
        </h1>
        <p className="text-gray-600">
          Gerencie empresas clientes e seus planos
        </p>
      </div>

      {/* Ações */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar empresa por nome, CNPJ ou responsável..."
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
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" />
          Nova Empresa
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Empresas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-indigo-600">0</p>
            <p className="text-xs text-gray-500 mt-1">Clientes ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Plano Start</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-cyan-600">0</p>
            <p className="text-xs text-gray-500 mt-1">Empresas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Plano Plus</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">0</p>
            <p className="text-xs text-gray-500 mt-1">Empresas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Plano Pro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">0</p>
            <p className="text-xs text-gray-500 mt-1">Empresas</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Empresas */}
      <Card>
        <CardHeader>
          <CardTitle>Empresas Cadastradas</CardTitle>
          <CardDescription>
            Lista completa de empresas clientes da plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <Building2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold">Nenhuma empresa cadastrada</p>
            <p className="text-sm mb-4">Comece adicionando sua primeira empresa cliente</p>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Empresa
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCompanies;
