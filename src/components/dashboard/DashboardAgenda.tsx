import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';

/**
 * COMPONENTE: DashboardAgenda
 *
 * Página de agenda com agendamentos
 */
const DashboardAgenda = () => {
  // Placeholder - futuramente virá do Supabase
  const agendamentos: any[] = [];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Agenda
        </h1>
        <p className="text-white/60">
          Gerencie seus compromissos e agendamentos
        </p>
      </div>

      {/* LISTA DE AGENDAMENTOS OU PLACEHOLDER */}
      {agendamentos.length === 0 ? (
        <Card className="bg-white/5 backdrop-blur-lg border border-white/10">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center mb-4">
              <Calendar className="w-10 h-10 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Nenhum agendamento
            </h3>
            <p className="text-white/60 text-center max-w-md">
              Você não possui agendamentos no momento. A Lia pode gerenciar sua agenda automaticamente quando você configurar as integrações.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {agendamentos.map((agendamento, index) => (
            <Card key={index} className="bg-white/5 backdrop-blur-lg border border-white/10 hover:border-green-500/30 transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-lg">
                      {agendamento.titulo}
                    </CardTitle>
                    <CardDescription className="text-white/60 flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4" />
                      {agendamento.horario}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardAgenda;
