import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Bed, Bath, Square, Search, Filter } from "lucide-react";
import ImobiliariaHeader from "@/components/header/ImobiliariaHeader";

// Mock data for properties
const todosImoveis = [
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
    imagem: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop"
  },
  {
    id: 5,
    titulo: "Apartamento Garden",
    tipo: "Apartamento",
    endereco: "Vila Madalena, Sao Paulo - SP",
    preco: 680000,
    quartos: 3,
    banheiros: 2,
    area: 110,
    imagem: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=300&fit=crop"
  },
  {
    id: 6,
    titulo: "Casa de Condominio",
    tipo: "Casa",
    endereco: "Alphaville, Barueri - SP",
    preco: 1500000,
    quartos: 4,
    banheiros: 4,
    area: 300,
    imagem: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop"
  }
];

const formatPrice = (price: number) => {
  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const ListaImoveis = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState<string>("todos");
  const [quartosFilter, setQuartosFilter] = useState<string>("todos");

  const filteredImoveis = todosImoveis.filter((imovel) => {
    const matchesSearch = imovel.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          imovel.endereco.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = tipoFilter === "todos" || imovel.tipo === tipoFilter;
    const matchesQuartos = quartosFilter === "todos" ||
                           (quartosFilter === "4+" ? imovel.quartos >= 4 : imovel.quartos === parseInt(quartosFilter));
    return matchesSearch && matchesTipo && matchesQuartos;
  });

  return (
    <div className="min-h-screen bg-background">
      <ImobiliariaHeader />

      {/* Page Header */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-[#F3EEFF] to-white dark:from-[#0F0F14] dark:to-[#1A1A22]">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Nossos Imoveis
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Explore nossa selecao de imoveis cuidadosamente escolhidos para voce.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar por titulo ou endereco..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48 space-y-2">
              <Label>Tipo</Label>
              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  <SelectItem value="Apartamento">Apartamento</SelectItem>
                  <SelectItem value="Casa">Casa</SelectItem>
                  <SelectItem value="Cobertura">Cobertura</SelectItem>
                  <SelectItem value="Studio">Studio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48 space-y-2">
              <Label>Quartos</Label>
              <Select value={quartosFilter} onValueChange={setQuartosFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Qualquer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Qualquer</SelectItem>
                  <SelectItem value="1">1 quarto</SelectItem>
                  <SelectItem value="2">2 quartos</SelectItem>
                  <SelectItem value="3">3 quartos</SelectItem>
                  <SelectItem value="4+">4+ quartos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Mais filtros
            </Button>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <p className="text-muted-foreground mb-6">
            {filteredImoveis.length} imoveis encontrados
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImoveis.map((imovel) => (
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

          {filteredImoveis.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum imovel encontrado com os filtros selecionados.</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchTerm("");
                  setTipoFilter("todos");
                  setQuartosFilter("todos");
                }}
              >
                Limpar filtros
              </Button>
            </div>
          )}
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

export default ListaImoveis;
