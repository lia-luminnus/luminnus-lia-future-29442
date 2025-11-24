import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, MapPin, User, Phone, Plus, Edit, Trash2 } from "lucide-react";
import AdminImobLayout from "@/components/layout/AdminImobLayout";

// Mock data for appointments
const agendamentosMock = [
  {
    id: 1,
    tipo: "Visita",
    cliente: "Maria Silva",
    telefone: "(11) 99999-1111",
    imovel: "Apartamento Moderno Centro",
    endereco: "Rua Augusta, 1500 - Centro",
    data: "2024-11-25",
    hora: "14:00",
    corretor: "Ana Costa",
    status: "confirmado"
  },
  {
    id: 2,
    tipo: "Visita",
    cliente: "Joao Santos",
    telefone: "(11) 99999-2222",
    imovel: "Casa com Jardim",
    endereco: "Alameda Santos, 800 - Jardins",
    data: "2024-11-25",
    hora: "16:00",
    corretor: "Pedro Lima",
    status: "pendente"
  },
  {
    id: 3,
    tipo: "Reuniao",
    cliente: "Ana Costa",
    telefone: "(11) 99999-3333",
    imovel: "Documentacao Bancaria",
    endereco: "Escritorio Luminnus - Av. Paulista",
    data: "2024-11-26",
    hora: "10:00",
    corretor: "Maria Silva",
    status: "confirmado"
  },
  {
    id: 4,
    tipo: "Assinatura",
    cliente: "Pedro Lima",
    telefone: "(11) 99999-4444",
    imovel: "Studio Compacto",
    endereco: "Cartorio Central",
    data: "2024-11-27",
    hora: "09:00",
    corretor: "Joao Santos",
    status: "confirmado"
  },
];

const AdminAgenda = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Get appointments for selected date
  const selectedDateStr = selectedDate?.toISOString().split('T')[0];
  const appointmentsForDate = agendamentosMock.filter(a => a.data === selectedDateStr);

  // Get all dates with appointments
  const datesWithAppointments = agendamentosMock.map(a => new Date(a.data));

  const getTypeBadge = (tipo: string) => {
    switch (tipo) {
      case "Visita":
        return <Badge className="bg-blue-500">Visita</Badge>;
      case "Reuniao":
        return <Badge className="bg-purple-500">Reuniao</Badge>;
      case "Assinatura":
        return <Badge className="bg-green-500">Assinatura</Badge>;
      default:
        return <Badge>{tipo}</Badge>;
    }
  };

  return (
    <AdminImobLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Agenda</h1>
            <p className="text-muted-foreground">Gerencie visitas e reunioes</p>
          </div>
          <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            Novo Agendamento
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{agendamentosMock.length}</p>
              <p className="text-sm text-muted-foreground">Total Agendados</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-500">
                {agendamentosMock.filter(a => a.tipo === 'Visita').length}
              </p>
              <p className="text-sm text-muted-foreground">Visitas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-purple-500">
                {agendamentosMock.filter(a => a.tipo === 'Reuniao').length}
              </p>
              <p className="text-sm text-muted-foreground">Reunioes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-orange-500">
                {agendamentosMock.filter(a => a.status === 'pendente').length}
              </p>
              <p className="text-sm text-muted-foreground">Pendentes</p>
            </CardContent>
          </Card>
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

          {/* Appointments for Selected Date */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>
                {selectedDate ? (
                  <>Agendamentos em {selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</>
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
                      className="p-4 rounded-lg border border-border bg-card"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getTypeBadge(agendamento.tipo)}
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
                        <div className="flex items-center gap-1 text-sm font-medium text-foreground">
                          <Clock className="w-4 h-4" />
                          {agendamento.hora}
                        </div>
                      </div>

                      <h3 className="font-semibold text-foreground mb-2">
                        {agendamento.imovel}
                      </h3>

                      <div className="space-y-1 text-sm text-muted-foreground mb-3">
                        <p className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Cliente: {agendamento.cliente}
                        </p>
                        <p className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {agendamento.telefone}
                        </p>
                        <p className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {agendamento.endereco}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Corretor: <span className="text-foreground">{agendamento.corretor}</span>
                        </p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-1">
                            <Edit className="w-4 h-4" />
                            Editar
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhum agendamento para esta data</p>
                  <Button
                    variant="link"
                    className="mt-2"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    Criar agendamento
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* All Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Todos os Proximos Agendamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {agendamentosMock.map((agendamento) => (
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
                      <div className="flex items-center gap-2 mb-1">
                        {getTypeBadge(agendamento.tipo)}
                        <span className="font-medium text-foreground">{agendamento.cliente}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {agendamento.hora} - {agendamento.imovel}
                      </p>
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

        {/* New Appointment Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Agendamento</DialogTitle>
              <DialogDescription>
                Preencha os dados do agendamento
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select defaultValue="Visita">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Visita">Visita</SelectItem>
                      <SelectItem value="Reuniao">Reuniao</SelectItem>
                      <SelectItem value="Assinatura">Assinatura</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cliente">Cliente</Label>
                  <Input id="cliente" placeholder="Nome do cliente" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="imovel">Imovel/Assunto</Label>
                <Input id="imovel" placeholder="Imovel ou assunto da reuniao" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereco</Label>
                <Input id="endereco" placeholder="Local do encontro" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data">Data</Label>
                  <Input id="data" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hora">Hora</Label>
                  <Input id="hora" type="time" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="corretor">Corretor Responsavel</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o corretor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ana">Ana Costa</SelectItem>
                    <SelectItem value="pedro">Pedro Lima</SelectItem>
                    <SelectItem value="maria">Maria Silva</SelectItem>
                    <SelectItem value="joao">Joao Santos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>
                Criar Agendamento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminImobLayout>
  );
};

export default AdminAgenda;
