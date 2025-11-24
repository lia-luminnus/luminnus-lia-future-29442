import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreVertical, Eye, Edit, Trash2, UserPlus, Phone, Mail, Loader2 } from "lucide-react";
import AdminImobLayout from "@/components/layout/AdminImobLayout";
import { getClientes, getProcessos, deleteCliente, type Cliente, type Processo } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const ETAPAS_NOMES = [
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
    case "em_andamento":
      return <Badge className="bg-blue-500">Em Andamento</Badge>;
    case "concluido":
      return <Badge className="bg-gray-500">Concluido</Badge>;
    case "pendente":
      return <Badge className="bg-orange-500">Pendente</Badge>;
    default:
      return <Badge className="bg-green-500">Novo</Badge>;
  }
};

const AdminClientes = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [clientes, setClientes] = useState<(Cliente & { processo?: Processo })[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [clientesData, processosData] = await Promise.all([
        getClientes(),
        getProcessos().catch(() => [])
      ]);

      // Combinar clientes com seus processos
      const clientesComProcesso = clientesData
        .filter((c) => c.role === "cliente")
        .map((cliente) => ({
          ...cliente,
          processo: processosData.find((p) => p.cliente_id === cliente.id)
        }));

      setClientes(clientesComProcesso);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      toast({
        title: "Erro",
        description: "Nao foi possivel carregar os clientes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este cliente?")) return;

    try {
      await deleteCliente(id);
      setClientes((prev) => prev.filter((c) => c.id !== id));
      toast({
        title: "Sucesso",
        description: "Cliente excluido com sucesso"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Nao foi possivel excluir o cliente",
        variant: "destructive"
      });
    }
  };

  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular estatisticas
  const totalClientes = clientes.length;
  const novos = clientes.filter((c) => !c.processo).length;
  const emAndamento = clientes.filter((c) => c.processo?.status === "em_andamento").length;
  const concluidos = clientes.filter((c) => c.processo?.status === "concluido").length;

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
            <p className="text-muted-foreground">Gerencie os clientes da imobiliaria</p>
          </div>
          <Button className="gap-2">
            <UserPlus className="w-4 h-4" />
            Novo Cliente
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{totalClientes}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-500">{novos}</p>
              <p className="text-sm text-muted-foreground">Novos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-500">{emAndamento}</p>
              <p className="text-sm text-muted-foreground">Em Andamento</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-500">{concluidos}</p>
              <p className="text-sm text-muted-foreground">Concluidos</p>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <CardTitle className="flex-1">Lista de Clientes</CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Etapa</TableHead>
                    <TableHead className="text-right">Acoes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClientes.map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell>
                        <p className="font-medium text-foreground">{cliente.nome}</p>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm flex items-center gap-1 text-muted-foreground">
                            <Mail className="w-3 h-3" />
                            {cliente.email}
                          </p>
                          {cliente.telefone && (
                            <p className="text-sm flex items-center gap-1 text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              {cliente.telefone}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(cliente.processo?.status || "novo")}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-foreground">
                          {cliente.processo
                            ? ETAPAS_NOMES[cliente.processo.etapa_atual - 1] || "Pre-analise"
                            : "Aguardando"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2">
                              <Eye className="w-4 h-4" />
                              Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Edit className="w-4 h-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="gap-2 text-red-500"
                              onClick={() => handleDelete(cliente.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredClientes.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum cliente encontrado
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminImobLayout>
  );
};

export default AdminClientes;
