import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Building2, Loader2, CalendarIcon } from "lucide-react";
import ClienteLayout from "@/components/layout/ClienteLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getAgenda, updateAgendaEvento, type AgendaEvento } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const ClienteAgenda = () => {
  const { clienteId } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(true);
  const [agendamentos, setAgendamentos] = useState<AgendaEvento[]>([]);

  useEffect(() => {
    const loadAgenda = async () => {
      if (!clienteId) {
        setLoading(false);
        return;
      }

      try {
        const data = await getAgenda(clienteId);
        setAgendamentos(data);
      } catch (error) {
        console.error("Erro ao carregar agenda:", error);
        toast({
          title: "Erro",
          description: "Nao foi possivel carregar a agenda",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadAgenda();
  }, [clienteId, toast]);

  // Get appointments for selected date
  const selectedDateStr = selectedDate?.toISOString().split("T")[0];
  const appointmentsForDate = agendamentos.filter((a) => a.data === selectedDateStr);

  // Get all dates with appointments
  const datesWithAppointments = agendamentos.map((a) => new Date(a.data));

  const handleConfirmar = async (id: string) => {
    try {
      await updateAgendaEvento(id, { status: "confirmado" });
      setAgendamentos((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "confirmado" } : a))
      );
      toast({
        title: "Sucesso",
        description: "Compromisso confirmado!"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Nao foi possivel confirmar o compromisso",
        variant: "destructive"
      });
    }
  };

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      visita: "Visita",
      reuniao: "Reuniao",
      entrega_docs: "Entrega de Docs",
      assinatura: "Assinatura",
      outro: "Outro"
    };
    return labels[tipo] || tipo;
  };

  if (loading) {
    return (
      <ClienteLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </ClienteLayout>
    );
  }

  return (
    <ClienteLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Agenda</h1>
          <p className="text-muted-foreground">Gerencie suas visitas e reunioes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Calendario</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={{
                  hasAppointment: datesWithAppointments
                }}
                modifiersStyles={{
                  hasAppointment: {
                    backgroundColor: "hsl(var(--primary) / 0.2)",
                    fontWeight: "bold"
                  }
                }}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          {/* Appointments List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>
                {selectedDate ? (
                  <>
                    Compromissos em{" "}
                    {selectedDate.toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric"
                    })}
                  </>
                ) : (
                  <>Selecione uma data</>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {appointmentsForDate.length > 0 ? (
                <div className="space-y-4">
                  {appointmentsForDate.map((agendamento) => (
                    <div
                      key={agendamento.id}
                      className="p-4 rounded-lg border border-border bg-card hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant={agendamento.tipo === "visita" ? "default" : "secondary"}>
                            {getTipoLabel(agendamento.tipo)}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={
                              agendamento.status === "confirmado"
                                ? "border-green-500 text-green-600"
                                : agendamento.status === "cancelado"
                                ? "border-red-500 text-red-600"
                                : "border-orange-500 text-orange-600"
                            }
                          >
                            {agendamento.status === "confirmado"
                              ? "Confirmado"
                              : agendamento.status === "cancelado"
                              ? "Cancelado"
                              : "Agendado"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {agendamento.hora}
                        </div>
                      </div>

                      <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-primary" />
                        {agendamento.descricao || `${getTipoLabel(agendamento.tipo)} agendada`}
                      </h3>

                      <div className="flex gap-2 mt-4">
                        {agendamento.status === "agendado" && (
                          <Button size="sm" onClick={() => handleConfirmar(agendamento.id)}>
                            Confirmar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhum compromisso para esta data</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* All Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Todos os Proximos Compromissos</CardTitle>
          </CardHeader>
          <CardContent>
            {agendamentos.length > 0 ? (
              <div className="space-y-3">
                {agendamentos
                  .filter((a) => a.status !== "cancelado")
                  .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
                  .map((agendamento) => (
                    <div
                      key={agendamento.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-center min-w-[50px]">
                          <p className="text-lg font-bold text-foreground">
                            {new Date(agendamento.data).getDate()}
                          </p>
                          <p className="text-xs text-muted-foreground uppercase">
                            {new Date(agendamento.data).toLocaleDateString("pt-BR", {
                              month: "short"
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {agendamento.descricao || getTipoLabel(agendamento.tipo)}
                          </p>
                          <p className="text-sm text-muted-foreground">{agendamento.hora}</p>
                        </div>
                      </div>
                      <Badge variant={agendamento.status === "confirmado" ? "default" : "secondary"}>
                        {agendamento.status === "confirmado" ? "Confirmado" : "Agendado"}
                      </Badge>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">
                Nenhum compromisso agendado
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </ClienteLayout>
  );
};

export default ClienteAgenda;
