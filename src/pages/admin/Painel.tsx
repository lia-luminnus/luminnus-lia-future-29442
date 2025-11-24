import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building2, FileCheck, Calendar, TrendingUp, ArrowRight, Clock, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import AdminImobLayout from "@/components/layout/AdminImobLayout";
import { getClientes, getImoveis, getProcessos, getAllAgenda, type Cliente, type Imovel, type Processo, type AgendaEvento } from "@/services/api";

const AdminPainel = () => {
  const [loading, setLoading] = useState(true);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [agenda, setAgenda] = useState<AgendaEvento[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [clientesData, imoveisData, processosData, agendaData] = await Promise.all([
          getClientes().catch(() => []),
          getImoveis().catch(() => []),
          getProcessos().catch(() => []),
          getAllAgenda().catch(() => [])
        ]);

        setClientes(clientesData);
        setImoveis(imoveisData);
        setProcessos(processosData);
        setAgenda(agendaData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calcular metricas
  const clientesAtivos = clientes.filter((c) => c.role === "cliente").length;
  const imoveisCadastrados = imoveis.length;
  const processosAndamento = processos.filter((p) => p.status === "em_andamento").length;
  const reunioesMarcadas = agenda.filter(
    (a) => a.status !== "cancelado" && new Date(a.data) >= new Date()
  ).length;

  // Ultimos clientes
  const ultimosClientes = clientes
    .filter((c) => c.role === "cliente")
    .slice(0, 3)
    .map((c) => {
      const processo = processos.find((p) => p.cliente_id === c.id);
      return {
        ...c,
        etapa: processo?.etapa_atual || 1,
        status: processo?.status || "novo"
      };
    });

  // Proximas reunioes
  const proximasReunies = agenda
    .filter((a) => a.status !== "cancelado")
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
    .slice(0, 3)
    .map((a) => {
      const cliente = clientes.find((c) => c.id === a.cliente_id);
      return {
        ...a,
        clienteNome: cliente?.nome || "Cliente"
      };
    });

  const etapasNomes = [
    "Pre-analise",
    "Documentacao",
    "Validacao Bancaria",
    "Busca",
    "Visitas",
    "Negociacao",
    "Contrato"
  ];

  if (loading) {
    return (
      <AdminImobLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminImobLayout>
    );
  }

  return (
    <AdminImobLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard Administrativo</h1>
          <p className="text-muted-foreground">Visao geral da imobiliaria</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Clientes Ativos</p>
                  <p className="text-3xl font-bold text-foreground">{clientesAtivos}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-500">
                <TrendingUp className="w-4 h-4" />
                Dados em tempo real
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Imoveis Cadastrados</p>
                  <p className="text-3xl font-bold text-foreground">{imoveisCadastrados}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                {imoveis.filter((i) => i.disponivel).length} disponiveis
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Processos em Andamento</p>
                  <p className="text-3xl font-bold text-foreground">{processosAndamento}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <FileCheck className="w-6 h-6 text-orange-500" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                {processos.filter((p) => p.status === "pendente").length} pendentes
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Reunioes Marcadas</p>
                  <p className="text-3xl font-bold text-foreground">{reunioesMarcadas}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-500" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                Proximos dias
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Clients */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Ultimos Clientes</CardTitle>
              <Link to="/admin-imob/clientes">
                <Button variant="ghost" size="sm" className="gap-1">
                  Ver todos <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {ultimosClientes.length > 0 ? (
                <div className="space-y-4">
                  {ultimosClientes.map((cliente) => (
                    <div
                      key={cliente.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{cliente.nome}</p>
                          <p className="text-sm text-muted-foreground">{cliente.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            cliente.status === "em_andamento"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                              : "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          }`}
                        >
                          {cliente.status === "em_andamento" ? "Em Andamento" : "Novo"}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">
                          {etapasNomes[cliente.etapa - 1] || "Pre-analise"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">Nenhum cliente cadastrado</p>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Meetings */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Proximas Reunioes</CardTitle>
              <Link to="/admin-imob/agenda">
                <Button variant="ghost" size="sm" className="gap-1">
                  Ver agenda <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {proximasReunies.length > 0 ? (
                <div className="space-y-4">
                  {proximasReunies.map((reuniao) => (
                    <div
                      key={reuniao.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{reuniao.clienteNome}</p>
                          <p className="text-sm text-muted-foreground capitalize">{reuniao.tipo}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">
                          {new Date(reuniao.data).toLocaleDateString("pt-BR")}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 justify-end">
                          <Clock className="w-3 h-3" />
                          {reuniao.hora}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">Nenhuma reuniao agendada</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminImobLayout>
  );
};

export default AdminPainel;
