/**
 * COMPONENTE: AdminLiaConfig
 *
 * Página de configurações da assistente LIA
 * Organizada em sub-seções: Credenciais de API, Prompt do Sistema, Configurações de Métricas
 * Salva e carrega dados da tabela 'lia_configurations' do Supabase
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Save,
  Eye,
  EyeOff,
  Key,
  Database,
  Server,
  Webhook,
  FileText,
  BarChart3,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

interface LiaConfigData {
  openaiApiKey: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceKey: string;
  renderApiUrl: string;
  webhookUrl: string;
  systemPrompt: string;
}

interface MetricsSettings {
  openaiInputPrice: string;
  openaiOutputPrice: string;
  cartesiaPricePerMinute: string;
  cartesiaTotalCredits: string;
  cloudflarePricePerRequest: string;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const AdminLiaConfig = () => {
  const { toast } = useToast();
  const [showKeys, setShowKeys] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Estados das configurações
  const [liaConfig, setLiaConfig] = useState<LiaConfigData>({
    openaiApiKey: "",
    supabaseUrl: "",
    supabaseAnonKey: "",
    supabaseServiceKey: "",
    renderApiUrl: "",
    webhookUrl: "",
    systemPrompt: "",
  });

  const [metricsSettings, setMetricsSettings] = useState<MetricsSettings>({
    openaiInputPrice: "0.15",
    openaiOutputPrice: "0.60",
    cartesiaPricePerMinute: "0.042",
    cartesiaTotalCredits: "100",
    cloudflarePricePerRequest: "0.50",
  });

  // ============================================================================
  // CARREGAR CONFIGURAÇÕES DO SUPABASE
  // ============================================================================

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('lia_configurations')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Erro ao carregar configurações:', error);
        return;
      }

      if (data) {
        setLiaConfig({
          openaiApiKey: data.openai_api_key || '',
          supabaseUrl: data.supabase_url || '',
          supabaseAnonKey: data.supabase_anon_key || '',
          supabaseServiceKey: data.supabase_service_role_key || '',
          renderApiUrl: data.render_api_url || '',
          webhookUrl: data.webhook_url || '',
          systemPrompt: data.system_prompt || '',
        });

        if (data.metrics_settings) {
          const metrics = typeof data.metrics_settings === 'string'
            ? JSON.parse(data.metrics_settings)
            : data.metrics_settings;
          setMetricsSettings((prev) => ({ ...prev, ...metrics }));
        }
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast({
        title: "Erro ao carregar",
        description: "Não foi possível carregar as configurações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // VALIDAÇÕES
  // ============================================================================

  const validateFields = (): boolean => {
    if (!liaConfig.openaiApiKey.trim()) {
      toast({
        title: "⚠️ Campo obrigatório",
        description: "A chave da OpenAI é obrigatória.",
        variant: "destructive",
      });
      return false;
    }

    if (liaConfig.renderApiUrl && !liaConfig.renderApiUrl.startsWith('http')) {
      toast({
        title: "⚠️ URL inválida",
        description: "A URL do Render deve começar com http:// ou https://",
        variant: "destructive",
      });
      return false;
    }

    if (liaConfig.webhookUrl && !liaConfig.webhookUrl.startsWith('http')) {
      toast({
        title: "⚠️ URL inválida",
        description: "A URL do Webhook deve começar com http:// ou https://",
        variant: "destructive",
      });
      return false;
    }

    if (liaConfig.supabaseUrl && !liaConfig.supabaseUrl.startsWith('http')) {
      toast({
        title: "⚠️ URL inválida",
        description: "A URL do Supabase deve começar com http:// ou https://",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  // ============================================================================
  // SALVAR CONFIGURAÇÕES NO SUPABASE
  // ============================================================================

  const handleSave = async () => {
    if (!validateFields()) return;

    setIsSaving(true);
    try {
      // Verificar se já existe um registro
      const { data: existing } = await supabase
        .from('lia_configurations')
        .select('id')
        .limit(1)
        .maybeSingle();

      const payload = {
        openai_api_key: liaConfig.openaiApiKey,
        supabase_url: liaConfig.supabaseUrl,
        supabase_anon_key: liaConfig.supabaseAnonKey,
        supabase_service_role_key: liaConfig.supabaseServiceKey,
        render_api_url: liaConfig.renderApiUrl,
        webhook_url: liaConfig.webhookUrl,
        system_prompt: liaConfig.systemPrompt,
        metrics_settings: JSON.parse(JSON.stringify(metricsSettings)),
        updated_at: new Date().toISOString(),
      };

      if (existing) {
        // UPDATE
        const { error } = await supabase
          .from('lia_configurations')
          .update(payload)
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // INSERT
        const { error } = await supabase
          .from('lia_configurations')
          .insert(payload);

        if (error) throw error;
      }

      toast({
        title: "✅ Configurações salvas!",
        description: "Todas as alterações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast({
        title: "❌ Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================================================
  // CRIAR REGISTRO INICIAL
  // ============================================================================

  useEffect(() => {
    const initConfig = async () => {
      const { data } = await supabase
        .from('lia_configurations')
        .select('id')
        .limit(1)
        .maybeSingle();

      if (!data) {
        // Criar registro inicial vazio
        await supabase.from('lia_configurations').insert({
          openai_api_key: '',
          system_prompt: 'Você é a LIA, uma assistente virtual inteligente e prestativa.',
        });
        await loadConfig();
      }
    };

    initConfig();
  }, []);

  // ============================================================================
  // RENDER
  // ============================================================================

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Configurações da LIA
          </h1>
          <p className="text-white/60">
            Gerencie as credenciais, prompts e configurações da assistente virtual
          </p>
        </div>
      </div>

      {/* SEÇÃO 1: CREDENCIAIS DE API */}
      <Card className="bg-white/5 backdrop-blur-lg border border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-blue-400" />
            Credenciais de API
          </CardTitle>
          <CardDescription className="text-white/60">
            Configure as chaves de acesso dos provedores externos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* OpenAI API Key */}
          <div className="space-y-2">
            <Label htmlFor="openai-key" className="text-white">
              OpenAI API Key <span className="text-red-400">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="openai-key"
                type={showKeys ? "text" : "password"}
                value={liaConfig.openaiApiKey}
                onChange={(e) => setLiaConfig({ ...liaConfig, openaiApiKey: e.target.value })}
                placeholder="sk-..."
                className="bg-white/10 border-white/20 text-white"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowKeys(!showKeys)}
                className="text-white/60 hover:text-white"
              >
                {showKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Supabase */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-green-400" />
              <h3 className="text-white font-semibold">Supabase</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supabase-url" className="text-white">URL do Projeto</Label>
              <Input
                id="supabase-url"
                type="text"
                value={liaConfig.supabaseUrl}
                onChange={(e) => setLiaConfig({ ...liaConfig, supabaseUrl: e.target.value })}
                placeholder="https://seu-projeto.supabase.co"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supabase-anon" className="text-white">Anon Key (Pública)</Label>
              <Input
                id="supabase-anon"
                type={showKeys ? "text" : "password"}
                value={liaConfig.supabaseAnonKey}
                onChange={(e) => setLiaConfig({ ...liaConfig, supabaseAnonKey: e.target.value })}
                placeholder="eyJ..."
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supabase-service" className="text-white">Service Role Key (Privada)</Label>
              <Input
                id="supabase-service"
                type={showKeys ? "text" : "password"}
                value={liaConfig.supabaseServiceKey}
                onChange={(e) => setLiaConfig({ ...liaConfig, supabaseServiceKey: e.target.value })}
                placeholder="eyJ..."
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
          </div>

          {/* Render API */}
          <div className="space-y-2 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-purple-400" />
              <Label htmlFor="render-url" className="text-white">Render API URL</Label>
            </div>
            <Input
              id="render-url"
              type="text"
              value={liaConfig.renderApiUrl}
              onChange={(e) => setLiaConfig({ ...liaConfig, renderApiUrl: e.target.value })}
              placeholder="https://sua-api.onrender.com"
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          {/* Webhook */}
          <div className="space-y-2 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <Webhook className="w-5 h-5 text-yellow-400" />
              <Label htmlFor="webhook-url" className="text-white">Webhook URL</Label>
            </div>
            <Input
              id="webhook-url"
              type="text"
              value={liaConfig.webhookUrl}
              onChange={(e) => setLiaConfig({ ...liaConfig, webhookUrl: e.target.value })}
              placeholder="https://seu-webhook.com/endpoint"
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* SEÇÃO 2: PROMPT DO SISTEMA */}
      <Card className="bg-white/5 backdrop-blur-lg border border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-400" />
            Prompt do Sistema
          </CardTitle>
          <CardDescription className="text-white/60">
            Configure a personalidade e comportamento da assistente LIA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="system-prompt" className="text-white">Instruções do Sistema</Label>
            <Textarea
              id="system-prompt"
              value={liaConfig.systemPrompt}
              onChange={(e) => setLiaConfig({ ...liaConfig, systemPrompt: e.target.value })}
              placeholder="Você é a LIA, uma assistente virtual inteligente..."
              className="bg-white/10 border-white/20 text-white min-h-[120px]"
            />
            <p className="text-xs text-white/40">
              Este prompt será usado como instruções base para todas as interações da LIA
            </p>
          </div>
        </CardContent>
      </Card>

      {/* SEÇÃO 3: CONFIGURAÇÕES DE MÉTRICAS */}
      <Card className="bg-white/5 backdrop-blur-lg border border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-orange-400" />
            Configurações de Métricas
          </CardTitle>
          <CardDescription className="text-white/60">
            Defina os preços e limites para cálculo de custos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* OpenAI */}
            <div className="space-y-2">
              <Label htmlFor="openai-input" className="text-white">OpenAI Input Price ($/1M tokens)</Label>
              <Input
                id="openai-input"
                type="number"
                step="0.01"
                value={metricsSettings.openaiInputPrice}
                onChange={(e) => setMetricsSettings({ ...metricsSettings, openaiInputPrice: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="openai-output" className="text-white">OpenAI Output Price ($/1M tokens)</Label>
              <Input
                id="openai-output"
                type="number"
                step="0.01"
                value={metricsSettings.openaiOutputPrice}
                onChange={(e) => setMetricsSettings({ ...metricsSettings, openaiOutputPrice: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            {/* Cartesia */}
            <div className="space-y-2">
              <Label htmlFor="cartesia-price" className="text-white">Cartesia Price ($/min)</Label>
              <Input
                id="cartesia-price"
                type="number"
                step="0.001"
                value={metricsSettings.cartesiaPricePerMinute}
                onChange={(e) => setMetricsSettings({ ...metricsSettings, cartesiaPricePerMinute: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cartesia-credits" className="text-white">Cartesia Total Credits</Label>
              <Input
                id="cartesia-credits"
                type="number"
                value={metricsSettings.cartesiaTotalCredits}
                onChange={(e) => setMetricsSettings({ ...metricsSettings, cartesiaTotalCredits: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            {/* Cloudflare */}
            <div className="space-y-2">
              <Label htmlFor="cloudflare-price" className="text-white">Cloudflare Price ($/1M requests)</Label>
              <Input
                id="cloudflare-price"
                type="number"
                step="0.01"
                value={metricsSettings.cloudflarePricePerRequest}
                onChange={(e) => setMetricsSettings({ ...metricsSettings, cloudflarePricePerRequest: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* BOTÃO SALVAR */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium px-8 py-2 rounded-xl shadow-lg transition-all duration-200"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Salvar Configurações
            </>
          )}
        </Button>
      </div>
    </div>
  );
};