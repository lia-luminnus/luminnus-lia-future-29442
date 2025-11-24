import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Phone, Mail, MapPin, Home, DollarSign, Calendar, Sparkles } from "lucide-react";
import AdminImobLayout from "@/components/layout/AdminImobLayout";
import { getBuscasClientes, type BuscaCliente } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Loading from "@/components/ui/Loading";
import EmptyState from "@/components/ui/EmptyState";

const formatPrice = (price: number | null) => {
  if (!price) return "-";
  return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const AdminBuscas = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [buscas, setBuscas] = useState<BuscaCliente[]>([]);

  useEffect(() => {
    loadBuscas();

    // Setup realtime subscription
    const channel = supabase
      .channel('buscas-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'buscas_clientes'
        },
        (payload) => {
          console.log('Nova busca recebida:', payload);
          const novaBusca = payload.new as BuscaCliente;
          setBuscas((prev) => [novaBusca, ...prev]);
          toast({
            title: "Nova busca recebida!",
            description: `${novaBusca.nome || "Cliente"} está buscando imóvel em ${novaBusca.localizacao || "localização não especificada"}`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const loadBuscas = async () => {
    try {
      const data = await getBuscasClientes();
      setBuscas(data);
    } catch (error) {
      console.error("Erro ao carregar buscas:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as buscas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredBuscas = buscas.filter(
    (busca) =>
      (busca.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
      (busca.email?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
      (busca.localizacao?.toLowerCase().includes(searchTerm.toLowerCase()) || "")
  );

  const isNova = (createdAt: string) => {
    const diff = Date.now() - new Date(createdAt).getTime();
    return diff < 24 * 60 * 60 * 1000; // Menos de 24h
  };

  // Estatísticas
  const totalBuscas = buscas.length;
  const novas = buscas.filter((b) => isNova(b.created_at!)).length;

  if (loading) {
    return (
      <AdminImobLayout>
        <Loading message="Carregando buscas..." size="lg" variant="dots" />
      </AdminImobLayout>
    );
  }

  return (
    <AdminImobLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Buscas de Clientes
          </h1>
          <p className="text-muted-foreground">Veja em tempo real o que os clientes estão procurando</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Search className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">{totalBuscas}</p>
                  <p className="text-sm text-muted-foreground">Total de Buscas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-500">{novas}</p>
                  <p className="text-sm text-muted-foreground">Últimas 24h</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <CardTitle className="flex-1">Lista de Buscas</CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredBuscas.length > 0 ? (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Tipo/Tipologia</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Detalhes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBuscas.map((busca) => (
                      <TableRow key={busca.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">
                              {busca.created_at ? new Date(busca.created_at).toLocaleDateString('pt-BR') : "-"}
                            </span>
                            {isNova(busca.created_at!) && (
                              <Badge className="bg-green-500 text-xs">Nova</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-foreground">{busca.nome || "-"}</p>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {busca.email && (
                              <p className="text-sm flex items-center gap-1 text-muted-foreground">
                                <Mail className="w-3 h-3" />
                                {busca.email}
                              </p>
                            )}
                            {busca.telefone && (
                              <p className="text-sm flex items-center gap-1 text-muted-foreground">
                                <Phone className="w-3 h-3" />
                                {busca.telefone}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{busca.localizacao || "-"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {busca.tipo_imovel && (
                              <Badge variant="outline" className="text-xs">
                                {busca.tipo_imovel}
                              </Badge>
                            )}
                            {busca.tipologia && (
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Home className="w-3 h-3" />
                                {busca.tipologia}
                              </p>
                            )}
                            {busca.casas_banho && (
                              <p className="text-xs text-muted-foreground">
                                {busca.casas_banho} casas de banho
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {busca.valor_aprovado && (
                              <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                                <DollarSign className="w-3 h-3" />
                                {formatPrice(busca.valor_aprovado)}
                              </div>
                            )}
                            {(busca.preco_min || busca.preco_max) && (
                              <p className="text-xs text-muted-foreground">
                                {busca.preco_min && formatPrice(busca.preco_min)} 
                                {busca.preco_min && busca.preco_max && " - "}
                                {busca.preco_max && formatPrice(busca.preco_max)}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {[
                              busca.localizacao && "Localização",
                              busca.tipo_imovel && "Tipo",
                              busca.tipologia && "Tipologia",
                              busca.valor_aprovado && "Aprovado"
                            ].filter(Boolean).length} critérios
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <EmptyState
                variant="search"
                message="Nenhuma busca encontrada"
                action={{
                  label: "Limpar busca",
                  onClick: () => setSearchTerm("")
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </AdminImobLayout>
  );
};

export default AdminBuscas;