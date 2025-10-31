import { Clock, TrendingDown, Zap, Bot, BarChart, MessageSquare, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Solutions = () => {
  const benefits = [
    {
      icon: Clock,
      title: "Economize horas por dia",
      description: "Automatize respostas, agendamentos e follow-ups. Recupere seu tempo para focar no que realmente importa: crescer seu negócio."
    },
    {
      icon: TrendingDown,
      title: "Reduza custos com contratações",
      description: "Por que contratar quando você pode ter uma IA treinada especificamente para o seu negócio? Sem encargos, sem turnover, sem treinamentos constantes."
    },
    {
      icon: Zap,
      title: "Ganhe produtividade real",
      description: "Relatórios automáticos, alertas inteligentes e organização de processos. A Lia cuida da operação enquanto você cuida da estratégia."
    }
  ];

  const transformations = [
    {
      icon: Bot,
      title: "Atendimento 24/7",
      description: "Nunca perca um cliente por falta de atendimento"
    },
    {
      icon: MessageSquare,
      title: "Integração Total",
      description: "Conecta-se com todas as suas ferramentas (CRM, agenda, e-mail, WhatsApp)"
    },
    {
      icon: BarChart,
      title: "Aprendizado Contínuo",
      description: "A Lia aprende com cada conversa e melhora constantemente"
    },
    {
      icon: Calendar,
      title: "Relatórios Inteligentes",
      description: "Dados em tempo real para você tomar decisões melhores"
    }
  ];


  return (
    <section id="solucoes" className="py-32 lg:py-40 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0F] via-primary/5 to-[#0B0B0F]" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-6 mb-20 animate-fade-in">
          <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
            Você ainda faz tudo sozinho<br />na sua empresa?
          </h1>
          
          <p className="text-xl lg:text-2xl text-white/70 max-w-4xl mx-auto">
            Imagine ter uma assistente que trabalha 24h por você,<br />
            sem férias, sem descanso, sempre disponível.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#FF2E9E] flex items-center justify-center mb-6">
                <benefit.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{benefit.title}</h3>
              <p className="text-white/70 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* How Lia Transforms Section */}
        <div className="space-y-12 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="text-center">
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#FF2E9E] bg-clip-text text-transparent mb-4">
              Conheça como a Lia transforma o seu negócio
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {transformations.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-[#7C3AED]/50 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#7C3AED]/20 to-[#FF2E9E]/20 flex items-center justify-center flex-shrink-0 border border-[#7C3AED]/30">
                  <item.icon className="w-6 h-6 text-[#7C3AED]" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-white/70">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 space-y-4 animate-fade-in" style={{ animationDelay: "0.8s" }}>
          <Link to="/planos">
            <Button className="bg-gradient-to-r from-[#7C3AED] to-[#FF2E9E] hover:shadow-[0_0_40px_rgba(124,58,237,0.6)] transition-all border-0 h-14 px-10 text-lg">
              Ver Planos e Preços
            </Button>
          </Link>
          
          <div>
            <Button
              variant="ghost"
              onClick={() => {
                const demoSection = document.getElementById('demo');
                if (demoSection) {
                  demoSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              Falar com a Lia agora
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Solutions;
