export interface Plan {
  name: string;
  price: string;
  annualPrice: string;
  period: string;
  description: string;
  features: string[];
  color: string;
  popular: boolean;
  liaQuote: string;
  customCTA?: {
    text: string;
    action: string;
  };
}

export const plans: Plan[] = [
  {
    name: "Start",
    price: "€27",
    annualPrice: "€259",
    period: "/mês",
    description: "Ideal para pequenos negócios e profissionais autônomos",
    features: [
      "1 canal de atendimento (WhatsApp ou Chat)",
      "Respostas automáticas básicas",
      "Integração com 1 ferramenta",
      "Suporte por e-mail",
      "Relatórios mensais"
    ],
    color: "from-[#22D3EE] to-[#0EA5E9]",
    popular: false,
    liaQuote: "O plano Start é perfeito se você está começando! Vou cuidar das perguntas mais frequentes dos seus clientes, trabalhar 24h e liberar seu tempo para focar no crescimento. É como ter um assistente sempre disponível, sem custos de contratação."
  },
  {
    name: "Plus",
    price: "€147",
    annualPrice: "€1.411",
    period: "/mês",
    description: "Para empresas em crescimento que precisam escalar",
    features: [
      "Múltiplos canais (WhatsApp, Chat, E-mail)",
      "IA avançada com aprendizado",
      "Integrações ilimitadas (CRM, Agenda, etc)",
      "Agendamentos automáticos",
      "Suporte prioritário",
      "Relatórios semanais + Dashboard",
      "Treinamento personalizado",
      "Tokens adicionais configuráveis conforme uso",
      "10 minutos/dia de uso da LIA",
      "Possibilidade de comprar minutos extras"
    ],
    color: "from-[#7C3AED] to-[#FF2E9E]",
    popular: true,
    liaQuote: "Esse é o plano que recomendo para quem já tem um fluxo constante de clientes! Com o Plus, posso atender em múltiplos canais, aprender com cada conversa e integrar com todas as suas ferramentas. Vou agendar reuniões, atualizar seu CRM e até gerar relatórios inteligentes. É automação de verdade! 🚀"
  },
  {
    name: "Pro",
    price: "A partir de €997",
    annualPrice: "A partir de €9.564",
    period: "/mês",
    description: "Solução enterprise totalmente personalizada",
    features: [
      "Mensagens ilimitadas",
      "Todos os canais disponíveis",
      "IA customizada para seu negócio",
      "Integrações sob medida",
      "API dedicada",
      "Suporte 24/7 com SLA",
      "Gerente de conta dedicado",
      "Treinamentos contínuos",
      "Relatórios em tempo real",
      "30 minutos/dia de uso da LIA",
      "Possibilidade de comprar minutos extras"
    ],
    color: "from-[#FF2E9E] to-[#F97316]",
    popular: false,
    liaQuote: "O Pro é para quem quer uma Lia 100% personalizada! Vou me adaptar completamente ao seu negócio, usar sua linguagem, seguir seus processos e integrar com qualquer sistema. Teremos uma equipe dedicada cuidando de tudo e eu vou trabalhar como se fosse parte do time. É o máximo em inteligência artificial empresarial! 💎",
    customCTA: {
      text: "Solicitar proposta personalizada",
      action: "https://wa.me/YOUR_WHATSAPP_NUMBER?text=Olá!%20Gostaria%20de%20solicitar%20uma%20proposta%20personalizada%20do%20plano%20Pro"
    }
  }
];
