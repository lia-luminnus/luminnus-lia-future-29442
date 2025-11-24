import { useState, useEffect } from "react";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Edit, Trash2, MapPin, Bed, Bath, Square, Eye, Loader2 } from "lucide-react";
import AdminImobLayout from "@/components/layout/AdminImobLayout";
import { getImoveis, createImovel, updateImovel, deleteImovel, type Imovel } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const formatPrice = (price: number) => {
  return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const getStatusBadge = (disponivel: boolean) => {
  return disponivel ? (
    <Badge className="bg-green-500">Disponivel</Badge>
  ) : (
    <Badge className="bg-gray-500">Indisponivel</Badge>
  );
};

const AdminImoveis = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [selectedImovel, setSelectedImovel] = useState<Imovel | null>(null);
  const [formData, setFormData] = useState({
    titulo: "",
    tipologia: "Apartamento",
    localizacao: "",
    preco: "",
    quartos: "",
    banheiros: "",
    area: "",
    disponivel: true,
    descricao: ""
  });

  useEffect(() => {
    loadImoveis();
  }, []);

  const loadImoveis = async () => {
    try {
      const data = await getImoveis();
      setImoveis(data);
    } catch (error) {
      console.error("Erro ao carregar imoveis:", error);
      toast({
        title: "Erro",
        description: "Nao foi possivel carregar os imoveis",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (imovel: Imovel) => {
    setSelectedImovel(imovel);
    setFormData({
      titulo: imovel.titulo,
      tipologia: imovel.tipologia || "Apartamento",
      localizacao: imovel.localizacao,
      preco: String(imovel.preco),
      quartos: String(imovel.quartos || 0),
      banheiros: String(imovel.banheiros || 0),
      area: String(imovel.area || 0),
      disponivel: imovel.disponivel,
      descricao: imovel.descricao || ""
    });
    setIsDialogOpen(true);
  };

  const handleNew = () => {
    setSelectedImovel(null);
    setFormData({
      titulo: "",
      tipologia: "Apartamento",
      localizacao: "",
      preco: "",
      quartos: "",
      banheiros: "",
      area: "",
      disponivel: true,
      descricao: ""
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.titulo || !formData.localizacao || !formData.preco) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatorios",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);

    try {
      const imovelData = {
        titulo: formData.titulo,
        tipologia: formData.tipologia,
        localizacao: formData.localizacao,
        preco: Number(formData.preco),
        quartos: Number(formData.quartos) || 0,
        banheiros: Number(formData.banheiros) || 0,
        area: Number(formData.area) || 0,
        disponivel: formData.disponivel,
        descricao: formData.descricao
      };

      if (selectedImovel) {
        const updated = await updateImovel(selectedImovel.id, imovelData);
        setImoveis((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
        toast({ title: "Sucesso", description: "Imovel atualizado!" });
      } else {
        const created = await createImovel(imovelData);
        setImoveis((prev) => [created, ...prev]);
        toast({ title: "Sucesso", description: "Imovel criado!" });
      }

      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Nao foi possivel salvar o imovel",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este imovel?")) return;

    try {
      await deleteImovel(id);
      setImoveis((prev) => prev.filter((i) => i.id !== id));
      toast({ title: "Sucesso", description: "Imovel excluido!" });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Nao foi possivel excluir o imovel",
        variant: "destructive"
      });
    }
  };

  const filteredImoveis = imoveis.filter(
    (imovel) =>
      imovel.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      imovel.localizacao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Estatisticas
  const totalImoveis = imoveis.length;
  const disponiveis = imoveis.filter((i) => i.disponivel).length;
  const indisponiveis = imoveis.filter((i) => !i.disponivel).length;

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
            <h1 className="text-2xl font-bold text-foreground">Imoveis</h1>
            <p className="text-muted-foreground">Gerencie o catalogo de imoveis</p>
          </div>
          <Button className="gap-2" onClick={handleNew}>
            <Plus className="w-4 h-4" />
            Novo Imovel
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{totalImoveis}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-500">{disponiveis}</p>
              <p className="text-sm text-muted-foreground">Disponiveis</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-500">{indisponiveis}</p>
              <p className="text-sm text-muted-foreground">Indisponiveis</p>
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
            {filteredImoveis.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredImoveis.map((imovel) => (
                  <Card key={imovel.id} className="overflow-hidden">
                    <div className="relative h-40 overflow-hidden bg-muted">
                      {imovel.fotos && imovel.fotos.length > 0 ? (
                        <img
                          src={imovel.fotos[0]}
                          alt={imovel.titulo}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <MapPin className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2">
                        {getStatusBadge(imovel.disponivel)}
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary">{imovel.tipologia || "Imovel"}</Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground mb-1">{imovel.titulo}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                        <MapPin className="w-3 h-3" />
                        {imovel.localizacao}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Bed className="w-3 h-3" /> {imovel.quartos || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="w-3 h-3" /> {imovel.banheiros || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Square className="w-3 h-3" /> {imovel.area || 0}m2
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
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500"
                          onClick={() => handleDelete(imovel.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
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
              <DialogTitle>{selectedImovel ? "Editar Imovel" : "Novo Imovel"}</DialogTitle>
              <DialogDescription>Preencha os dados do imovel abaixo</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Titulo *</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Nome do imovel"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select
                    value={formData.tipologia}
                    onValueChange={(value) => setFormData({ ...formData, tipologia: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Apartamento">Apartamento</SelectItem>
                      <SelectItem value="Casa">Casa</SelectItem>
                      <SelectItem value="Cobertura">Cobertura</SelectItem>
                      <SelectItem value="Studio">Studio</SelectItem>
                      <SelectItem value="Terreno">Terreno</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endereco">Localizacao *</Label>
                <Input
                  id="endereco"
                  value={formData.localizacao}
                  onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                  placeholder="Endereco completo"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preco">Preco (R$) *</Label>
                  <Input
                    id="preco"
                    type="number"
                    value={formData.preco}
                    onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quartos">Quartos</Label>
                  <Input
                    id="quartos"
                    type="number"
                    value={formData.quartos}
                    onChange={(e) => setFormData({ ...formData, quartos: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="banheiros">Banheiros</Label>
                  <Input
                    id="banheiros"
                    type="number"
                    value={formData.banheiros}
                    onChange={(e) => setFormData({ ...formData, banheiros: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Area (m2)</Label>
                  <Input
                    id="area"
                    type="number"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.disponivel ? "disponivel" : "indisponivel"}
                  onValueChange={(value) =>
                    setFormData({ ...formData, disponivel: value === "disponivel" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponivel">Disponivel</SelectItem>
                    <SelectItem value="indisponivel">Indisponivel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descricao</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descricao do imovel..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : selectedImovel ? (
                  "Salvar"
                ) : (
                  "Criar"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminImobLayout>
  );
};

export default AdminImoveis;
