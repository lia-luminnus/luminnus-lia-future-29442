import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, FileText, Building2, Clock, ArrowRight, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import ClienteLayout from "@/components/layout/ClienteLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getProcesso, getAgenda, type Processo, type AgendaEvento } from "@/services/api";

// Nomes das etapas do processo
const ETAPAS_NOMES = [
  "Pre-analise",
  "Documentacao",
  "Validacao Bancaria",
  "Busca",
  "Visitas",
  "Negociacao",
  "Contrato"
];

const ClienteDashboard = () => {
  const { clienteId, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [processo, setProcesso] = useState<Processo | null>(null);
  const [agenda, setAgenda] = useState<AgendaEvento[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!clienteId) {
        setLoading(false);
        return;
      }

      try {
        const [processoData, agendaData] = await Promise.all([
          getProcesso(clienteId).catch(() => null),
          getAgenda(clienteId).catch(() => [])
        ]);

        setProcesso(processoData);
        setAgenda(agendaData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [clienteId]);

  // Calcula progresso baseado na etapa atual
  const etapaAtual = processo?.etapa_atual || 1;
  const progresso = Math.round((etapaAtual / 7) * 100);

  // Filtra proximas visitas
  const proximasVisitas = agenda.filter(
    (e) => e.tipo === "visita" && e.status !== "cancelado"
  ).slice(0, 3);

  // Gera etapas do processo
  const etapasProcesso = ETAPAS_NOMES.map((nome, index) => ({
    id: index + 1,
    nome,
    completa: index + 1 < etapaAtual,
    atual: index + 1 === etapaAtual
  }));

  if (loading) {
    return (
      <ClienteLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </ClienteLayout>
    );
  }

  return (
    <ClienteLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Ola, {user?.user_metadata?.full_name || "Cliente"}! Acompanhe o status do seu processo imobiliario
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Etapa Atual</p>
                  <p className="text-lg font-semibold text-foreground">
                    {ETAPAS_NOMES[etapaAtual - 1] || "Pre-analise"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Progresso</p>
                  <p className="text-lg font-semibold text-foreground">{progresso}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Visitas Agendadas</p>
                  <p className="text-lg font-semibold text-foreground">{proximasVisitas.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-lg font-semibold text-foreground capitalize">
                    {processo?.status?.replace("_", " ") || "Em andamento"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Process Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Linha do Processo</span>
              <Link to="/cliente/status">
                <Button variant="ghost" size="sm" className="gap-1">
                  Ver detalhes <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Progress value={progresso} className="h-2" />
            </div>
            <div className="flex justify-between overflow-x-auto pb-2">
              {etapasProcesso.map((etapa, index) => (
                <div key={etapa.id} className="flex flex-col items-center min-w-[80px]">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      etapa.completa
                        ? "bg-green-500 text-white"
                        : etapa.atual
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {etapa.completa ? <CheckCircle className="w-4 h-4" /> : index + 1}
                  </div>
                  <p className={`text-xs mt-2 text-center ${etapa.atual ? "text-primary font-medium" : "text-muted-foreground"}`}>
                    {etapa.nome}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Proximas Visitas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Proximas Visitas</span>
                <Link to="/cliente/agenda">
                  <Button variant="ghost" size="sm" className="gap-1">
                    Ver agenda <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {proximasVisitas.length > 0 ? (
                <div className="space-y-3">
                  {proximasVisitas.map((visita) => (
                    <div
                      key={visita.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {visita.descricao || "Visita agendada"}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {new Date(visita.data).toLocaleDateString("pt-BR")} as {visita.hora}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Nenhuma visita agendada
                </p>
              )}
            </CardContent>
          </Card>

          {/* Observacoes do Processo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Observacoes</span>
                <Link to="/cliente/status">
                  <Button variant="ghost" size="sm" className="gap-1">
                    Ver status <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {processo?.observacoes ? (
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-foreground">{processo.observacoes}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Atualizado em {new Date(processo.updated_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Nenhuma observacao registrada
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ClienteLayout>
  );
};

export default ClienteDashboard;
