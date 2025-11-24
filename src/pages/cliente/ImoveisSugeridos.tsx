import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Square, Heart, Calendar, Star } from "lucide-react";
import ClienteLayout from "@/components/layout/ClienteLayout";

// Mock data for suggested properties
const imoveisSugeridos = [
  {
    id: 1,
    titulo: "Apartamento Moderno Centro",
    tipo: "Apartamento",
    endereco: "Centro, Sao Paulo - SP",
    preco: 450000,
    quartos: 2,
    banheiros: 1,
    area: 65,
    imagem: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    compatibilidade: 95,
    destaque: true,
    novo: true
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
    imagem: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
    compatibilidade: 88,
    destaque: true,
    novo: false
  },
  {
    id: 3,
    titulo: "Studio Compacto",
    tipo: "Studio",
    endereco: "Pinheiros, Sao Paulo - SP",
    preco: 280000,
    quartos: 1,
    banheiros: 1,
    area: 35,
    imagem: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
    compatibilidade: 82,
    destaque: false,
    novo: true
  },
  {
    id: 4,
    titulo: "Apartamento Garden",
    tipo: "Apartamento",
    endereco: "Vila Madalena, Sao Paulo - SP",
    preco: 680000,
    quartos: 3,
    banheiros: 2,
    area: 110,
    imagem: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=300&fit=crop",
    compatibilidade: 78,
    destaque: false,
    novo: false
  }
];

const formatPrice = (price: number) => {
  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const ClienteImoveisSugeridos = () => {
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
              <p className="text-3xl font-bold text-primary">{imoveisSugeridos.length}</p>
              <p className="text-sm text-muted-foreground">Imoveis Sugeridos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-green-500">
                {imoveisSugeridos.filter(i => i.novo).length}
              </p>
              <p className="text-sm text-muted-foreground">Novos Esta Semana</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-orange-500">
                {imoveisSugeridos.filter(i => i.destaque).length}
              </p>
              <p className="text-sm text-muted-foreground">Em Destaque</p>
            </CardContent>
          </Card>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {imoveisSugeridos.map((imovel) => (
            <Card key={imovel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={imovel.imagem}
                  alt={imovel.titulo}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge>{imovel.tipo}</Badge>
                  {imovel.novo && (
                    <Badge className="bg-green-500">Novo</Badge>
                  )}
                  {imovel.destaque && (
                    <Badge className="bg-orange-500 flex items-center gap-1">
                      <Star className="w-3 h-3" /> Destaque
                    </Badge>
                  )}
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
                {/* Compatibility Badge */}
                <div className="absolute bottom-3 right-3 bg-primary text-primary-foreground px-2 py-1 rounded-md text-sm font-medium">
                  {imovel.compatibilidade}% compativel
                </div>
              </div>

              <CardHeader className="pb-2">
                <h3 className="text-lg font-semibold text-foreground">{imovel.titulo}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {imovel.endereco}
                </p>
              </CardHeader>

              <CardContent className="pb-2">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Bed className="w-4 h-4" />
                    {imovel.quartos}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="w-4 h-4" />
                    {imovel.banheiros}
                  </span>
                  <span className="flex items-center gap-1">
                    <Square className="w-4 h-4" />
                    {imovel.area}m²
                  </span>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between pt-2 border-t">
                <span className="text-xl font-bold text-primary">
                  {formatPrice(imovel.preco)}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Calendar className="w-4 h-4" />
                    Agendar
                  </Button>
                  <Link to={`/imobiliaria/imovel/${imovel.id}`}>
                    <Button size="sm">Ver detalhes</Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {imoveisSugeridos.length === 0 && (
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
