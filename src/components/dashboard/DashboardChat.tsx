import { Card, CardContent } from '@/components/ui/card';
import { Bot, Sparkles } from 'lucide-react';

/**
 * COMPONENTE: DashboardChat
 *
 * Interface de chat com a Lia
 */
const DashboardChat = () => {
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Bot className="w-8 h-8 text-[#00C2FF]" />
          Chat com a Lia
        </h1>
        <p className="text-white/60">
          Converse com sua assistente inteligente
        </p>
      </div>

      {/* CHAT INTERFACE */}
      <Card className="bg-white/5 backdrop-blur-lg border border-white/10 min-h-[600px]">
        <CardContent className="flex flex-col items-center justify-center h-[600px]">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#6A00FF]/20 to-[#00C2FF]/20 flex items-center justify-center mb-6 animate-pulse">
            <Bot className="w-12 h-12 text-[#00C2FF]" />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-3 flex items-center gap-2">
            Olá! Sou a Lia
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </h3>
          <p className="text-white/60 text-center max-w-md mb-6">
            Estou aqui para ajudar você a gerenciar suas conversas, agendamentos e muito mais. Em breve teremos um chat completo aqui!
          </p>
          <div className="px-6 py-3 rounded-full bg-gradient-to-r from-[#6A00FF] to-[#00C2FF] text-white font-medium">
            Em breve disponível
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardChat;
