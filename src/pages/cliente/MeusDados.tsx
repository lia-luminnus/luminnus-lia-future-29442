import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Mail, Phone, MapPin, Save, Loader2 } from "lucide-react";
import ClienteLayout from "@/components/layout/ClienteLayout";
import { getClienteById, updateCliente, type Cliente } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const ClienteMeusDados = () => {
  const { user, clienteId } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: ""
  });

  useEffect(() => {
    const loadCliente = async () => {
      if (!clienteId) {
        // Use dados do user se nao tiver clienteId
        setFormData({
          nome: user?.user_metadata?.full_name || "",
          email: user?.email || "",
          telefone: "",
          endereco: ""
        });
        setLoading(false);
        return;
      }

      try {
        const data = await getClienteById(clienteId);
        if (data) {
          setCliente(data);
          setFormData({
            nome: data.nome || "",
            email: data.email || "",
            telefone: data.telefone || "",
            endereco: data.endereco || ""
          });
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast({
          title: "Erro",
          description: "Nao foi possivel carregar seus dados",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadCliente();
  }, [clienteId, user, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clienteId) {
      toast({
        title: "Erro",
        description: "Nao foi possivel identificar seu cadastro",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);

    try {
      const updated = await updateCliente(clienteId, {
        nome: formData.nome,
        telefone: formData.telefone,
        endereco: formData.endereco
      });

      setCliente(updated);

      toast({
        title: "Sucesso",
        description: "Dados atualizados com sucesso!"
      });
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast({
        title: "Erro",
        description: "Nao foi possivel salvar as alteracoes",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
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
          <h1 className="text-2xl font-bold text-foreground">Meus Dados</h1>
          <p className="text-muted-foreground">Gerencie suas informacoes pessoais</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardContent className="p-6 text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-1">
                {formData.nome || "Usuario"}
              </h3>
              <p className="text-muted-foreground flex items-center justify-center gap-1">
                <Mail className="w-4 h-4" />
                {formData.email}
              </p>
              {cliente && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">Cliente desde</p>
                  <p className="font-medium text-foreground">
                    {new Date(cliente.created_at).toLocaleDateString("pt-BR", {
                      month: "long",
                      year: "numeric"
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">Status do processo</p>
                  <p className="font-medium text-primary capitalize">
                    {cliente.status_processo?.replace("_", " ") || "Inicial"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Informacoes Pessoais</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        className="pl-10"
                        placeholder="Seu nome completo"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        className="pl-10"
                        disabled
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">O email nao pode ser alterado</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereco</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Textarea
                      id="endereco"
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleChange}
                      className="pl-10 min-h-[80px]"
                      placeholder="Rua, numero, bairro, cidade - estado"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={saving} className="gap-2">
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Salvar Alteracoes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ClienteLayout>
  );
};

export default ClienteMeusDados;
