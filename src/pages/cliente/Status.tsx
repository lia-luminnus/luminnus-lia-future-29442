import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Clock, FileText, AlertCircle } from "lucide-react";
import ClienteLayout from "@/components/layout/ClienteLayout";

// Mock data for process status
const etapasProcesso = [
  {
    id: 1,
    nome: "Pre-analise",
    descricao: "Analise inicial do perfil e objetivos do cliente",
    status: "completa",
    dataInicio: "2024-11-01",
    dataConclusao: "2024-11-03",
    observacoes: "Perfil aprovado para financiamento"
  },
  {
    id: 2,
    nome: "Documentacao",
    descricao: "Coleta e verificacao de documentos necessarios",
    status: "completa",
    dataInicio: "2024-11-04",
    dataConclusao: "2024-11-10",
    observacoes: "Todos os documentos verificados"
  },
  {
    id: 3,
    nome: "Validacao Bancaria",
    descricao: "Analise de credito e aprovacao junto ao banco",
    status: "em_andamento",
    dataInicio: "2024-11-11",
    dataConclusao: null,
    observacoes: "Aguardando retorno do banco - previsao: 5 dias uteis"
  },
  {
    id: 4,
    nome: "Busca de Imoveis",
    descricao: "Selecao de imoveis conforme o perfil aprovado",
    status: "pendente",
    dataInicio: null,
    dataConclusao: null,
    observacoes: null
  },
  {
    id: 5,
    nome: "Visitas",
    descricao: "Agendamento e realizacao de visitas aos imoveis",
    status: "pendente",
    dataInicio: null,
    dataConclusao: null,
    observacoes: null
  },
  {
    id: 6,
    nome: "Negociacao",
    descricao: "Negociacao de valores e condicoes com o vendedor",
    status: "pendente",
    dataInicio: null,
    dataConclusao: null,
    observacoes: null
  },
  {
    id: 7,
    nome: "Contrato",
    descricao: "Assinatura do contrato e transferencia do imovel",
    status: "pendente",
    dataInicio: null,
    dataConclusao: null,
    observacoes: null
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completa":
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    case "em_andamento":
      return <Clock className="w-6 h-6 text-primary animate-pulse" />;
    default:
      return <Circle className="w-6 h-6 text-muted-foreground" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completa":
      return <Badge className="bg-green-500">Concluida</Badge>;
    case "em_andamento":
      return <Badge className="bg-primary">Em Andamento</Badge>;
    default:
      return <Badge variant="secondary">Pendente</Badge>;
  }
};

const ClienteStatus = () => {
  const etapaAtual = etapasProcesso.find(e => e.status === "em_andamento");
  const etapasConcluidas = etapasProcesso.filter(e => e.status === "completa").length;
  const progressoPercentual = Math.round((etapasConcluidas / etapasProcesso.length) * 100);

  return (
    <ClienteLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Status do Processo</h1>
          <p className="text-muted-foreground">Acompanhe cada etapa do seu processo imobiliario</p>
        </div>

        {/* Summary Card */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">{progressoPercentual}%</p>
                <p className="text-sm text-muted-foreground">Progresso Total</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-foreground">{etapasConcluidas}/{etapasProcesso.length}</p>
                <p className="text-sm text-muted-foreground">Etapas Concluidas</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-foreground">{etapaAtual?.nome || "N/A"}</p>
                <p className="text-sm text-muted-foreground">Etapa Atual</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Process Pipeline */}
        <Card>
          <CardHeader>
            <CardTitle>Pipeline do Processo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {etapasProcesso.map((etapa, index) => (
                <div key={etapa.id} className="flex gap-4 pb-8 last:pb-0">
                  {/* Timeline */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        etapa.status === "completa"
                          ? "bg-green-100 dark:bg-green-900/20"
                          : etapa.status === "em_andamento"
                          ? "bg-primary/20"
                          : "bg-muted"
                      }`}
                    >
                      {getStatusIcon(etapa.status)}
                    </div>
                    {index < etapasProcesso.length - 1 && (
                      <div
                        className={`w-0.5 flex-1 mt-2 ${
                          etapa.status === "completa"
                            ? "bg-green-500"
                            : "bg-muted"
                        }`}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {etapa.id}. {etapa.nome}
                      </h3>
                      {getStatusBadge(etapa.status)}
                    </div>
                    <p className="text-muted-foreground mb-3">{etapa.descricao}</p>

                    {(etapa.dataInicio || etapa.observacoes) && (
                      <div className="bg-muted/50 rounded-lg p-3 space-y-2 text-sm">
                        {etapa.dataInicio && (
                          <p className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Inicio:</span>
                            <span className="text-foreground">
                              {new Date(etapa.dataInicio).toLocaleDateString('pt-BR')}
                            </span>
                            {etapa.dataConclusao && (
                              <>
                                <span className="text-muted-foreground">| Conclusao:</span>
                                <span className="text-foreground">
                                  {new Date(etapa.dataConclusao).toLocaleDateString('pt-BR')}
                                </span>
                              </>
                            )}
                          </p>
                        )}
                        {etapa.observacoes && (
                          <p className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <span className="text-foreground">{etapa.observacoes}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ClienteLayout>
  );
};

export default ClienteStatus;
