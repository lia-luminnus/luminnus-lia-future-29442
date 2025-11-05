const LiaStatistics = () => {
  const statistics = [
    {
      icon: "⚡",
      title: "78%",
      subtitle: "Redução no tempo gasto com tarefas administrativas repetitivas."
    },
    {
      icon: "💰",
      title: "40%–60%",
      subtitle: "Economia média em custos operacionais de atendimento e suporte."
    },
    {
      icon: "📈",
      title: "3x–5x",
      subtitle: "Aumento médio de produtividade com automação inteligente."
    },
    {
      icon: "⏱️",
      title: "<2s",
      subtitle: "Tempo de resposta automatizado em múltiplos atendimentos simultâneos."
    },
    {
      icon: "🔗",
      title: "+1000",
      subtitle: "Integrações com sistemas como WhatsApp, CRMs e ERPs."
    },
    {
      icon: "🧠",
      title: "IA Treinável",
      subtitle: "Memória contextual que aprende padrões específicos de cada empresa."
    },
    {
      icon: "📊",
      title: "Dashboard em tempo real",
      subtitle: "Métricas, gráficos e relatórios automáticos integrados."
    },
    {
      icon: "🌐",
      title: "99,9% uptime",
      subtitle: "Disponibilidade 24h/dia sem pausas."
    },
    {
      icon: "🛠️",
      title: "1–3 dias",
      subtitle: "Tempo médio de implantação da LIA, conforme o porte do negócio."
    }
  ];

  return (
    <section
      id="lia-numeros"
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0B0B0D 0%, #111111 100%)',
        padding: '100px 5%'
      }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto space-y-16 animate-fade-in">
          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl lg:text-6xl font-bold text-white">
              📊 Resultados Reais da LIA
            </h2>
            <p className="text-xl lg:text-2xl text-white/70 max-w-4xl mx-auto">
              Uma plataforma consciente e cognitiva que transforma empresas em potências automatizadas.
            </p>
          </div>

          {/* Statistics Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {statistics.map((stat, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-primary/40 transition-all duration-300 hover:scale-105 hover:bg-white/10 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="space-y-4">
                  {/* Icon */}
                  <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#7C3AED] via-[#FF2E9E] to-[#22D3EE] bg-clip-text text-transparent">
                    {stat.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-white/80 text-base lg:text-lg leading-relaxed">
                    {stat.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiaStatistics;
