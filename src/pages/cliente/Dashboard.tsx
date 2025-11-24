import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, FileText, Building2, Clock, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import ClienteLayout from "@/components/layout/ClienteLayout";

// Mock data
const statusProcesso = {
  etapaAtual: 3,
  totalEtapas: 7,
  etapaNome: "Validacao Bancaria",
  progresso: 43
};

const proximasVisitas = [
  { id: 1, imovel: "Apartamento Centro", data: "25/11/2024", hora: "14:00" },
  { id: 2, imovel: "Casa Jardins", data: "27/11/2024", hora: "10:00" },
];

const documentosPendentes = [
  { id: 1, nome: "Comprovante de Renda", status: "pendente" },
  { id: 2, nome: "RG/CPF", status: "aprovado" },
  { id: 3, nome: "Comprovante de Residencia", status: "pendente" },
];

const etapasProcesso = [
  { id: 1, nome: "Pre-analise", completa: true },
  { id: 2, nome: "Documentacao", completa: true },
  { id: 3, nome: "Validacao Bancaria", completa: false, atual: true },
  { id: 4, nome: "Busca", completa: false },
  { id: 5, nome: "Visitas", completa: false },
  { id: 6, nome: "Negociacao", completa: false },
  { id: 7, nome: "Contrato", completa: false },
];

const ClienteDashboard = () => {
  return (
    <ClienteLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Acompanhe o status do seu processo imobiliario</p>
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
                  <p className="text-lg font-semibold text-foreground">{statusProcesso.etapaNome}</p>
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
                  <p className="text-lg font-semibold text-foreground">{statusProcesso.progresso}%</p>
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
                  <p className="text-sm text-muted-foreground">Docs Pendentes</p>
                  <p className="text-lg font-semibold text-foreground">
                    {documentosPendentes.filter(d => d.status === 'pendente').length}
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
              <Progress value={statusProcesso.progresso} className="h-2" />
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
                        <p className="font-medium text-foreground">{visita.imovel}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {visita.data} as {visita.hora}
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

          {/* Documentos Pendentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Documentos</span>
                <Link to="/cliente/meus-dados">
                  <Button variant="ghost" size="sm" className="gap-1">
                    Ver todos <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documentosPendentes.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <span className="text-foreground">{doc.nome}</span>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        doc.status === "aprovado"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400"
                      }`}
                    >
                      {doc.status === "aprovado" ? "Aprovado" : "Pendente"}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ClienteLayout>
  );
};

export default ClienteDashboard;
