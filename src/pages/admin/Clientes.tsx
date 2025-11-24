import { useState } from "react";
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
import { Search, MoreVertical, Eye, Edit, Trash2, UserPlus, Phone, Mail } from "lucide-react";
import AdminImobLayout from "@/components/layout/AdminImobLayout";

// Mock data for clients
const clientesMock = [
  {
    id: 1,
    nome: "Maria Silva",
    email: "maria@email.com",
    telefone: "(11) 99999-1111",
    status: "em_andamento",
    etapa: "Validacao Bancaria",
    datacadastro: "2024-11-01"
  },
  {
    id: 2,
    nome: "Joao Santos",
    email: "joao@email.com",
    telefone: "(11) 99999-2222",
    status: "novo",
    etapa: "Pre-analise",
    datacastro: "2024-11-15"
  },
  {
    id: 3,
    nome: "Ana Costa",
    email: "ana@email.com",
    telefone: "(11) 99999-3333",
    status: "em_andamento",
    etapa: "Visitas",
    datacastro: "2024-10-20"
  },
  {
    id: 4,
    nome: "Pedro Lima",
    email: "pedro@email.com",
    telefone: "(11) 99999-4444",
    status: "concluido",
    etapa: "Contrato",
    datacastro: "2024-09-10"
  },
  {
    id: 5,
    nome: "Carla Mendes",
    email: "carla@email.com",
    telefone: "(11) 99999-5555",
    status: "em_andamento",
    etapa: "Documentacao",
    datacastro: "2024-11-10"
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "novo":
      return <Badge className="bg-green-500">Novo</Badge>;
    case "em_andamento":
      return <Badge className="bg-blue-500">Em Andamento</Badge>;
    case "concluido":
      return <Badge className="bg-gray-500">Concluido</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const AdminClientes = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClientes = clientesMock.filter(
    (cliente) =>
      cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <p className="text-2xl font-bold text-foreground">{clientesMock.length}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-500">
                {clientesMock.filter(c => c.status === 'novo').length}
              </p>
              <p className="text-sm text-muted-foreground">Novos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-500">
                {clientesMock.filter(c => c.status === 'em_andamento').length}
              </p>
              <p className="text-sm text-muted-foreground">Em Andamento</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-500">
                {clientesMock.filter(c => c.status === 'concluido').length}
              </p>
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
                          <p className="text-sm flex items-center gap-1 text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            {cliente.telefone}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(cliente.status)}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-foreground">{cliente.etapa}</span>
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
                            <DropdownMenuItem className="gap-2 text-red-500">
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
