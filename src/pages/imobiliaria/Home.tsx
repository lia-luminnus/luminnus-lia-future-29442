import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Bed, Bath, Square, Phone, MessageCircle, ArrowRight, Building2, Search, Home } from "lucide-react";
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
      <ImobiliariaHeader />

      {/* Hero Section com Background do Porto */}
      <section
        className="relative pt-32 pb-24 bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1555881400-74d7acaacd8b?q=80&w=2000&fit=crop)',
        }}
      >
        {/* Overlay escuro/roxo */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B0B0F]/70 via-[#8A2FFF]/30 to-[#0B0B0F]/80 dark:from-[#0B0B0F]/85 dark:via-[#8A2FFF]/35 dark:to-[#0B0B0F]/90"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Building2 className="w-12 h-12 text-white drop-shadow-lg" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
            Luminnus Imobiliaria
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-white/95 mb-8 drop-shadow-lg">
            Encontre imoveis selecionados com tecnologia inteligente e suporte da LIA.
            Sua jornada para o imovel dos sonhos comeca aqui.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/imobiliaria/imoveis">
              <Button size="lg" className="w-full sm:w-auto gap-2 bg-[#8A2FFF] hover:bg-[#C08BFF] shadow-lg">
                Ver imoveis disponiveis
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/imobiliaria/contato">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20">
                Falar com consultor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Filtros do Cliente */}
      <section className="py-16 bg-card" id="filtros">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Search className="w-8 h-8 text-[#8A2FFF]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Encontre o Imovel Ideal
              </h2>
              <p className="text-muted-foreground">
                Preencha os filtros abaixo para encontrarmos as melhores opcoes para voce
              </p>
            </div>

            <Card className="bg-muted/50 border-[#8A2FFF]/30">
              <CardContent className="p-6">
                <form className="space-y-6">
                  {/* Linha 1: Localização e Tipo */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="localizacao" className="text-foreground">Localização *</Label>
                      <Input
                        id="localizacao"
                        placeholder="Ex: Porto, Lisboa, Braga..."
                        className="bg-input border-[#8A2FFF] text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tipo" className="text-foreground">Tipo de Imovel *</Label>
                      <Select>
                        <SelectTrigger className="bg-input border-[#8A2FFF] text-foreground">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="apartamento">Apartamento</SelectItem>
                          <SelectItem value="vivenda">Vivenda / Casa</SelectItem>
                          <SelectItem value="studio">Studio</SelectItem>
                          <SelectItem value="terreno">Terreno</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Linha 2: Tipologia e Casas de Banho */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tipologia" className="text-foreground">Tipologia *</Label>
                      <Select>
                        <SelectTrigger className="bg-input border-[#8A2FFF] text-foreground">
                          <SelectValue placeholder="Selecione a tipologia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="t0">T0</SelectItem>
                          <SelectItem value="t1">T1</SelectItem>
                          <SelectItem value="t2">T2</SelectItem>
                          <SelectItem value="t3">T3</SelectItem>
                          <SelectItem value="t4">T4</SelectItem>
                          <SelectItem value="t5+">T5+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="banhos" className="text-foreground">Casas de Banho</Label>
                      <Select>
                        <SelectTrigger className="bg-input border-[#8A2FFF] text-foreground">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4+">4+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Linha 3: Valor Aprovado e Intervalo de Preço */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="valor-aprovado" className="text-foreground">Valor Aprovado pelo Banco (€)</Label>
                      <Input
                        id="valor-aprovado"
                        type="number"
                        placeholder="Ex: 250000"
                        className="bg-input border-[#8A2FFF] text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Intervalo de Preco Desejado (€)</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Min"
                          type="number"
                          className="bg-input border-[#8A2FFF] text-foreground placeholder:text-muted-foreground"
                        />
                        <Input
                          placeholder="Max"
                          type="number"
                          className="bg-input border-[#8A2FFF] text-foreground placeholder:text-muted-foreground"
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-[#8A2FFF] hover:bg-[#C08BFF] text-white py-6 text-lg">
                    <Search className="w-5 h-5 mr-2" />
                    Buscar Imoveis
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Properties Grid */}
      <section className="py-16" id="imoveis-destaque">
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

            <Card className="border-[#8A2FFF]/30">
              <CardContent className="p-6">
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome" className="text-foreground">Nome</Label>
                      <Input
                        id="nome"
                        placeholder="Seu nome completo"
                        className="border-[#8A2FFF] focus:border-[#8A2FFF] placeholder:text-[#C7C7C7]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        className="border-[#8A2FFF] focus:border-[#8A2FFF] placeholder:text-[#C7C7C7]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone" className="text-foreground">Telefone</Label>
                    <Input
                      id="telefone"
                      placeholder="(11) 99999-9999"
                      className="border-[#8A2FFF] focus:border-[#8A2FFF] placeholder:text-[#C7C7C7]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mensagem" className="text-foreground">Mensagem</Label>
                    <Textarea
                      id="mensagem"
                      placeholder="Como podemos ajudar?"
                      rows={4}
                      className="border-[#8A2FFF] focus:border-[#8A2FFF] placeholder:text-[#C7C7C7]"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button type="submit" className="flex-1 bg-[#8A2FFF] hover:bg-[#C08BFF]">
                      <Phone className="w-4 h-4 mr-2" />
                      Enviar
                    </Button>
                    <Button type="button" className="flex-1 bg-[#25D366] hover:bg-[#1EBE5C] text-white border-0" onClick={handleWhatsApp}>
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
