import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Bell,
  Shield,
  Palette,
  Save,
  Loader2,
  MessageCircle,
  Instagram,
  Facebook
} from "lucide-react";
import AdminImobLayout from "@/components/layout/AdminImobLayout";

const AdminConfiguracoes = () => {
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState({
    // Dados da Imobiliaria
    nomeImobiliaria: "Luminnus Imobiliaria",
    cnpj: "12.345.678/0001-00",
    creci: "123456-J",
    email: "contato@luminnus.com.br",
    telefone: "(11) 99999-9999",
    whatsapp: "(11) 99999-9999",
    endereco: "Av. Paulista, 1000",
    cidade: "Sao Paulo",
    estado: "SP",
    cep: "01310-100",
    website: "https://luminnus.com.br",

    // Redes Sociais
    instagram: "@luminnusimob",
    facebook: "luminnusimobiliaria",

    // Notificacoes
    notificacoesEmail: true,
    notificacoesWhatsapp: true,
    notificacoesNovoCliente: true,
    notificacoesNovaVisita: true,
    notificacoesDocumentoPendente: true,

    // Configuracoes de Sistema
    idioma: "pt-BR",
    fusoHorario: "America/Sao_Paulo",
    moeda: "BRL",

    // Aparencia
    corPrimaria: "#7B2FF7",
    modoEscuroPadrao: false
  });

  const handleChange = (field: string, value: string | boolean) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    alert("Configuracoes salvas com sucesso!");
  };

  return (
    <AdminImobLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Configuracoes</h1>
            <p className="text-muted-foreground">Gerencie as configuracoes da imobiliaria</p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
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

        <Tabs defaultValue="empresa" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="empresa" className="gap-2">
              <Building2 className="w-4 h-4" />
              Empresa
            </TabsTrigger>
            <TabsTrigger value="notificacoes" className="gap-2">
              <Bell className="w-4 h-4" />
              Notificacoes
            </TabsTrigger>
            <TabsTrigger value="sistema" className="gap-2">
              <Shield className="w-4 h-4" />
              Sistema
            </TabsTrigger>
            <TabsTrigger value="aparencia" className="gap-2">
              <Palette className="w-4 h-4" />
              Aparencia
            </TabsTrigger>
          </TabsList>

          {/* Dados da Empresa */}
          <TabsContent value="empresa" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informacoes da Imobiliaria</CardTitle>
                <CardDescription>Dados cadastrais da empresa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nomeImobiliaria">Nome da Imobiliaria</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="nomeImobiliaria"
                        value={config.nomeImobiliaria}
                        onChange={(e) => handleChange("nomeImobiliaria", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      value={config.cnpj}
                      onChange={(e) => handleChange("cnpj", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="creci">CRECI</Label>
                    <Input
                      id="creci"
                      value={config.creci}
                      onChange={(e) => handleChange("creci", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={config.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="telefone"
                        value={config.telefone}
                        onChange={(e) => handleChange("telefone", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <div className="relative">
                      <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="whatsapp"
                        value={config.whatsapp}
                        onChange={(e) => handleChange("whatsapp", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Endereco</CardTitle>
                <CardDescription>Localizacao da imobiliaria</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereco</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="endereco"
                      value={config.endereco}
                      onChange={(e) => handleChange("endereco", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      value={config.cidade}
                      onChange={(e) => handleChange("cidade", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Input
                      id="estado"
                      value={config.estado}
                      onChange={(e) => handleChange("estado", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      value={config.cep}
                      onChange={(e) => handleChange("cep", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="website"
                      value={config.website}
                      onChange={(e) => handleChange("website", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Redes Sociais</CardTitle>
                <CardDescription>Perfis nas redes sociais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <div className="relative">
                      <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="instagram"
                        value={config.instagram}
                        onChange={(e) => handleChange("instagram", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <div className="relative">
                      <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="facebook"
                        value={config.facebook}
                        onChange={(e) => handleChange("facebook", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notificacoes */}
          <TabsContent value="notificacoes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Canais de Notificacao</CardTitle>
                <CardDescription>Escolha como deseja receber notificacoes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificacoes por Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba atualizacoes importantes por email
                    </p>
                  </div>
                  <Switch
                    checked={config.notificacoesEmail}
                    onCheckedChange={(checked) => handleChange("notificacoesEmail", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificacoes por WhatsApp</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba atualizacoes em tempo real via WhatsApp
                    </p>
                  </div>
                  <Switch
                    checked={config.notificacoesWhatsapp}
                    onCheckedChange={(checked) => handleChange("notificacoesWhatsapp", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tipos de Notificacao</CardTitle>
                <CardDescription>Selecione quais eventos deseja ser notificado</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Novo Cliente</Label>
                    <p className="text-sm text-muted-foreground">
                      Quando um novo cliente se cadastrar
                    </p>
                  </div>
                  <Switch
                    checked={config.notificacoesNovoCliente}
                    onCheckedChange={(checked) => handleChange("notificacoesNovoCliente", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Nova Visita Agendada</Label>
                    <p className="text-sm text-muted-foreground">
                      Quando uma nova visita for agendada
                    </p>
                  </div>
                  <Switch
                    checked={config.notificacoesNovaVisita}
                    onCheckedChange={(checked) => handleChange("notificacoesNovaVisita", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Documento Pendente</Label>
                    <p className="text-sm text-muted-foreground">
                      Lembrete de documentos pendentes de clientes
                    </p>
                  </div>
                  <Switch
                    checked={config.notificacoesDocumentoPendente}
                    onCheckedChange={(checked) => handleChange("notificacoesDocumentoPendente", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sistema */}
          <TabsContent value="sistema" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuracoes Regionais</CardTitle>
                <CardDescription>Defina as preferencias de localizacao</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="idioma">Idioma</Label>
                    <Select
                      value={config.idioma}
                      onValueChange={(value) => handleChange("idioma", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">Portugues (Brasil)</SelectItem>
                        <SelectItem value="pt-PT">Portugues (Portugal)</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Espanol</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fusoHorario">Fuso Horario</Label>
                    <Select
                      value={config.fusoHorario}
                      onValueChange={(value) => handleChange("fusoHorario", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Sao_Paulo">Brasilia (GMT-3)</SelectItem>
                        <SelectItem value="America/Manaus">Manaus (GMT-4)</SelectItem>
                        <SelectItem value="America/Cuiaba">Cuiaba (GMT-4)</SelectItem>
                        <SelectItem value="America/Rio_Branco">Rio Branco (GMT-5)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="moeda">Moeda</Label>
                    <Select
                      value={config.moeda}
                      onValueChange={(value) => handleChange("moeda", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BRL">Real (R$)</SelectItem>
                        <SelectItem value="USD">Dolar ($)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Seguranca</CardTitle>
                <CardDescription>Configuracoes de seguranca da conta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg border border-border bg-muted/50">
                  <h4 className="font-medium text-foreground mb-2">Alterar Senha</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Recomendamos alterar sua senha periodicamente para maior seguranca.
                  </p>
                  <Button variant="outline">Alterar Senha</Button>
                </div>

                <div className="p-4 rounded-lg border border-border bg-muted/50">
                  <h4 className="font-medium text-foreground mb-2">Autenticacao em Dois Fatores</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Adicione uma camada extra de seguranca a sua conta.
                  </p>
                  <Button variant="outline">Configurar 2FA</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aparencia */}
          <TabsContent value="aparencia" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personalizacao</CardTitle>
                <CardDescription>Customize a aparencia do sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="corPrimaria">Cor Primaria</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="corPrimaria"
                      type="color"
                      value={config.corPrimaria}
                      onChange={(e) => handleChange("corPrimaria", e.target.value)}
                      className="w-20 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={config.corPrimaria}
                      onChange={(e) => handleChange("corPrimaria", e.target.value)}
                      className="flex-1"
                      placeholder="#7B2FF7"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Esta cor sera usada como destaque em todo o sistema
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Modo Escuro Padrao</Label>
                    <p className="text-sm text-muted-foreground">
                      Iniciar o sistema sempre no modo escuro
                    </p>
                  </div>
                  <Switch
                    checked={config.modoEscuroPadrao}
                    onCheckedChange={(checked) => handleChange("modoEscuroPadrao", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Logotipo</CardTitle>
                <CardDescription>Personalize o logotipo da imobiliaria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-lg bg-muted flex items-center justify-center">
                    <Building2 className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Arraste uma imagem ou clique para fazer upload
                  </p>
                  <Button variant="outline">Escolher Arquivo</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminImobLayout>
  );
};

export default AdminConfiguracoes;
