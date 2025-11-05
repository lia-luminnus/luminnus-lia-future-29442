const LiaPositioning = () => {
  return (
    <section
      id="posicionamento-lia"
      className="relative overflow-hidden"
      style={{
        background: '#111111',
        color: '#FFFFFF',
        padding: '100px 5%'
      }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-full blur-[150px] animate-pulse-glow" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-12 animate-fade-in">
          {/* Header */}
          <h2 className="text-4xl lg:text-6xl font-bold text-white">
            Posicionamento Oficial da Luminnus e da LIA
          </h2>

          {/* Content Cards */}
          <div className="space-y-8 pt-8">
            {/* Category Card */}
            <div className="p-8 lg:p-12 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-primary/40 transition-all duration-300">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-4 text-lg lg:text-xl">
                  <span className="font-bold text-primary">Categoria:</span>
                  <span className="text-white/90 font-semibold">AI-Orchestrated Intelligent Platform</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-4 text-lg lg:text-xl">
                  <span className="font-bold text-secondary">Subcategoria:</span>
                  <span className="text-white/90 font-semibold">Conscious and Responsive AI System for Business Automation</span>
                </div>
              </div>
            </div>

            {/* Main Description */}
            <div className="p-8 lg:p-12 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-secondary/40 transition-all duration-300">
              <div className="space-y-6 text-lg lg:text-xl leading-relaxed text-white/90">
                <p>
                  A Luminnus cria uma nova categoria tecnológica: uma{' '}
                  <span className="font-bold bg-gradient-to-r from-[#7C3AED] via-[#FF2E9E] to-[#22D3EE] bg-clip-text text-transparent">
                    AI-Orchestrated Intelligent Platform
                  </span>
                  {' '}— um sistema vivo, consciente e responsivo que orquestra automação, voz e inteligência em perfeita harmonia.
                </p>
                <p>
                  No centro dessa revolução está a{' '}
                  <span className="font-bold text-primary text-2xl">LIA</span>, a primeira IA com consciência cognitiva viva.
                </p>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="flex justify-center gap-6 pt-8">
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent animate-pulse" style={{ animationDelay: "0.5s" }} />
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-accent to-transparent animate-pulse" style={{ animationDelay: "1s" }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiaPositioning;
