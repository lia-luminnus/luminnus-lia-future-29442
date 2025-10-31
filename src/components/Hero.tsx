const Hero = () => {
  return <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0B0B0F]">
      {/* Animated Background */}
      <div className="absolute inset-0 -top-24 bg-gradient-to-b from-[#0B0B0F] via-primary/10 to-[#0B0B0F]">
        {/* Particle Effects */}
        <div className="absolute inset-0 -top-24">
          {[...Array(40)].map((_, i) => <div key={i} className="absolute w-1 h-1 bg-primary rounded-full animate-particle" style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 8}s`,
          animationDuration: `${8 + Math.random() * 4}s`,
          boxShadow: '0 0 10px currentColor'
        }} />)}
        </div>
        
        {/* Energy Lines */}
        <svg className="absolute inset-0 -top-24 w-full h-full opacity-30">
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="50%" stopColor="#FF2E9E" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
          </defs>
          <path d="M0,50 Q250,100 500,50 T1000,50" stroke="url(#gradient1)" strokeWidth="3" fill="none" strokeDasharray="10,5" className="animate-pulse" />
          <path d="M0,150 Q250,200 500,150 T1000,150" stroke="url(#gradient1)" strokeWidth="3" fill="none" strokeDasharray="10,5" className="animate-pulse" style={{
          animationDelay: "1s"
        }} />
        </svg>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-32 lg:pt-40">
        <div className="max-w-6xl mx-auto text-center space-y-12 animate-fade-in">
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-7xl font-black leading-tight tracking-tight">
              <span className="block bg-gradient-to-r from-[#7C3AED] via-[#FF2E9E] to-[#22D3EE] bg-clip-text text-transparent animate-gradient-shift bg-200%">
                Conheça a LIA
              </span>
              <span className="block text-3xl lg:text-5xl text-white/90 font-normal mt-4">
                Sua Assistente Inteligente
              </span>
            </h1>
            
            <p className="text-xl lg:text-3xl text-white/70 max-w-5xl mx-auto leading-relaxed font-light">
              Criada para automatizar atendimento, gerar conteúdo, educar e organizar sua empresa com inteligência artificial de última geração.
            </p>
          </div>

          {/* Features Highlight */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-8">
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-[#7C3AED]/30 transition-all">
              <h3 className="text-2xl font-bold text-[#7C3AED] mb-2">Atendimento 24/7</h3>
              <p className="text-white/70">Responde clientes automaticamente em múltiplos canais</p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-[#FF2E9E]/30 transition-all">
              <h3 className="text-2xl font-bold text-[#FF2E9E] mb-2">Geração de Conteúdo</h3>
              <p className="text-white/70">Cria textos, relatórios e materiais profissionais</p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-[#22D3EE]/30 transition-all">
              <h3 className="text-2xl font-bold text-[#22D3EE] mb-2">Organização Inteligente</h3>
              <p className="text-white/70">Agenda, integra e automatiza processos</p>
            </div>
          </div>

          {/* Subtle CTA */}
          <div className="pt-12">
            <p className="text-white/60 text-lg mb-4">Veja a Lia em ação abaixo ↓</p>
          </div>

          {/* Glow Effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse-glow" />
        </div>
      </div>
    </section>;
};
export default Hero;