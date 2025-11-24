import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Building2, CalendarIcon, CheckCircle2, CalendarDays, CalendarCheck } from "lucide-react";
import ClienteLayout from "@/components/layout/ClienteLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getAgenda, updateAgendaEvento, type AgendaEvento } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/ui/Loading";
import EmptyState from "@/components/ui/EmptyState";
import MotionPageTransition, { StaggeredMotionContainer, StaggeredItem, HoverCardAnimation } from "@/components/layout/MotionPageTransition";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  // Stats
  const totalAgendados = agendamentos.length;
  const confirmados = agendamentos.filter(a => a.status === "confirmado").length;
  const pendentes = agendamentos.filter(a => a.status === "agendado").length;

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmado":
        return <Badge className="bg-green-500 hover:bg-green-500/90">Confirmado</Badge>;
      case "cancelado":
        return <Badge className="bg-red-500 hover:bg-red-500/90">Cancelado</Badge>;
      default:
        return <Badge className="bg-orange-500 hover:bg-orange-500/90">Agendado</Badge>;
    }
  };

  if (loading) {
    return (
      <ClienteLayout>
        <Loading message="Carregando sua agenda..." size="lg" variant="pulse" />
      </ClienteLayout>
    );
  }

  return (
    <ClienteLayout>
      <MotionPageTransition>
        <div className="p-6 lg:p-8 space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <CalendarDays className="w-7 h-7 text-[#7B2FF7]" />
              Agenda
            </h1>
            <p className="text-muted-foreground mt-1">Gerencie suas visitas e reunioes</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <HoverCardAnimation>
              <Card className="border-0 shadow-[var(--shadow-md)] bg-gradient-to-br from-[#7B2FF7]/5 to-transparent">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#7B2FF7]/10 flex items-center justify-center">
                      <CalendarDays className="w-6 h-6 text-[#7B2FF7]" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-[#7B2FF7]">{totalAgendados}</p>
                      <p className="text-sm text-muted-foreground">Total Agendados</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </HoverCardAnimation>
            <HoverCardAnimation>
              <Card className="border-0 shadow-[var(--shadow-md)] bg-gradient-to-br from-green-500/5 to-transparent">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <CalendarCheck className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-green-500">{confirmados}</p>
                      <p className="text-sm text-muted-foreground">Confirmados</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </HoverCardAnimation>
            <HoverCardAnimation>
              <Card className="border-0 shadow-[var(--shadow-md)] bg-gradient-to-br from-orange-500/5 to-transparent">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-orange-500">{pendentes}</p>
                      <p className="text-sm text-muted-foreground">Pendentes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </HoverCardAnimation>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <Card className="lg:col-span-1 border-0 shadow-[var(--shadow-md)]">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-[#7B2FF7]" />
                  Calendario
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center pb-6">
                <TooltipProvider>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    modifiers={{
                      hasAppointment: datesWithAppointments,
                      today: [new Date()]
                    }}
                    modifiersStyles={{
                      hasAppointment: {
                        backgroundColor: "rgba(123, 47, 247, 0.15)",
                        fontWeight: "600",
                        color: "#7B2FF7"
                      },
                      today: {
                        backgroundColor: "#7B2FF7",
                        color: "white",
                        fontWeight: "bold"
                      }
                    }}
                    className="rounded-xl border border-[var(--lum-border)] dark:border-[var(--lum-border-dark)] p-3"
                  />
                </TooltipProvider>
              </CardContent>
            </Card>

            {/* Appointments List */}
            <Card className="lg:col-span-2 border-0 shadow-[var(--shadow-md)]">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">
                  {selectedDate ? (
                    <span className="flex items-center gap-2">
                      Compromissos em{" "}
                      <span className="text-[#7B2FF7]">
                        {selectedDate.toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric"
                        })}
                      </span>
                    </span>
                  ) : (
                    <>Selecione uma data</>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {appointmentsForDate.length > 0 ? (
                  <StaggeredMotionContainer className="space-y-4">
                    {appointmentsForDate.map((agendamento) => (
                      <StaggeredItem key={agendamento.id}>
                        <div className="p-5 rounded-xl border border-[var(--lum-border)] dark:border-[var(--lum-border-dark)] bg-card hover:shadow-[var(--shadow-md)] transition-all duration-[var(--transition-smooth)]">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant={agendamento.tipo === "visita" ? "default" : "secondary"} className="shadow-sm">
                                {getTipoLabel(agendamento.tipo)}
                              </Badge>
                              {getStatusBadge(agendamento.status)}
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg">
                              <Clock className="w-4 h-4" />
                              <span className="font-medium">{agendamento.hora}</span>
                            </div>
                          </div>

                          <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-[#7B2FF7]" />
                            {agendamento.descricao || `${getTipoLabel(agendamento.tipo)} agendada`}
                          </h3>

                          {agendamento.status === "agendado" && (
                            <div className="flex gap-3 mt-4 pt-4 border-t border-[var(--lum-border)] dark:border-[var(--lum-border-dark)]">
                              <Button size="sm" onClick={() => handleConfirmar(agendamento.id)} className="gap-2 shadow-luminnus">
                                <CheckCircle2 className="w-4 h-4" />
                                Confirmar Presenca
                              </Button>
                            </div>
                          )}
                        </div>
                      </StaggeredItem>
                    ))}
                  </StaggeredMotionContainer>
                ) : (
                  <EmptyState
                    variant="default"
                    icon={CalendarIcon}
                    title="Nenhum compromisso"
                    message="Nenhum compromisso agendado para esta data."
                    size="sm"
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* All Upcoming Appointments */}
          <Card className="border-0 shadow-[var(--shadow-md)]">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-[#7B2FF7]" />
                Todos os Proximos Compromissos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {agendamentos.length > 0 ? (
                <StaggeredMotionContainer className="space-y-3">
                  {agendamentos
                    .filter((a) => a.status !== "cancelado")
                    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
                    .map((agendamento) => (
                      <StaggeredItem key={agendamento.id}>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-[var(--lum-border)] dark:border-[var(--lum-border-dark)] hover:bg-muted/50 transition-all duration-[var(--transition)]">
                          <div className="flex items-center gap-4">
                            <div className="text-center min-w-[60px] p-2 rounded-xl bg-[#7B2FF7]/10">
                              <p className="text-xl font-bold text-[#7B2FF7]">
                                {new Date(agendamento.data).getDate()}
                              </p>
                              <p className="text-xs text-[#7B2FF7]/70 uppercase font-medium">
                                {new Date(agendamento.data).toLocaleDateString("pt-BR", {
                                  month: "short"
                                })}
                              </p>
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">
                                {agendamento.descricao || getTipoLabel(agendamento.tipo)}
                              </p>
                              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                <Clock className="w-3.5 h-3.5" />
                                {agendamento.hora}
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(agendamento.status)}
                        </div>
                      </StaggeredItem>
                    ))}
                </StaggeredMotionContainer>
              ) : (
                <EmptyState
                  variant="default"
                  title="Nenhum compromisso"
                  message="Voce ainda nao tem nenhum compromisso agendado."
                  size="sm"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </MotionPageTransition>
    </ClienteLayout>
  );
};

export default ClienteAgenda;
