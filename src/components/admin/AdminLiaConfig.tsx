/**
 * COMPONENTE: AdminLiaConfig
 *
 * Página de configurações completa com 3 abas:
 * - Aba 1: Configurações da LIA (OpenAI, Cartesia, Render, Webhook, Prompt)
 * - Aba 2: Configurações de Métricas (preços por provedor)
 * - Aba 3: Configurações do Sistema (URL painel, email admin, manutenção, sessão)
 *
 * Todas as configurações são salvas na tabela 'configurations' do Supabase
 * Formato: { key: string, value: JSON, updated_at: timestamp }
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Save,
  Eye,
  EyeOff,
  Settings,
  BarChart3,
  Server,
  Zap,
  Mic,
  Cloud,
  Database,
  Globe,
  Webhook,
  FileText,
  TestTube2,
  CheckCircle2,
  XCircle,
  Loader2,
  Volume2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

interface LiaConfigData {
  openaiApiKey: string;
  cartesiaApiKey: string;
  cartesiaVoiceId: string;
  renderApiUrl: string;
  webhookUrl: string;
  systemPrompt: string;
}

interface MetricsConfigData {
  openaiInputPrice: string;
  openaiOutputPrice: string;
  cartesiaPricePerMinute: string;
  cartesiaTotalCredits: string;
  cloudflarePricePerRequest: string;
}

interface SystemConfigData {
  panelUrl: string;
  adminEmail: string;
  maintenanceMode: boolean;
  sessionTimeout: string;
}

interface TestResult {
  provider: string;
  status: 'success' | 'error' | 'loading';
  message: string;
  latency?: number;
  details?: string;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const AdminLiaConfig = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'lia' | 'metrics' | 'system'>('lia');
  const [showKeys, setShowKeys] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  // Estados das configurações
  const [liaConfig, setLiaConfig] = useState<LiaConfigData>({
    openaiApiKey: "",
    cartesiaApiKey: "",
    cartesiaVoiceId: "",
    renderApiUrl: "",
    webhookUrl: "",
    systemPrompt: "",
  });

  const [metricsConfig, setMetricsConfig] = useState<MetricsConfigData>({
    openaiInputPrice: "0.15",
    openaiOutputPrice: "0.60",
    cartesiaPricePerMinute: "0.042",
    cartesiaTotalCredits: "100",
    cloudflarePricePerRequest: "0.50",
  });

  const [systemConfig, setSystemConfig] = useState<SystemConfigData>({
    panelUrl: "",
    adminEmail: "",
    maintenanceMode: false,
    sessionTimeout: "30",
  });

  // ============================================================================
  // CARREGAR CONFIGURAÇÕES DO SUPABASE
  // ============================================================================

  useEffect(() => {
    loadAllConfigs();
  }, []);

  const loadAllConfigs = async () => {
    try {
      // Carregar todas as configurações da tabela 'configurations'
      const { data, error } = await supabase
        .from('configurations' as any)
        .select('*');

      if (error) {
        console.error('Erro ao carregar configurações:', error);
        return;
      }

      if (data) {
        const configs = data as Array<{ key: string; value: any }>;

        configs.forEach((config) => {
          const value = typeof config.value === 'string'
            ? JSON.parse(config.value)
            : config.value;

          switch (config.key) {
            case 'lia_config':
              setLiaConfig((prev) => ({ ...prev, ...value }));
              break;
            case 'metrics_config':
              setMetricsConfig((prev) => ({ ...prev, ...value }));
              break;
            case 'system_config':
              setSystemConfig((prev) => ({ ...prev, ...value }));
              break;
          }
        });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  // ============================================================================
  // SALVAR CONFIGURAÇÕES NO SUPABASE
  // ============================================================================

  const saveConfig = async (key: string, value: object) => {
    try {
      const { data: existing } = await supabase
        .from('configurations' as any)
        .select('*')
        .eq('key', key)
        .single();

      if (existing) {
        // Update
        const { error } = await supabase
          .from('configurations' as any)
          .update({
            value: JSON.stringify(value),
            updated_at: new Date().toISOString(),
          } as any)
          .eq('key', key);

        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('configurations' as any)
          .insert({
            key,
            value: JSON.stringify(value),
            updated_at: new Date().toISOString(),
          } as any);

        if (error) throw error;
      }

      return true;
    } catch (error) {
      console.error(`Erro ao salvar ${key}:`, error);
      throw error;
    }
  };

  const handleSaveLiaConfig = async () => {
    setIsSaving(true);
    try {
      await saveConfig('lia_config', liaConfig);
      toast({
        title: "Configurações da LIA salvas",
        description: "As configurações foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveMetricsConfig = async () => {
    setIsSaving(true);
    try {
      await saveConfig('metrics_config', metricsConfig);
      toast({
        title: "Configurações de Métricas salvas",
        description: "Os preços foram atualizados com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSystemConfig = async () => {
    setIsSaving(true);
    try {
      await saveConfig('system_config', systemConfig);
      toast({
        title: "Configurações do Sistema salvas",
        description: "As configurações foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================================================
  // FUNÇÕES DE TESTE
  // ============================================================================

  const testOpenAI = async (): Promise<TestResult> => {
    const startTime = Date.now();
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${liaConfig.openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: 'Hello' }],
          max_tokens: 5,
        }),
      });

      const latency = Date.now() - startTime;

      if (response.ok) {
        const data = await response.json();
        return {
          provider: 'OpenAI',
          status: 'success',
          message: 'Conectado com sucesso',
          latency,
          details: `Modelo: ${data.model}`,
        };
      } else {
        const error = await response.json();
        return {
          provider: 'OpenAI',
          status: 'error',
          message: 'Falha na conexão',
          latency,
          details: error.error?.message || 'Credenciais inválidas',
        };
      }
    } catch (error) {
      return {
        provider: 'OpenAI',
        status: 'error',
        message: 'Erro de conexão',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  };

  const testCartesia = async (): Promise<TestResult> => {
    const startTime = Date.now();
    try {
      const response = await fetch('https://api.cartesia.ai/voices', {
        method: 'GET',
        headers: {
          'X-API-Key': liaConfig.cartesiaApiKey,
          'Cartesia-Version': '2024-06-10',
        },
      });

      const latency = Date.now() - startTime;

      if (response.ok) {
        return {
          provider: 'Cartesia TTS',
          status: 'success',
          message: 'Conectado com sucesso',
          latency,
          details: `Voice ID: ${liaConfig.cartesiaVoiceId || 'Não configurado'}`,
        };
      } else {
        return {
          provider: 'Cartesia TTS',
          status: 'error',
          message: 'Falha na conexão',
          latency,
          details: 'Credenciais inválidas',
        };
      }
    } catch (error) {
      return {
        provider: 'Cartesia TTS',
        status: 'error',
        message: 'Erro de conexão',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  };

  const testRender = async (): Promise<TestResult> => {
    const startTime = Date.now();
    try {
      if (!liaConfig.renderApiUrl) {
        return {
          provider: 'Render API',
          status: 'error',
          message: 'URL não configurada',
          details: 'Por favor, configure a URL da API',
        };
      }

      const response = await fetch(`${liaConfig.renderApiUrl}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const latency = Date.now() - startTime;

      if (response.ok) {
        return {
          provider: 'Render API',
          status: 'success',
          message: `Online (${response.status})`,
          latency,
          details: `URL: ${liaConfig.renderApiUrl}`,
        };
      } else {
        return {
          provider: 'Render API',
          status: 'error',
          message: `Offline (${response.status})`,
          latency,
          details: 'Servidor não está respondendo',
        };
      }
    } catch (error) {
      const latency = Date.now() - startTime;
      // Even if health endpoint fails, try to check if server responds
      return {
        provider: 'Render API',
        status: 'error',
        message: 'Não foi possível conectar',
        latency,
        details: error instanceof Error ? error.message : 'Timeout ou servidor offline',
      };
    }
  };

  const testWebhook = async (): Promise<TestResult> => {
    const startTime = Date.now();
    try {
      if (!liaConfig.webhookUrl) {
        return {
          provider: 'Webhook',
          status: 'error',
          message: 'URL não configurada',
          details: 'Por favor, configure a URL do webhook',
        };
      }

      const response = await fetch(liaConfig.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          test: true,
          timestamp: new Date().toISOString(),
          source: 'LIA Admin Panel',
        }),
      });

      const latency = Date.now() - startTime;

      if (response.ok) {
        return {
          provider: 'Webhook',
          status: 'success',
          message: 'Enviado com sucesso',
          latency,
          details: `Status: ${response.status}`,
        };
      } else {
        return {
          provider: 'Webhook',
          status: 'error',
          message: `Falhou (${response.status})`,
          latency,
          details: 'O servidor rejeitou a requisição',
        };
      }
    } catch (error) {
      return {
        provider: 'Webhook',
        status: 'error',
        message: 'Erro de conexão',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  };

  const handleTestConnection = async (provider: string) => {
    setTestResults([{ provider, status: 'loading', message: 'Testando...' }]);
    setTestModalOpen(true);

    let result: TestResult;

    switch (provider) {
      case 'openai':
        result = await testOpenAI();
        break;
      case 'cartesia':
        result = await testCartesia();
        break;
      case 'render':
        result = await testRender();
        break;
      case 'webhook':
        result = await testWebhook();
        break;
      default:
        result = { provider, status: 'error', message: 'Provedor não suportado' };
    }

    setTestResults([result]);
  };

  const handleTestVoice = async () => {
    if (!liaConfig.cartesiaApiKey || !liaConfig.cartesiaVoiceId) {
      toast({
        title: "Configuração incompleta",
        description: "Por favor, preencha a API Key e Voice ID da Cartesia.",
        variant: "destructive",
      });
      return;
    }

    setIsPlaying(true);
    try {
      const response = await fetch('https://api.cartesia.ai/tts/bytes', {
        method: 'POST',
        headers: {
          'X-API-Key': liaConfig.cartesiaApiKey,
          'Cartesia-Version': '2024-06-10',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model_id: 'sonic-multilingual',
          transcript: 'Olá! Eu sou a LIA, sua assistente virtual inteligente.',
          voice: {
            mode: 'id',
            id: liaConfig.cartesiaVoiceId,
          },
          output_format: {
            container: 'mp3',
            encoding: 'mp3',
            sample_rate: 44100,
          },
        }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.onended = () => setIsPlaying(false);
        audio.play();
      } else {
        toast({
          title: "Erro ao reproduzir voz",
          description: "Verifique suas credenciais da Cartesia.",
          variant: "destructive",
        });
        setIsPlaying(false);
      }
    } catch (error) {
      toast({
        title: "Erro ao reproduzir voz",
        description: "Não foi possível conectar à API da Cartesia.",
        variant: "destructive",
      });
      setIsPlaying(false);
    }
  };

  // ============================================================================
  // FUNÇÕES AUXILIARES
  // ============================================================================

  const maskKey = (key: string) => {
    if (!key || showKeys) return key;
    if (key.length <= 8) return "••••••••";
    return key.slice(0, 4) + "••••••••" + key.slice(-4);
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-900 bg-clip-text text-transparent mb-2 flex items-center gap-3">
          <Settings className="w-8 h-8 text-purple-600" />
          Configurações da LIA
        </h1>
        <p className="text-gray-600">
          Configure APIs, métricas e preferências do sistema
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <TabsList className="grid grid-cols-3 w-full h-auto p-1 bg-gray-100">
          <TabsTrigger
            value="lia"
            className="flex items-center gap-2 py-2.5 px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Zap className="w-4 h-4 text-purple-600" />
            <span className="text-sm">Configurações da LIA</span>
          </TabsTrigger>
          <TabsTrigger
            value="metrics"
            className="flex items-center gap-2 py-2.5 px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <span className="text-sm">Configurações de Métricas</span>
          </TabsTrigger>
          <TabsTrigger
            value="system"
            className="flex items-center gap-2 py-2.5 px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Server className="w-4 h-4 text-green-600" />
            <span className="text-sm">Configurações do Sistema</span>
          </TabsTrigger>
        </TabsList>

        {/* ================================================================== */}
        {/* ABA 1: CONFIGURAÇÕES DA LIA */}
        {/* ================================================================== */}
        <TabsContent value="lia" className="mt-6 space-y-6">
          {/* OpenAI API */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <CardTitle>OpenAI API</CardTitle>
                <CardDescription>
                  Configure a chave de API da OpenAI para respostas inteligentes
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTestConnection('openai')}
              >
                <TestTube2 className="w-4 h-4 mr-2" />
                Testar Conexão
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openai-key">API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="openai-key"
                    type={showKeys ? "text" : "password"}
                    placeholder="sk-..."
                    value={showKeys ? liaConfig.openaiApiKey : maskKey(liaConfig.openaiApiKey)}
                    onChange={(e) => setLiaConfig({ ...liaConfig, openaiApiKey: e.target.value })}
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
                  Obtenha em{" "}
                  <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-purple-600 underline">
                    platform.openai.com
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cartesia TTS */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-3 bg-cyan-100 rounded-lg">
                <Mic className="w-6 h-6 text-cyan-600" />
              </div>
              <div className="flex-1">
                <CardTitle>Cartesia TTS</CardTitle>
                <CardDescription>
                  Configure a voz da LIA usando Cartesia Text-to-Speech
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestVoice}
                  disabled={isPlaying}
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  {isPlaying ? 'Reproduzindo...' : 'Testar Voz'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTestConnection('cartesia')}
                >
                  <TestTube2 className="w-4 h-4 mr-2" />
                  Testar Conexão
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cartesia-key">API Key</Label>
                  <Input
                    id="cartesia-key"
                    type={showKeys ? "text" : "password"}
                    placeholder="sk_cart_..."
                    value={showKeys ? liaConfig.cartesiaApiKey : maskKey(liaConfig.cartesiaApiKey)}
                    onChange={(e) => setLiaConfig({ ...liaConfig, cartesiaApiKey: e.target.value })}
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cartesia-voice">Voice ID da LIA</Label>
                  <Input
                    id="cartesia-voice"
                    type="text"
                    placeholder="a0e99841-438c-4a64-b679-ae501e7d6091"
                    value={liaConfig.cartesiaVoiceId}
                    onChange={(e) => setLiaConfig({ ...liaConfig, cartesiaVoiceId: e.target.value })}
                    className="font-mono"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Obtenha em{" "}
                <a href="https://play.cartesia.ai" target="_blank" rel="noopener noreferrer" className="text-cyan-600 underline">
                  play.cartesia.ai
                </a>
              </p>
            </CardContent>
          </Card>

          {/* Render API */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Server className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <CardTitle>Render (API Pipeline da LIA)</CardTitle>
                <CardDescription>
                  URL da API da LIA hospedada no Render
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTestConnection('render')}
              >
                <TestTube2 className="w-4 h-4 mr-2" />
                Testar API
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="render-url">URL da API</Label>
                <Input
                  id="render-url"
                  type="url"
                  placeholder="https://lia-chat-api.onrender.com"
                  value={liaConfig.renderApiUrl}
                  onChange={(e) => setLiaConfig({ ...liaConfig, renderApiUrl: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Webhook */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Webhook className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <CardTitle>Webhook</CardTitle>
                <CardDescription>
                  Configure um webhook para receber eventos
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTestConnection('webhook')}
              >
                <TestTube2 className="w-4 h-4 mr-2" />
                Enviar Teste
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-url">URL do Webhook</Label>
                <Input
                  id="webhook-url"
                  type="url"
                  placeholder="https://seu-servidor.com/webhook"
                  value={liaConfig.webhookUrl}
                  onChange={(e) => setLiaConfig({ ...liaConfig, webhookUrl: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* System Prompt */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <CardTitle>Prompt do Sistema (Texto da LIA)</CardTitle>
                <CardDescription>
                  Define a personalidade e comportamento da assistente
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="system-prompt">System Prompt</Label>
                <Textarea
                  id="system-prompt"
                  placeholder="Você é a LIA, uma assistente virtual inteligente da Luminnus..."
                  value={liaConfig.systemPrompt}
                  onChange={(e) => setLiaConfig({ ...liaConfig, systemPrompt: e.target.value })}
                  rows={8}
                  className="resize-none font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSaveLiaConfig}
              disabled={isSaving}
              size="lg"
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Salvando..." : "Salvar Configurações da LIA"}
            </Button>
          </div>
        </TabsContent>

        {/* ================================================================== */}
        {/* ABA 2: CONFIGURAÇÕES DE MÉTRICAS */}
        {/* ================================================================== */}
        <TabsContent value="metrics" className="mt-6 space-y-6">
          {/* OpenAI Usage */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <CardTitle>OpenAI Usage</CardTitle>
                <CardDescription>
                  Configure os preços por token para cálculo de custos
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="openai-input-price">Preço por 1M tokens (input)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      id="openai-input-price"
                      type="number"
                      step="0.01"
                      placeholder="0.15"
                      value={metricsConfig.openaiInputPrice}
                      onChange={(e) => setMetricsConfig({ ...metricsConfig, openaiInputPrice: e.target.value })}
                      className="pl-7"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Padrão: $0.15 / 1M tokens</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="openai-output-price">Preço por 1M tokens (output)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      id="openai-output-price"
                      type="number"
                      step="0.01"
                      placeholder="0.60"
                      value={metricsConfig.openaiOutputPrice}
                      onChange={(e) => setMetricsConfig({ ...metricsConfig, openaiOutputPrice: e.target.value })}
                      className="pl-7"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Padrão: $0.60 / 1M tokens</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cartesia */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-3 bg-cyan-100 rounded-lg">
                <Mic className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <CardTitle>Cartesia</CardTitle>
                <CardDescription>
                  Configure preços e créditos do TTS
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cartesia-price">Preço por minuto</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      id="cartesia-price"
                      type="number"
                      step="0.001"
                      placeholder="0.042"
                      value={metricsConfig.cartesiaPricePerMinute}
                      onChange={(e) => setMetricsConfig({ ...metricsConfig, cartesiaPricePerMinute: e.target.value })}
                      className="pl-7"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">850 chars = 1 minuto (aprox.)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cartesia-credits">Créditos totais</Label>
                  <Input
                    id="cartesia-credits"
                    type="number"
                    step="1"
                    placeholder="100"
                    value={metricsConfig.cartesiaTotalCredits}
                    onChange={(e) => setMetricsConfig({ ...metricsConfig, cartesiaTotalCredits: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Custo estimado: ${(parseFloat(metricsConfig.cartesiaTotalCredits || '0') * parseFloat(metricsConfig.cartesiaPricePerMinute || '0')).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Render */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Server className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>Render</CardTitle>
                <CardDescription>
                  Servidor de hospedagem da API
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                O Render não requer configuração de preços adicionais.
                O custo é fixo baseado no plano contratado.
              </p>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-800">Status do Servidor</p>
                <p className="text-xs text-blue-600 mt-1">
                  Use o botão "Testar API" na aba Configurações da LIA para verificar o status.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cloudflare */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Cloud className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <CardTitle>Cloudflare</CardTitle>
                <CardDescription>
                  Configure o preço por request dos Workers
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cloudflare-price">Preço por 1M requests</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="cloudflare-price"
                    type="number"
                    step="0.01"
                    placeholder="0.50"
                    value={metricsConfig.cloudflarePricePerRequest}
                    onChange={(e) => setMetricsConfig({ ...metricsConfig, cloudflarePricePerRequest: e.target.value })}
                    className="pl-7"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Padrão: $0.50 / 1M requests</p>
              </div>
            </CardContent>
          </Card>

          {/* Supabase */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Database className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <CardTitle>Supabase</CardTitle>
                <CardDescription>
                  Métricas de uso do banco de dados (somente leitura)
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-emerald-600">-</p>
                  <p className="text-xs text-gray-500 mt-1">Read Units</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-emerald-600">-</p>
                  <p className="text-xs text-gray-500 mt-1">Write Units</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-emerald-600">-</p>
                  <p className="text-xs text-gray-500 mt-1">Storage</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Dados atualizados em tempo real via Supabase Dashboard
              </p>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSaveMetricsConfig}
              disabled={isSaving}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Salvando..." : "Salvar Configurações de Métricas"}
            </Button>
          </div>
        </TabsContent>

        {/* ================================================================== */}
        {/* ABA 3: CONFIGURAÇÕES DO SISTEMA */}
        {/* ================================================================== */}
        <TabsContent value="system" className="mt-6 space-y-6">
          {/* Panel URL */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Globe className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <CardTitle>URL do Painel</CardTitle>
                <CardDescription>
                  URL base do painel administrativo
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="panel-url">URL do Painel</Label>
                <Input
                  id="panel-url"
                  type="url"
                  placeholder="https://admin.luminnus.com"
                  value={systemConfig.panelUrl}
                  onChange={(e) => setSystemConfig({ ...systemConfig, panelUrl: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Admin Email */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Settings className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <CardTitle>E-mail do Administrador</CardTitle>
                <CardDescription>
                  E-mail para notificações e alertas do sistema
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">E-mail do Administrador</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@luminnus.com"
                  value={systemConfig.adminEmail}
                  onChange={(e) => setSystemConfig({ ...systemConfig, adminEmail: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Mode */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Settings className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <CardTitle>Modo de Manutenção</CardTitle>
                <CardDescription>
                  Ative para colocar o sistema em manutenção
                </CardDescription>
              </div>
              <Switch
                checked={systemConfig.maintenanceMode}
                onCheckedChange={(checked) => setSystemConfig({ ...systemConfig, maintenanceMode: checked })}
              />
            </CardHeader>
            <CardContent>
              <div className={`p-4 rounded-lg ${systemConfig.maintenanceMode ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'}`}>
                <p className={`text-sm font-medium ${systemConfig.maintenanceMode ? 'text-yellow-800' : 'text-green-800'}`}>
                  Status: {systemConfig.maintenanceMode ? 'Em Manutenção' : 'Online'}
                </p>
                <p className={`text-xs mt-1 ${systemConfig.maintenanceMode ? 'text-yellow-600' : 'text-green-600'}`}>
                  {systemConfig.maintenanceMode
                    ? 'O sistema está em modo de manutenção. Usuários verão uma página de manutenção.'
                    : 'O sistema está funcionando normalmente.'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Session Timeout */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Settings className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <CardTitle>Tempo Máximo de Inatividade</CardTitle>
                <CardDescription>
                  Tempo em minutos antes de encerrar a sessão por inatividade
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Timeout (minutos)</Label>
                <Input
                  id="session-timeout"
                  type="number"
                  min="5"
                  max="1440"
                  placeholder="30"
                  value={systemConfig.sessionTimeout}
                  onChange={(e) => setSystemConfig({ ...systemConfig, sessionTimeout: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Valor entre 5 e 1440 minutos (24 horas)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSaveSystemConfig}
              disabled={isSaving}
              size="lg"
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Salvando..." : "Salvar Configurações do Sistema"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* ================================================================== */}
      {/* MODAL DE RESULTADO DOS TESTES */}
      {/* ================================================================== */}
      <Dialog open={testModalOpen} onOpenChange={setTestModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TestTube2 className="w-5 h-5" />
              Resultado do Teste
            </DialogTitle>
            <DialogDescription>
              Resultado da verificação de conexão
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  result.status === 'success'
                    ? 'bg-green-50 border-green-200'
                    : result.status === 'error'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  {result.status === 'loading' ? (
                    <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                  ) : result.status === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{result.provider}</p>
                    <p className={`text-sm ${
                      result.status === 'success' ? 'text-green-700' :
                      result.status === 'error' ? 'text-red-700' : 'text-gray-600'
                    }`}>
                      {result.message}
                    </p>
                  </div>
                  {result.latency && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {result.latency}ms
                    </span>
                  )}
                </div>
                {result.details && (
                  <p className="text-xs text-gray-500 mt-2 pl-8">
                    {result.details}
                  </p>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 pt-4 border-t">
        <p>
          Todas as configurações são salvas na tabela <code className="bg-gray-100 px-1 rounded">configurations</code> do Supabase.
        </p>
      </div>
    </div>
  );
};
