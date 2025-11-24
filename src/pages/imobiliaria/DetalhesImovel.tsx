import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Square, Car, Phone, MessageCircle, ArrowLeft, Heart, Share2, CheckCircle } from "lucide-react";
import ImobiliariaHeader from "@/components/header/ImobiliariaHeader";

// Mock data for a single property
const imoveisData: Record<string, {
  id: number;
  titulo: string;
  tipo: string;
  endereco: string;
  bairro: string;
  cidade: string;
  preco: number;
  quartos: number;
  banheiros: number;
  area: number;
  vagas: number;
  descricao: string;
  caracteristicas: string[];
  imagens: string[];
}> = {
  "1": {
    id: 1,
    titulo: "Apartamento Moderno Centro",
    tipo: "Apartamento",
    endereco: "Rua Augusta, 1500",
    bairro: "Centro",
    cidade: "Sao Paulo - SP",
    preco: 450000,
    quartos: 2,
    banheiros: 1,
    area: 65,
    vagas: 1,
    descricao: "Apartamento moderno e bem localizado no coracao de Sao Paulo. Proximo a metro, comercios e servicos. Ideal para quem busca praticidade e qualidade de vida. O imovel conta com acabamentos de primeira linha e uma vista privilegiada da cidade.",
    caracteristicas: ["Ar condicionado", "Armarios embutidos", "Piso laminado", "Varanda", "Portaria 24h", "Academia"],
    imagens: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&h=600&fit=crop"
    ]
  },
  "2": {
    id: 2,
    titulo: "Casa com Jardim",
    tipo: "Casa",
    endereco: "Alameda Santos, 800",
    bairro: "Jardins",
    cidade: "Sao Paulo - SP",
    preco: 850000,
    quartos: 3,
    banheiros: 2,
    area: 150,
    vagas: 2,
    descricao: "Linda casa com amplo jardim em um dos bairros mais nobres de Sao Paulo. Perfeita para familias que buscam espaco e conforto em uma localizacao privilegiada. Ambientes amplos e bem iluminados.",
    caracteristicas: ["Jardim", "Churrasqueira", "Piscina", "Suite master", "Escritorio", "Lavabo"],
    imagens: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop"
    ]
  },
  "3": {
    id: 3,
    titulo: "Cobertura Duplex",
    tipo: "Cobertura",
    endereco: "Av. Ibirapuera, 2000",
    bairro: "Moema",
    cidade: "Sao Paulo - SP",
    preco: 1200000,
    quartos: 4,
    banheiros: 3,
    area: 220,
    vagas: 3,
    descricao: "Espetacular cobertura duplex com vista panoramica para o Parque Ibirapuera. Acabamentos de alto padrao, terraco gourmet e muito mais. Uma oportunidade unica de morar em um dos enderecos mais cobiçados da cidade.",
    caracteristicas: ["Terraco gourmet", "Jacuzzi", "Vista panoramica", "Home theater", "Closet", "Lareira"],
    imagens: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop"
    ]
  }
};

const formatPrice = (price: number) => {
  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const DetalhesImovel = () => {
  const { id } = useParams<{ id: string }>();
  const imovel = id ? imoveisData[id] : null;

  const handleWhatsApp = () => {
    const message = imovel
      ? `Olá! Tenho interesse no imóvel: ${imovel.titulo} - ${formatPrice(imovel.preco)}`
      : 'Olá! Gostaria de mais informações sobre os imóveis.';
    window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (!imovel) {
    return (
      <div className="min-h-screen bg-background">
        <ImobiliariaHeader />
        <div className="pt-32 container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Imovel nao encontrado</h1>
          <Link to="/imobiliaria/imoveis">
            <Button>Voltar para lista</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ImobiliariaHeader />

      {/* Breadcrumb */}
      <div className="pt-28 pb-4 bg-muted/30">
        <div className="container mx-auto px-4">
          <Link to="/imobiliaria/imoveis" className="text-primary hover:underline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar para imoveis
          </Link>
        </div>
      </div>

      {/* Image Gallery */}
      <section className="pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <img
                src={imovel.imagens[0]}
                alt={imovel.titulo}
                className="w-full h-[400px] object-cover rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
              {imovel.imagens.slice(1, 3).map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${imovel.titulo} - Foto ${index + 2}`}
                  className="w-full h-[190px] object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Property Details */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="secondary" className="mb-2">{imovel.tipo}</Badge>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{imovel.titulo}</h1>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {imovel.endereco}, {imovel.bairro}, {imovel.cidade}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="text-center">
                  <Bed className="w-6 h-6 mx-auto mb-1 text-primary" />
                  <p className="text-lg font-semibold text-foreground">{imovel.quartos}</p>
                  <p className="text-sm text-muted-foreground">Quartos</p>
                </div>
                <div className="text-center">
                  <Bath className="w-6 h-6 mx-auto mb-1 text-primary" />
                  <p className="text-lg font-semibold text-foreground">{imovel.banheiros}</p>
                  <p className="text-sm text-muted-foreground">Banheiros</p>
                </div>
                <div className="text-center">
                  <Square className="w-6 h-6 mx-auto mb-1 text-primary" />
                  <p className="text-lg font-semibold text-foreground">{imovel.area}m²</p>
                  <p className="text-sm text-muted-foreground">Area</p>
                </div>
                <div className="text-center">
                  <Car className="w-6 h-6 mx-auto mb-1 text-primary" />
                  <p className="text-lg font-semibold text-foreground">{imovel.vagas}</p>
                  <p className="text-sm text-muted-foreground">Vagas</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">Descricao</h2>
                <p className="text-muted-foreground leading-relaxed">{imovel.descricao}</p>
              </div>

              {/* Características */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">Caracteristicas</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {imovel.caracteristicas.map((caracteristica, index) => (
                    <div key={index} className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      {caracteristica}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - Contact */}
            <div>
              <Card className="sticky top-28">
                <CardContent className="p-6">
                  <p className="text-3xl font-bold text-primary mb-4">
                    {formatPrice(imovel.preco)}
                  </p>
                  <div className="space-y-3">
                    <Button className="w-full gap-2" onClick={handleWhatsApp}>
                      <MessageCircle className="w-4 h-4" />
                      Falar no WhatsApp
                    </Button>
                    <Button variant="outline" className="w-full gap-2">
                      <Phone className="w-4 h-4" />
                      Agendar visita
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground text-center mt-4">
                    Resposta em ate 24 horas
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-muted/50 border-t border-border mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} Luminnus Imobiliaria. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DetalhesImovel;
