import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Square, Heart, Calendar, MessageCircle, Sparkles, Building2 } from "lucide-react";
import ClienteLayout from "@/components/layout/ClienteLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getImoveisSugeridos, type ImovelSugerido, type Imovel } from "@/services/api";
import Loading from "@/components/ui/Loading";
import EmptyState from "@/components/ui/EmptyState";
import MotionPageTransition, { StaggeredMotionContainer, StaggeredItem, HoverCardAnimation } from "@/components/layout/MotionPageTransition";

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
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

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

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <ClienteLayout>
        <Loading message="Buscando imoveis para voce..." size="lg" variant="pulse" />
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
      <MotionPageTransition>
        <div className="p-6 lg:p-8 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight flex items-center gap-2">
                <Sparkles className="w-7 h-7 text-[#7B2FF7]" />
                Imoveis Sugeridos
              </h1>
              <p className="text-muted-foreground mt-1">
                Imoveis selecionados especialmente para o seu perfil
              </p>
            </div>
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
                      <p className="text-3xl font-bold text-[#7B2FF7]">{imoveis.length}</p>
                      <p className="text-sm text-muted-foreground">Imoveis Sugeridos</p>
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
                      <p className="text-3xl font-bold text-green-500">
                        {imoveis.filter((i) => i.disponivel).length}
                      </p>
                      <p className="text-sm text-muted-foreground">Disponiveis</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </HoverCardAnimation>
            <HoverCardAnimation>
              <Card className="border-0 shadow-[var(--shadow-md)] bg-gradient-to-br from-orange-500/5 to-transparent">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-orange-500">
                        {imoveis.filter((i) => i.nota_lia).length}
                      </p>
                      <p className="text-sm text-muted-foreground">Com Nota da LIA</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </HoverCardAnimation>
          </div>

          {/* Properties Grid */}
          {imoveis.length > 0 ? (
            <StaggeredMotionContainer className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {imoveis.map((imovel) => (
                <StaggeredItem key={imovel.sugestao_id}>
                  <HoverCardAnimation>
                    <Card className="overflow-hidden border border-[var(--lum-border)] dark:border-[var(--lum-border-dark)] shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] transition-all duration-[var(--transition-smooth)]">
                      <div className="relative h-52 overflow-hidden bg-muted">
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
                        <div className="absolute top-3 left-3 flex gap-2">
                          <Badge className="backdrop-blur-sm bg-white/90 dark:bg-black/70 text-foreground shadow-sm">
                            {imovel.tipologia || "Imovel"}
                          </Badge>
                          {imovel.disponivel && (
                            <Badge className="bg-green-500 hover:bg-green-500/90 shadow-sm">Disponivel</Badge>
                          )}
                        </div>
                        <div className="absolute top-3 right-3">
                          <Button
                            variant="secondary"
                            size="icon"
                            onClick={() => toggleFavorite(imovel.id)}
                            className={`rounded-full backdrop-blur-sm transition-all duration-[var(--transition)] ${
                              favorites.has(imovel.id)
                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                : 'bg-white/90 hover:bg-white dark:bg-black/70 dark:hover:bg-black/90'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${favorites.has(imovel.id) ? 'fill-current' : 'text-red-500'}`} />
                          </Button>
                        </div>
                      </div>

                      <CardHeader className="pb-3">
                        <h3 className="text-lg font-semibold text-foreground line-clamp-1">{imovel.titulo}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="line-clamp-1">{imovel.localizacao}</span>
                        </p>
                      </CardHeader>

                      <CardContent className="pb-3">
                        <div className="flex items-center gap-5 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Bed className="w-4 h-4" />
                            {imovel.quartos || 0} quartos
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Bath className="w-4 h-4" />
                            {imovel.banheiros || 0} banheiros
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Square className="w-4 h-4" />
                            {imovel.area || 0}m2
                          </span>
                        </div>

                        {imovel.nota_lia && (
                          <div className="mt-4 p-3 rounded-xl bg-[#7B2FF7]/5 border border-[#7B2FF7]/20">
                            <p className="font-medium text-[#7B2FF7] text-sm flex items-center gap-1.5 mb-1">
                              <Sparkles className="w-4 h-4" />
                              Nota da LIA:
                            </p>
                            <p className="text-sm text-foreground leading-relaxed">{imovel.nota_lia}</p>
                          </div>
                        )}
                      </CardContent>

                      <CardFooter className="flex flex-col gap-4 pt-3 border-t border-[var(--lum-border)] dark:border-[var(--lum-border-dark)]">
                        <div className="flex items-center justify-between w-full">
                          <span className="text-2xl font-bold text-[#7B2FF7]">
                            {formatPrice(imovel.preco)}
                          </span>
                          <Link to={`/imobiliaria/imovel/${imovel.id}`}>
                            <Button size="sm" className="shadow-luminnus">Ver detalhes</Button>
                          </Link>
                        </div>
                        <div className="flex gap-3 w-full">
                          <Button variant="outline" size="sm" className="flex-1 gap-2">
                            <Calendar className="w-4 h-4" />
                            Agendar Visita
                          </Button>
                          <a
                            href={getWhatsAppLink(imovel)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1"
                          >
                            <Button
                              size="sm"
                              className="w-full gap-2 bg-green-500 hover:bg-green-600 text-white shadow-sm"
                            >
                              <MessageCircle className="w-4 h-4" />
                              WhatsApp
                            </Button>
                          </a>
                        </div>
                      </CardFooter>
                    </Card>
                  </HoverCardAnimation>
                </StaggeredItem>
              ))}
            </StaggeredMotionContainer>
          ) : (
            <Card className="border-0 shadow-[var(--shadow-md)]">
              <CardContent className="p-0">
                <EmptyState
                  variant="default"
                  title="Nenhum imovel sugerido ainda"
                  message="Nossa equipe esta selecionando os melhores imoveis para o seu perfil. Enquanto isso, explore nosso catalogo completo!"
                  size="lg"
                  action={{
                    label: "Explorar todos os imoveis",
                    onClick: () => window.location.href = "/imobiliaria/imoveis"
                  }}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </MotionPageTransition>
    </ClienteLayout>
  );
};

export default ClienteImoveisSugeridos;
