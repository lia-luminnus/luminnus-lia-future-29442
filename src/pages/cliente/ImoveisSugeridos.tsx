import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Square, Heart, Calendar, MessageCircle, Loader2 } from "lucide-react";
import ClienteLayout from "@/components/layout/ClienteLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getImoveisSugeridos, type ImovelSugerido, type Imovel } from "@/services/api";

const formatPrice = (price: number) => {
  return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const getWhatsAppLink = (imovel: Imovel) => {
  const message = encodeURIComponent(
    `Ola! Tenho interesse no imovel: ${imovel.titulo} - ${imovel.localizacao} (${formatPrice(imovel.preco)}). Podemos conversar?`
  );
  return `https://wa.me/5511999999999?text=${message}`;
};

const ClienteImoveisSugeridos = () => {
  const { clienteId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sugestoes, setSugestoes] = useState<ImovelSugerido[]>([]);

  useEffect(() => {
    const loadSugestoes = async () => {
      if (!clienteId) {
        setLoading(false);
        return;
      }

      try {
        const data = await getImoveisSugeridos(clienteId);
        setSugestoes(data);
      } catch (error) {
        console.error("Erro ao carregar sugestoes:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSugestoes();
  }, [clienteId]);

  if (loading) {
    return (
      <ClienteLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </ClienteLayout>
    );
  }

  // Extrai os imoveis das sugestoes
  const imoveis = sugestoes
    .filter((s) => s.imovel)
    .map((s) => ({
      ...s.imovel!,
      nota_lia: s.nota_lia,
      sugestao_id: s.id
    }));

  return (
    <ClienteLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Imoveis Sugeridos</h1>
          <p className="text-muted-foreground">
            Imoveis selecionados especialmente para o seu perfil
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">{imoveis.length}</p>
              <p className="text-sm text-muted-foreground">Imoveis Sugeridos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-green-500">
                {imoveis.filter((i) => i.disponivel).length}
              </p>
              <p className="text-sm text-muted-foreground">Disponiveis</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-orange-500">
                {imoveis.filter((i) => i.nota_lia).length}
              </p>
              <p className="text-sm text-muted-foreground">Com Nota da LIA</p>
            </CardContent>
          </Card>
        </div>

        {/* Properties Grid */}
        {imoveis.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {imoveis.map((imovel) => (
              <Card key={imovel.sugestao_id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 overflow-hidden bg-muted">
                  {imovel.fotos && imovel.fotos.length > 0 ? (
                    <img
                      src={imovel.fotos[0]}
                      alt={imovel.titulo}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge>{imovel.tipologia || "Imovel"}</Badge>
                    {imovel.disponivel && <Badge className="bg-green-500">Disponivel</Badge>}
                  </div>
                  <div className="absolute top-3 right-3">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="rounded-full bg-white/80 hover:bg-white"
                    >
                      <Heart className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <h3 className="text-lg font-semibold text-foreground">{imovel.titulo}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {imovel.localizacao}
                  </p>
                </CardHeader>

                <CardContent className="pb-2">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      {imovel.quartos || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      {imovel.banheiros || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Square className="w-4 h-4" />
                      {imovel.area || 0}m2
                    </span>
                  </div>

                  {imovel.nota_lia && (
                    <div className="mt-3 p-2 rounded bg-primary/10 text-sm">
                      <p className="font-medium text-primary">Nota da LIA:</p>
                      <p className="text-foreground">{imovel.nota_lia}</p>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex flex-col gap-3 pt-2 border-t">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xl font-bold text-primary">
                      {formatPrice(imovel.preco)}
                    </span>
                    <Link to={`/imobiliaria/imovel/${imovel.id}`}>
                      <Button size="sm">Ver detalhes</Button>
                    </Link>
                  </div>
                  <div className="flex gap-2 w-full">
                    <Button variant="outline" size="sm" className="flex-1 gap-1">
                      <Calendar className="w-4 h-4" />
                      Agendar
                    </Button>
                    <a
                      href={getWhatsAppLink(imovel)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button
                        size="sm"
                        className="w-full gap-1 bg-green-500 hover:bg-green-600 text-white"
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                      </Button>
                    </a>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <MapPin className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhum imovel sugerido ainda
              </h3>
              <p className="text-muted-foreground mb-4">
                Nossa equipe esta selecionando os melhores imoveis para o seu perfil.
              </p>
              <Link to="/imobiliaria/imoveis">
                <Button>Explorar todos os imoveis</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </ClienteLayout>
  );
};

export default ClienteImoveisSugeridos;
