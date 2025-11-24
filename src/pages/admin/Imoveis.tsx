import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Edit, Trash2, MapPin, Bed, Bath, Square, Eye } from "lucide-react";
import AdminImobLayout from "@/components/layout/AdminImobLayout";

// Mock data for properties
const imoveisMock = [
  {
    id: 1,
    titulo: "Apartamento Moderno Centro",
    tipo: "Apartamento",
    endereco: "Centro, Sao Paulo - SP",
    preco: 450000,
    quartos: 2,
    banheiros: 1,
    area: 65,
    status: "disponivel",
    imagem: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    titulo: "Casa com Jardim",
    tipo: "Casa",
    endereco: "Jardins, Sao Paulo - SP",
    preco: 850000,
    quartos: 3,
    banheiros: 2,
    area: 150,
    status: "disponivel",
    imagem: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    titulo: "Cobertura Duplex",
    tipo: "Cobertura",
    endereco: "Moema, Sao Paulo - SP",
    preco: 1200000,
    quartos: 4,
    banheiros: 3,
    area: 220,
    status: "reservado",
    imagem: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop"
  },
  {
    id: 4,
    titulo: "Studio Compacto",
    tipo: "Studio",
    endereco: "Pinheiros, Sao Paulo - SP",
    preco: 280000,
    quartos: 1,
    banheiros: 1,
    area: 35,
    status: "vendido",
    imagem: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop"
  },
];

const formatPrice = (price: number) => {
  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "disponivel":
      return <Badge className="bg-green-500">Disponivel</Badge>;
    case "reservado":
      return <Badge className="bg-orange-500">Reservado</Badge>;
    case "vendido":
      return <Badge className="bg-gray-500">Vendido</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const AdminImoveis = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImovel, setSelectedImovel] = useState<typeof imoveisMock[0] | null>(null);

  const filteredImoveis = imoveisMock.filter(
    (imovel) =>
      imovel.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      imovel.endereco.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (imovel: typeof imoveisMock[0]) => {
    setSelectedImovel(imovel);
    setIsDialogOpen(true);
  };

  const handleNew = () => {
    setSelectedImovel(null);
    setIsDialogOpen(true);
  };

  return (
    <AdminImobLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Imoveis</h1>
            <p className="text-muted-foreground">Gerencie o catalogo de imoveis</p>
          </div>
          <Button className="gap-2" onClick={handleNew}>
            <Plus className="w-4 h-4" />
            Novo Imovel
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{imoveisMock.length}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-500">
                {imoveisMock.filter(i => i.status === 'disponivel').length}
              </p>
              <p className="text-sm text-muted-foreground">Disponiveis</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-orange-500">
                {imoveisMock.filter(i => i.status === 'reservado').length}
              </p>
              <p className="text-sm text-muted-foreground">Reservados</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-500">
                {imoveisMock.filter(i => i.status === 'vendido').length}
              </p>
              <p className="text-sm text-muted-foreground">Vendidos</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <CardTitle className="flex-1">Catalogo de Imoveis</CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar imovel..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredImoveis.map((imovel) => (
                <Card key={imovel.id} className="overflow-hidden">
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={imovel.imagem}
                      alt={imovel.titulo}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      {getStatusBadge(imovel.status)}
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary">{imovel.tipo}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground mb-1">{imovel.titulo}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3" />
                      {imovel.endereco}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Bed className="w-3 h-3" /> {imovel.quartos}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="w-3 h-3" /> {imovel.banheiros}
                      </span>
                      <span className="flex items-center gap-1">
                        <Square className="w-3 h-3" /> {imovel.area}m²
                      </span>
                    </div>
                    <p className="text-lg font-bold text-primary mb-3">
                      {formatPrice(imovel.preco)}
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 gap-1">
                        <Eye className="w-4 h-4" />
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1"
                        onClick={() => handleEdit(imovel)}
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredImoveis.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum imovel encontrado
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedImovel ? "Editar Imovel" : "Novo Imovel"}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados do imovel abaixo
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Titulo</Label>
                  <Input
                    id="titulo"
                    defaultValue={selectedImovel?.titulo}
                    placeholder="Nome do imovel"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select defaultValue={selectedImovel?.tipo || "Apartamento"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Apartamento">Apartamento</SelectItem>
                      <SelectItem value="Casa">Casa</SelectItem>
                      <SelectItem value="Cobertura">Cobertura</SelectItem>
                      <SelectItem value="Studio">Studio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereco</Label>
                <Input
                  id="endereco"
                  defaultValue={selectedImovel?.endereco}
                  placeholder="Endereco completo"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preco">Preco (R$)</Label>
                  <Input
                    id="preco"
                    type="number"
                    defaultValue={selectedImovel?.preco}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quartos">Quartos</Label>
                  <Input
                    id="quartos"
                    type="number"
                    defaultValue={selectedImovel?.quartos}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="banheiros">Banheiros</Label>
                  <Input
                    id="banheiros"
                    type="number"
                    defaultValue={selectedImovel?.banheiros}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Area (m²)</Label>
                  <Input
                    id="area"
                    type="number"
                    defaultValue={selectedImovel?.area}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={selectedImovel?.status || "disponivel"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponivel">Disponivel</SelectItem>
                    <SelectItem value="reservado">Reservado</SelectItem>
                    <SelectItem value="vendido">Vendido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descricao</Label>
                <Textarea
                  id="descricao"
                  placeholder="Descricao do imovel..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>
                {selectedImovel ? "Salvar" : "Criar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminImobLayout>
  );
};

export default AdminImoveis;
