import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Building2, User, Phone } from "lucide-react";
import ClienteLayout from "@/components/layout/ClienteLayout";

// Mock data for appointments
const agendamentos = [
  {
    id: 1,
    tipo: "Visita",
    imovel: "Apartamento Moderno Centro",
    endereco: "Rua Augusta, 1500 - Centro",
    data: "2024-11-25",
    hora: "14:00",
    corretor: "Maria Silva",
    telefone: "(11) 99999-1111",
    status: "confirmado"
  },
  {
    id: 2,
    tipo: "Visita",
    imovel: "Casa com Jardim",
    endereco: "Alameda Santos, 800 - Jardins",
    data: "2024-11-27",
    hora: "10:00",
    corretor: "Joao Santos",
    telefone: "(11) 99999-2222",
    status: "pendente"
  },
  {
    id: 3,
    tipo: "Reuniao",
    imovel: "Documentacao Bancaria",
    endereco: "Escritorio Luminnus - Av. Paulista",
    data: "2024-11-28",
    hora: "15:00",
    corretor: "Ana Costa",
    telefone: "(11) 99999-3333",
    status: "confirmado"
  },
];

const ClienteAgenda = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Get appointments for selected date
  const selectedDateStr = selectedDate?.toISOString().split('T')[0];
  const appointmentsForDate = agendamentos.filter(a => a.data === selectedDateStr);

  // Get all dates with appointments
  const datesWithAppointments = agendamentos.map(a => new Date(a.data));

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
                    backgroundColor: 'hsl(var(--primary) / 0.2)',
                    fontWeight: 'bold'
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
                  <>Compromissos em {selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</>
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
                          <Badge variant={agendamento.tipo === "Visita" ? "default" : "secondary"}>
                            {agendamento.tipo}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={
                              agendamento.status === "confirmado"
                                ? "border-green-500 text-green-600"
                                : "border-orange-500 text-orange-600"
                            }
                          >
                            {agendamento.status === "confirmado" ? "Confirmado" : "Pendente"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {agendamento.hora}
                        </div>
                      </div>

                      <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-primary" />
                        {agendamento.imovel}
                      </h3>

                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {agendamento.endereco}
                        </p>
                        <p className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Corretor: {agendamento.corretor}
                        </p>
                        <p className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {agendamento.telefone}
                        </p>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline">
                          Reagendar
                        </Button>
                        {agendamento.status === "pendente" && (
                          <Button size="sm">
                            Confirmar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
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
            <div className="space-y-3">
              {agendamentos.map((agendamento) => (
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
                        {new Date(agendamento.data).toLocaleDateString('pt-BR', { month: 'short' })}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{agendamento.imovel}</p>
                      <p className="text-sm text-muted-foreground">{agendamento.hora} - {agendamento.corretor}</p>
                    </div>
                  </div>
                  <Badge
                    variant={agendamento.status === "confirmado" ? "default" : "secondary"}
                  >
                    {agendamento.status === "confirmado" ? "Confirmado" : "Pendente"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ClienteLayout>
  );
};

export default ClienteAgenda;
