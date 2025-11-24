import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Eye, ChevronRight, Users, CheckCircle, Clock, AlertCircle } from "lucide-react";
import AdminImobLayout from "@/components/layout/AdminImobLayout";

// Mock data for processes
const processosMock = [
  {
    id: 1,
    cliente: "Maria Silva",
    email: "maria@email.com",
    etapaAtual: 3,
    etapaNome: "Validacao Bancaria",
    progresso: 43,
    status: "em_andamento",
    ultimaAtualizacao: "2024-11-20",
    observacao: "Aguardando retorno do banco"
  },
  {
    id: 2,
    cliente: "Joao Santos",
    email: "joao@email.com",
    etapaAtual: 1,
    etapaNome: "Pre-analise",
    progresso: 14,
    status: "novo",
    ultimaAtualizacao: "2024-11-22",
    observacao: "Cliente novo - iniciar analise"
  },
  {
    id: 3,
    cliente: "Ana Costa",
    email: "ana@email.com",
    etapaAtual: 5,
    etapaNome: "Visitas",
    progresso: 71,
    status: "em_andamento",
    ultimaAtualizacao: "2024-11-18",
    observacao: "3 visitas agendadas"
  },
  {
    id: 4,
    cliente: "Pedro Lima",
    email: "pedro@email.com",
    etapaAtual: 7,
    etapaNome: "Contrato",
    progresso: 100,
    status: "concluido",
    ultimaAtualizacao: "2024-11-15",
    observacao: "Contrato assinado"
  },
  {
    id: 5,
    cliente: "Carla Mendes",
    email: "carla@email.com",
    etapaAtual: 2,
    etapaNome: "Documentacao",
    progresso: 28,
    status: "atencao",
    ultimaAtualizacao: "2024-11-10",
    observacao: "Documentos pendentes ha 14 dias"
  },
];

const etapas = [
  "Pre-analise",
  "Documentacao",
  "Validacao Bancaria",
  "Busca",
  "Visitas",
  "Negociacao",
  "Contrato"
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "novo":
      return <Badge className="bg-green-500">Novo</Badge>;
    case "em_andamento":
      return <Badge className="bg-blue-500">Em Andamento</Badge>;
    case "concluido":
      return <Badge className="bg-gray-500">Concluido</Badge>;
    case "atencao":
      return <Badge className="bg-orange-500">Atencao</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "concluido":
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case "atencao":
      return <AlertCircle className="w-5 h-5 text-orange-500" />;
    default:
      return <Clock className="w-5 h-5 text-blue-500" />;
  }
};

const AdminProcessos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  const filteredProcessos = processosMock.filter((processo) => {
    const matchesSearch = processo.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          processo.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || processo.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminImobLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Processos</h1>
          <p className="text-muted-foreground">Acompanhe o status dos processos de cada cliente</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{processosMock.length}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-500">
                    {processosMock.filter(p => p.status === 'em_andamento').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Em Andamento</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-500">
                    {processosMock.filter(p => p.status === 'atencao').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Requer Atencao</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-500">
                    {processosMock.filter(p => p.status === 'concluido').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Concluidos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <CardTitle className="flex-1">Lista de Processos</CardTitle>
              <div className="flex gap-2">
                <div className="relative w-full sm:w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="novo">Novos</SelectItem>
                    <SelectItem value="em_andamento">Em Andamento</SelectItem>
                    <SelectItem value="atencao">Atencao</SelectItem>
                    <SelectItem value="concluido">Concluidos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredProcessos.map((processo) => (
                <div
                  key={processo.id}
                  className="p-4 rounded-lg border border-border bg-card hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(processo.status)}
                      <div>
                        <h3 className="font-semibold text-foreground">{processo.cliente}</h3>
                        <p className="text-sm text-muted-foreground">{processo.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(processo.status)}
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Eye className="w-4 h-4" />
                        Detalhes
                      </Button>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">
                        Etapa {processo.etapaAtual} de 7: <span className="text-foreground font-medium">{processo.etapaNome}</span>
                      </span>
                      <span className="text-foreground font-medium">{processo.progresso}%</span>
                    </div>
                    <Progress value={processo.progresso} className="h-2" />
                  </div>

                  {/* Pipeline Mini */}
                  <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-2">
                    {etapas.map((etapa, index) => (
                      <div key={index} className="flex items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                            index + 1 < processo.etapaAtual
                              ? "bg-green-500 text-white"
                              : index + 1 === processo.etapaAtual
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {index + 1 < processo.etapaAtual ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        {index < etapas.length - 1 && (
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-sm">
                    <p className="text-muted-foreground">
                      {processo.observacao && (
                        <span className="bg-muted px-2 py-1 rounded">{processo.observacao}</span>
                      )}
                    </p>
                    <p className="text-muted-foreground">
                      Atualizado: {new Date(processo.ultimaAtualizacao).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {filteredProcessos.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum processo encontrado
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminImobLayout>
  );
};

export default AdminProcessos;
