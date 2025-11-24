import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, MessageCircle, Clock, Send } from "lucide-react";
import ImobiliariaHeader from "@/components/header/ImobiliariaHeader";

const Contato = () => {
  const handleWhatsApp = () => {
    window.open('https://wa.me/5511999999999?text=Olá! Gostaria de mais informações sobre os imóveis.', '_blank');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log("Form submitted");
  };

  return (
    <div className="min-h-screen bg-background">
      <ImobiliariaHeader />

      {/* Page Header */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-[#F3EEFF] to-white dark:from-[#0F0F14] dark:to-[#1A1A22]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Entre em Contato
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Estamos prontos para ajudar voce a encontrar o imovel dos seus sonhos.
            Fale conosco por qualquer um dos nossos canais.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Informacoes de Contato
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Telefone</h3>
                      <p className="text-muted-foreground">(11) 99999-9999</p>
                      <p className="text-muted-foreground">(11) 3333-3333</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Email</h3>
                      <p className="text-muted-foreground">contato@luminnus.com.br</p>
                      <p className="text-muted-foreground">vendas@luminnus.com.br</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Endereco</h3>
                      <p className="text-muted-foreground">Av. Paulista, 1000 - 10º andar</p>
                      <p className="text-muted-foreground">Bela Vista, Sao Paulo - SP</p>
                      <p className="text-muted-foreground">CEP: 01310-100</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Horario de Atendimento</h3>
                      <p className="text-muted-foreground">Segunda a Sexta: 9h as 18h</p>
                      <p className="text-muted-foreground">Sabado: 9h as 13h</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        Prefere WhatsApp?
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Resposta rapida em horario comercial
                      </p>
                      <Button onClick={handleWhatsApp} className="bg-green-500 hover:bg-green-600 text-white">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Iniciar conversa
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Envie sua Mensagem
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nome">Nome *</Label>
                        <Input id="nome" placeholder="Seu nome completo" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" type="email" placeholder="seu@email.com" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="telefone">Telefone *</Label>
                        <Input id="telefone" placeholder="(11) 99999-9999" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assunto">Assunto</Label>
                        <Input id="assunto" placeholder="Assunto da mensagem" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mensagem">Mensagem *</Label>
                      <Textarea
                        id="mensagem"
                        placeholder="Descreva como podemos ajudar voce..."
                        rows={5}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full gap-2">
                      <Send className="w-4 h-4" />
                      Enviar Mensagem
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="bg-muted rounded-lg h-[300px] flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Mapa interativo seria exibido aqui</p>
            </div>
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

export default Contato;
