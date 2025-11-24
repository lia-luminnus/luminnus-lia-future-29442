import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Bed, Bath, Square, Phone, MessageCircle, ArrowRight, Building2, Star, Shield, Users } from "lucide-react";
import ImobiliariaHeader from "@/components/header/ImobiliariaHeader";

// Mock data for featured properties
const imoveisDestaque = [
  {
    id: 1,
    titulo: "Apartamento Moderno Centro",
    tipo: "Apartamento",
    endereco: "Centro, Sao Paulo - SP",
    preco: 450000,
    quartos: 2,
    banheiros: 1,
    area: 65,
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
    imagem: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop"
  }
];

const formatPrice = (price: number) => {
  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const ImobiliariaHome = () => {
  const handleWhatsApp = () => {
    window.open('https://wa.me/5511999999999?text=Olá! Gostaria de mais informações sobre os imóveis.', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <UnifiedHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-24 bg-gradient-to-br from-[#F3EEFF] to-white dark:from-[#0F0F14] dark:to-[#1A1A22]">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Building2 className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
            Luminnus Imobiliaria
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground mb-8">
            Encontre imoveis selecionados com tecnologia inteligente e suporte da LIA.
            Sua jornada para o imovel dos sonhos comeca aqui.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/imobiliaria/imoveis">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                Ver imoveis disponiveis
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/imobiliaria/contato">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Falar com consultor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-foreground">
            Por que escolher a Luminnus?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Imoveis Selecionados</h3>
              <p className="text-muted-foreground">Curadoria rigorosa para garantir as melhores opcoes do mercado.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Processo Seguro</h3>
              <p className="text-muted-foreground">Documentacao verificada e acompanhamento em todas as etapas.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Suporte Personalizado</h3>
              <p className="text-muted-foreground">Atendimento humanizado com apoio da nossa IA assistente LIA.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Imoveis em Destaque
            </h2>
            <Link to="/imobiliaria/imoveis" className="text-primary hover:underline font-medium flex items-center gap-1">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {imoveisDestaque.map((imovel) => (
              <Card key={imovel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={imovel.imagem}
                    alt={imovel.titulo}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">
                    {imovel.tipo}
                  </span>
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
                  <Link to={`/imobiliaria/imovel/${imovel.id}`}>
                    <Button variant="outline" size="sm">
                      Ver detalhes
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-card" id="contato-rapido">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-foreground">
              Entre em Contato
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              Preencha o formulario abaixo ou fale conosco pelo WhatsApp
            </p>

            <Card>
              <CardContent className="p-6">
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome</Label>
                      <Input id="nome" placeholder="Seu nome completo" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="seu@email.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input id="telefone" placeholder="(11) 99999-9999" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mensagem">Mensagem</Label>
                    <Textarea id="mensagem" placeholder="Como podemos ajudar?" rows={4} />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button type="submit" className="flex-1">
                      <Phone className="w-4 h-4 mr-2" />
                      Enviar
                    </Button>
                    <Button type="button" variant="outline" className="flex-1" onClick={handleWhatsApp}>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-muted/50 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} Luminnus Imobiliaria. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ImobiliariaHome;
