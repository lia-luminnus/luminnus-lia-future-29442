import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, Eye, EyeOff, AlertCircle, RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { secureStorage } from "@/lib/secureStorage";
import { verificarStatusAPI } from "@/lib/api/lia";

interface ConfigData {
  openaiApiKey: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey: string;
  systemPrompt: string;
  webhookUrl: string;
  liaApiUrl: string;
}

export const AdminLiaConfig = () => {
  const { toast } = useToast();
  const [showKeys, setShowKeys] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testingApi, setTestingApi] = useState(false);
  const [apiStatus, setApiStatus] = useState<'idle' | 'online' | 'offline'>('idle');
  const [config, setConfig] = useState<ConfigData>({
    openaiApiKey: "",
    supabaseUrl: "",
    supabaseAnonKey: "",
    supabaseServiceRoleKey: "",
    systemPrompt: "",
    webhookUrl: "",
    liaApiUrl: "",
  });

  // Carregar configurações salvas ao montar o componente
  useEffect(() => {
    const savedConfig = secureStorage.load();
    if (savedConfig) {
      setConfig({
        openaiApiKey: savedConfig.openaiApiKey || savedConfig.openaiKey || "",
        supabaseUrl: savedConfig.supabaseUrl || "",
        supabaseAnonKey: savedConfig.supabaseAnonKey || savedConfig.supabaseAnonKey || "",
        supabaseServiceRoleKey: savedConfig.supabaseServiceRoleKey || savedConfig.supabaseServiceKey || "",
        systemPrompt: savedConfig.systemPrompt || "",
        webhookUrl: savedConfig.webhookUrl || "",
        liaApiUrl: savedConfig.liaApiUrl || "",
      });
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Salvar no secure storage
      secureStorage.save({
        openaiKey: config.openaiApiKey,
        openaiApiKey: config.openaiApiKey,
        supabaseUrl: config.supabaseUrl,
        supabaseAnonKey: config.supabaseAnonKey,
        supabaseServiceKey: config.supabaseServiceRoleKey,
        supabaseServiceRoleKey: config.supabaseServiceRoleKey,
        liaApiUrl: config.liaApiUrl,
        systemPrompt: config.systemPrompt,
        webhookUrl: config.webhookUrl,
      });

      // Aqui você também pode salvar em uma tabela do Supabase
      // para persistir as configurações no servidor
      // await supabase.from('admin_config').upsert({ ... });

      toast({
        title: "Configurações salvas",
        description: "As configurações da LIA foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof ConfigData, value: string) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Reset API status quando URL mudar
    if (field === 'liaApiUrl') {
      setApiStatus('idle');
    }
  };

  const handleTestApi = async () => {
    setTestingApi(true);
    setApiStatus('idle');

    try {
      // Salvar temporariamente a URL configurada para teste
      if (config.liaApiUrl) {
        secureStorage.save({ ...secureStorage.load(), liaApiUrl: config.liaApiUrl });
      }

      const isOnline = await verificarStatusAPI();

      if (isOnline) {
        setApiStatus('online');
        toast({
          title: "✅ API Online",
          description: "A API da LIA está respondendo corretamente!",
        });
      } else {
        setApiStatus('offline');
        toast({
          title: "❌ API Offline",
          description: "Não foi possível conectar à API. Verifique a URL e tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setApiStatus('offline');
      toast({
        title: "Erro ao testar API",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setTestingApi(false);
    }
  };

  const maskKey = (key: string) => {
    if (!key || showKeys) return key;
    if (key.length <= 8) return "••••••••";
    return key.slice(0, 4) + "••••••••" + key.slice(-4);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-purple-900">
          Configurações da LIA
        </h2>
        <p className="text-muted-foreground">
          Configure as variáveis de ambiente e credenciais da assistente
        </p>
      </div>

      {/* Warning Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Atenção:</strong> Estas configurações são sensíveis. Mantenha suas chaves
          de API seguras e nunca as compartilhe publicamente.
        </AlertDescription>
      </Alert>

      {/* OpenAI Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>OpenAI API</CardTitle>
          <CardDescription>
            Configure a chave de API da OpenAI para habilitar respostas inteligentes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="openai-key">OpenAI API Key</Label>
            <div className="flex gap-2">
              <Input
                id="openai-key"
                type={showKeys ? "text" : "password"}
                placeholder="sk-..."
                value={showKeys ? config.openaiApiKey : maskKey(config.openaiApiKey)}
                onChange={(e) => handleInputChange("openaiApiKey", e.target.value)}
                className="font-mono"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowKeys(!showKeys)}
              >
                {showKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Obtenha sua chave em{" "}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 underline"
              >
                platform.openai.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Supabase Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Supabase</CardTitle>
          <CardDescription>
            Configure as credenciais do Supabase para banco de dados e autenticação
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="supabase-url">Supabase URL</Label>
            <Input
              id="supabase-url"
              type="text"
              placeholder="https://seu-projeto.supabase.co"
              value={config.supabaseUrl}
              onChange={(e) => handleInputChange("supabaseUrl", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="supabase-anon">Supabase Anon Key (Public)</Label>
            <Input
              id="supabase-anon"
              type={showKeys ? "text" : "password"}
              placeholder="eyJ..."
              value={showKeys ? config.supabaseAnonKey : maskKey(config.supabaseAnonKey)}
              onChange={(e) => handleInputChange("supabaseAnonKey", e.target.value)}
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="supabase-service">Supabase Service Role Key (Secret)</Label>
            <Input
              id="supabase-service"
              type={showKeys ? "text" : "password"}
              placeholder="eyJ..."
              value={
                showKeys
                  ? config.supabaseServiceRoleKey
                  : maskKey(config.supabaseServiceRoleKey)
              }
              onChange={(e) => handleInputChange("supabaseServiceRoleKey", e.target.value)}
              className="font-mono"
            />
            <p className="text-xs text-red-500">
              ⚠️ Esta chave concede acesso total ao banco de dados. Use com extrema cautela.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* System Prompt */}
      <Card>
        <CardHeader>
          <CardTitle>Prompt do Sistema</CardTitle>
          <CardDescription>
            Defina como a LIA deve se comportar nas conversas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="system-prompt">System Prompt</Label>
            <Textarea
              id="system-prompt"
              placeholder="Você é a LIA, uma assistente virtual inteligente..."
              value={config.systemPrompt}
              onChange={(e) => handleInputChange("systemPrompt", e.target.value)}
              rows={6}
              className="resize-none font-mono text-sm"
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Este texto define a personalidade e comportamento da assistente
              </p>
              <p className={`text-xs ${
                config.systemPrompt.length > 2000 ? 'text-orange-500 font-semibold' :
                config.systemPrompt.length > 3000 ? 'text-red-500 font-bold' :
                'text-muted-foreground'
              }`}>
                {config.systemPrompt.length} caracteres
                {config.systemPrompt.length > 2000 && ' ⚠️'}
              </p>
            </div>
            {config.systemPrompt.length > 2000 && (
              <Alert className="border-orange-500 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  <strong>Atenção:</strong> Prompts muito longos ({config.systemPrompt.length} caracteres) podem causar problemas de armazenamento.
                  {config.systemPrompt.length > 3000 && (
                    <span className="block mt-1">
                      Recomendamos reduzir para menos de 2000 caracteres ou salvar em um arquivo externo.
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* LIA API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            API da LIA (Render)
            {apiStatus === 'online' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
            {apiStatus === 'offline' && <XCircle className="h-5 w-5 text-red-500" />}
          </CardTitle>
          <CardDescription>
            Configure a URL da API da LIA hospedada no Render
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lia-api-url">API da LIA (Render)</Label>
            <div className="flex gap-2">
              <Input
                id="lia-api-url"
                type="url"
                placeholder="https://lia-chat-api.onrender.com"
                value={config.liaApiUrl}
                onChange={(e) => handleInputChange("liaApiUrl", e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleTestApi}
                disabled={testingApi || !config.liaApiUrl}
                variant="outline"
                className="whitespace-nowrap"
              >
                {testingApi ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Testando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Testar Conexão
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              URL base da API da LIA hospedada no Render. É usada para comunicação direta entre o painel e a assistente.
            </p>
            {apiStatus === 'online' && (
              <p className="text-xs text-green-600 font-semibold">
                ✓ API está online e respondendo
              </p>
            )}
            {apiStatus === 'offline' && (
              <p className="text-xs text-red-600 font-semibold">
                ✗ API está offline ou inacessível. Pode estar hibernando (aguarde ~30s e teste novamente)
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Webhook Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Webhook (Opcional)</CardTitle>
          <CardDescription>
            Configure um webhook para receber notificações de eventos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <Input
              id="webhook-url"
              type="url"
              placeholder="https://seu-servidor.com/webhook"
              value={config.webhookUrl}
              onChange={(e) => handleInputChange("webhookUrl", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          size="lg"
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </div>
  );
};
