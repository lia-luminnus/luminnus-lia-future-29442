import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LiaAtendimento from "@/components/LiaAtendimento";
import LiaSimulator from "@/components/LiaSimulator";
import Solutions from "@/components/Solutions";
import FuturePersonas from "@/components/FuturePersonas";
import Footer from "@/components/Footer";
import FloatingChatButton from "@/components/FloatingChatButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#0B0B0F]">
      <Header />
      <Hero />
      <LiaAtendimento />
      <LiaSimulator />
      <Solutions />
      <FuturePersonas />
      <Footer />
      <FloatingChatButton />
    </div>
  );
};

export default Index;
