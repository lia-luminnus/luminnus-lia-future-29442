import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building2, FileCheck, Calendar, TrendingUp, ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import AdminImobLayout from "@/components/layout/AdminImobLayout";

// Mock data for metrics
const metricas = {
  clientesAtivos: 24,
  imoveisCadastrados: 156,
  processosAndamento: 18,
  reunioesMarcadas: 7
};

const ultimosClientes = [
  { id: 1, nome: "Maria Silva", email: "maria@email.com", status: "em_andamento", etapa: "Validacao Bancaria" },
  { id: 2, nome: "Joao Santos", email: "joao@email.com", status: "novo", etapa: "Pre-analise" },
  { id: 3, nome: "Ana Costa", email: "ana@email.com", status: "em_andamento", etapa: "Visitas" },
];

const proximasReunies = [
  { id: 1, cliente: "Maria Silva", tipo: "Visita", data: "25/11/2024", hora: "14:00" },
  { id: 2, cliente: "Pedro Lima", tipo: "Reuniao", data: "25/11/2024", hora: "16:00" },
  { id: 3, cliente: "Ana Costa", tipo: "Visita", data: "26/11/2024", hora: "10:00" },
];

const AdminPainel = () => {
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
                  <p className="text-3xl font-bold text-foreground">{metricas.clientesAtivos}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-500">
                <TrendingUp className="w-4 h-4" />
                +12% este mes
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Imoveis Cadastrados</p>
                  <p className="text-3xl font-bold text-foreground">{metricas.imoveisCadastrados}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-500">
                <TrendingUp className="w-4 h-4" />
                +8 novos
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Processos em Andamento</p>
                  <p className="text-3xl font-bold text-foreground">{metricas.processosAndamento}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <FileCheck className="w-6 h-6 text-orange-500" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                5 aguardando acao
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Reunioes Marcadas</p>
                  <p className="text-3xl font-bold text-foreground">{metricas.reunioesMarcadas}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-500" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                Proximos 7 dias
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
                          cliente.status === "novo"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                        }`}
                      >
                        {cliente.status === "novo" ? "Novo" : "Em Andamento"}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">{cliente.etapa}</p>
                    </div>
                  </div>
                ))}
              </div>
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
                        <p className="font-medium text-foreground">{reuniao.cliente}</p>
                        <p className="text-sm text-muted-foreground">{reuniao.tipo}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">{reuniao.data}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3" />
                        {reuniao.hora}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminImobLayout>
  );
};

export default AdminPainel;
