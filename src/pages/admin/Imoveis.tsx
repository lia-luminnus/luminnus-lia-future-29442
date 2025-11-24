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
import { Search, Plus, Edit, Trash2, MapPin, Bed, Bath, Square, Eye, Building2, Upload, X } from "lucide-react";
import AdminImobLayout from "@/components/layout/AdminImobLayout";
import { getImoveis, createImovel, updateImovel, deleteImovel, uploadImovelFoto, deleteImovelFoto, type Imovel } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/ui/Loading";
import EmptyState from "@/components/ui/EmptyState";
import MotionPageTransition, { StaggeredMotionContainer, StaggeredItem, HoverCardAnimation } from "@/components/layout/MotionPageTransition";

const formatPrice = (price: number) => {
  return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const getStatusBadge = (disponivel: boolean) => {
  return disponivel ? (
    <Badge className="bg-[var(--lum-success)] hover:bg-[var(--lum-success)]/90 shadow-sm">Disponivel</Badge>
  ) : (
    <Badge className="bg-gray-500 hover:bg-gray-500/90 shadow-sm">Indisponivel</Badge>
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
    descricao: "",
    fotos: [] as string[]
  });
  const [uploadingFoto, setUploadingFoto] = useState(false);

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
      descricao: imovel.descricao || "",
      fotos: imovel.fotos || []
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
      descricao: "",
      fotos: []
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
        descricao: formData.descricao,
        fotos: formData.fotos
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

  const handleFotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validação de tipo
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      toast({
        title: "Erro",
        description: "Apenas arquivos JPG, PNG e WEBP são permitidos",
        variant: "destructive"
      });
      return;
    }

    // Validação de tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 5MB",
        variant: "destructive"
      });
      return;
    }

    setUploadingFoto(true);
    try {
      const tempId = selectedImovel?.id || 'temp-' + Date.now();
      const url = await uploadImovelFoto(file, tempId);
      setFormData({ ...formData, fotos: [...formData.fotos, url] });
      toast({ title: "Sucesso", description: "Foto adicionada!" });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível fazer upload da foto",
        variant: "destructive"
      });
    } finally {
      setUploadingFoto(false);
    }
  };

  const handleRemoverFoto = async (url: string) => {
    try {
      await deleteImovelFoto(url);
      setFormData({ ...formData, fotos: formData.fotos.filter(f => f !== url) });
      toast({ title: "Sucesso", description: "Foto removida!" });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover a foto",
        variant: "destructive"
      });
    }
  };

  // Estatisticas
  const totalImoveis = imoveis.length;
  const disponiveis = imoveis.filter((i) => i.disponivel).length;
  const indisponiveis = imoveis.filter((i) => !i.disponivel).length;

  if (loading) {
    return (
      <AdminImobLayout>
        <Loading message="Carregando imoveis..." size="lg" variant="dots" />
      </AdminImobLayout>
    );
  }

  return (
    <AdminImobLayout>
      <MotionPageTransition>
        <div className="p-6 lg:p-8 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">Imoveis</h1>
              <p className="text-muted-foreground mt-1">Gerencie o catalogo de imoveis</p>
            </div>
            <Button className="gap-2 shadow-luminnus" onClick={handleNew} size="lg">
              <Plus className="w-5 h-5" />
              Novo Imovel
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <HoverCardAnimation>
              <Card className="border-0 shadow-[var(--shadow-md)] bg-gradient-to-br from-[#7B2FF7]/5 to-transparent">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#7B2FF7]/10 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-[#7B2FF7]" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-foreground">{totalImoveis}</p>
                      <p className="text-sm text-muted-foreground">Total de Imoveis</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </HoverCardAnimation>
            <HoverCardAnimation>
              <Card className="border-0 shadow-[var(--shadow-md)] bg-gradient-to-br from-green-500/5 to-transparent">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-green-500">{disponiveis}</p>
                      <p className="text-sm text-muted-foreground">Disponiveis</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </HoverCardAnimation>
            <HoverCardAnimation>
              <Card className="border-0 shadow-[var(--shadow-md)] bg-gradient-to-br from-gray-500/5 to-transparent">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-500/10 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-gray-500">{indisponiveis}</p>
                      <p className="text-sm text-muted-foreground">Indisponiveis</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </HoverCardAnimation>
          </div>

          {/* Search */}
          <Card className="border-0 shadow-[var(--shadow-md)]">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <CardTitle className="flex-1 text-lg">Catalogo de Imoveis</CardTitle>
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar imovel..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-11 bg-muted/50 border-0"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredImoveis.length > 0 ? (
                <StaggeredMotionContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredImoveis.map((imovel) => (
                    <StaggeredItem key={imovel.id}>
                      <HoverCardAnimation>
                        <Card className="overflow-hidden border border-[var(--lum-border)] dark:border-[var(--lum-border-dark)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)] transition-all duration-[var(--transition-smooth)]">
                          <div className="relative h-44 overflow-hidden bg-muted">
                            {imovel.fotos && imovel.fotos.length > 0 ? (
                              <img
                                src={imovel.fotos[0]}
                                alt={imovel.titulo}
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                                <MapPin className="w-12 h-12 text-muted-foreground" />
                              </div>
                            )}
                            <div className="absolute top-3 left-3">
                              {getStatusBadge(imovel.disponivel)}
                            </div>
                            <div className="absolute top-3 right-3">
                              <Badge variant="secondary" className="backdrop-blur-sm bg-white/80 dark:bg-black/50 shadow-sm">
                                {imovel.tipologia || "Imovel"}
                              </Badge>
                            </div>
                          </div>
                          <CardContent className="p-5">
                            <h3 className="font-semibold text-foreground mb-2 line-clamp-1">{imovel.titulo}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-3">
                              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="line-clamp-1">{imovel.localizacao}</span>
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                              <span className="flex items-center gap-1.5">
                                <Bed className="w-4 h-4" /> {imovel.quartos || 0}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Bath className="w-4 h-4" /> {imovel.banheiros || 0}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Square className="w-4 h-4" /> {imovel.area || 0}m2
                              </span>
                            </div>
                            <p className="text-xl font-bold text-[#7B2FF7] mb-4">
                              {formatPrice(imovel.preco)}
                            </p>
                            <div className="flex gap-2">
                              <Button variant="secondary" size="sm" className="flex-1 gap-1.5">
                                <Eye className="w-4 h-4" />
                                Ver
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 gap-1.5"
                                onClick={() => handleEdit(imovel)}
                              >
                                <Edit className="w-4 h-4" />
                                Editar
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                onClick={() => handleDelete(imovel.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </HoverCardAnimation>
                    </StaggeredItem>
                  ))}
                </StaggeredMotionContainer>
              ) : (
                <EmptyState
                  variant="search"
                  message="Nenhum imovel encontrado com os filtros aplicados."
                  action={{
                    label: "Limpar busca",
                    onClick: () => setSearchTerm("")
                  }}
                />
              )}
            </CardContent>
          </Card>

          {/* Add/Edit Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedImovel ? "Editar Imovel" : "Novo Imovel"}</DialogTitle>
                <DialogDescription>Preencha os dados do imovel abaixo</DialogDescription>
              </DialogHeader>
              <div className="grid gap-5 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
                    className="resize-none"
                  />
                </div>

                {/* EDITOR DE FOTOS */}
                <div className="space-y-3">
                  <Label>Fotos do Imóvel</Label>
                  
                  {/* Galeria de fotos */}
                  {formData.fotos.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      {formData.fotos.map((foto, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={foto} 
                            alt={`Foto ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-border"
                          />
                          {index === 0 && (
                            <div className="absolute top-1 left-1 bg-[#8A2FFF] text-white text-xs px-2 py-0.5 rounded">
                              Capa
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoverFoto(foto)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload button */}
                  <div className="flex items-center gap-2">
                    <Input
                      id="foto-upload"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleFotoUpload}
                      disabled={uploadingFoto}
                      className="hidden"
                    />
                    <Label
                      htmlFor="foto-upload"
                      className="flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-[#8A2FFF]/30 rounded-lg p-4 cursor-pointer hover:border-[#8A2FFF]/60 transition-colors"
                    >
                      <Upload className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {uploadingFoto ? 'Enviando...' : 'Clique para adicionar foto'}
                      </span>
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Formatos: JPG, PNG, WEBP • Tamanho máximo: 5MB • A primeira foto será a capa
                  </p>
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Salvando..." : selectedImovel ? "Salvar" : "Criar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </MotionPageTransition>
    </AdminImobLayout>
  );
};

export default AdminImoveis;
