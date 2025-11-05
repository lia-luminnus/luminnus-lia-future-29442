const AboutLuminnus = () => {
  return (
    <section
      id="about-luminnus"
      className="relative overflow-hidden"
      style={{
        background: '#0B0B0D',
        color: '#FFFFFF',
        padding: '100px 5%'
      }}
    >
      {/* Background Effect */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse-glow" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div className="space-y-6 text-lg lg:text-xl leading-relaxed">
            <p>
              A Luminnus é uma empresa especializada em soluções de automação e inteligência artificial para negócios.
              Ela ajuda empresas a economizarem tempo, reduzirem custos e aumentarem a produtividade através da LIA — a mente cognitiva inteligente que pensa, age e aprende.
            </p>

            <p>
              A LIA atua como atendente, gestora e automatizadora de processos, capaz de responder clientes 24h, organizar tarefas, integrar sistemas, gerar relatórios e até personalizar painéis de controle.
              Com isso, negócios de qualquer porte conseguem aumentar lucros, escalar operações e oferecer atendimento rápido e eficiente sem precisar ampliar equipes.
            </p>

            <p className="text-2xl lg:text-3xl font-semibold pt-6 text-center">
              <span className="bg-gradient-to-r from-[#7C3AED] via-[#FF2E9E] to-[#22D3EE] bg-clip-text text-transparent">
                Em resumo:
              </span>
              <br />
              <span className="text-white mt-2 block">
                Luminnus cria a tecnologia. <span className="font-bold text-primary">LIA executa.</span> O negócio cresce.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutLuminnus;
