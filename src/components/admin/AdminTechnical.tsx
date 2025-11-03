import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Save, RotateCcw, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const AdminTechnical = () => {
  const { toast } = useToast();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [simulationMode, setSimulationMode] = useState(false);
  const [autoResponses, setAutoResponses] = useState(true);
  const [debugMode, setDebugMode] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState(
    "Olá! Sou a LIA, sua assistente virtual. Como posso ajudar você hoje?"
  );
  const [offlineMessage, setOfflineMessage] = useState(
    "Desculpe, estou temporariamente indisponível. Tente novamente em alguns minutos."
  );
  const [errorMessage, setErrorMessage] = useState(
    "Ops! Algo deu errado. Por favor, tente novamente."
  );
  const [responseDelay, setResponseDelay] = useState("1000");
  const [maxRetries, setMaxRetries] = useState("3");

  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "As configurações técnicas foram atualizadas com sucesso.",
    });

    // Salvar no localStorage ou Supabase
    localStorage.setItem(
      "admin-technical-config",
      JSON.stringify({
        maintenanceMode,
        simulationMode,
        autoResponses,
        debugMode,
        welcomeMessage,
        offlineMessage,
        errorMessage,
        responseDelay,
        maxRetries,
      })
    );
  };

  const handleReset = () => {
    setMaintenanceMode(false);
    setSimulationMode(false);
    setAutoResponses(true);
    setDebugMode(false);
    setWelcomeMessage("Olá! Sou a LIA, sua assistente virtual. Como posso ajudar você hoje?");
    setOfflineMessage("Desculpe, estou temporariamente indisponível. Tente novamente em alguns minutos.");
    setErrorMessage("Ops! Algo deu errado. Por favor, tente novamente.");
    setResponseDelay("1000");
    setMaxRetries("3");

    toast({
      title: "Configurações resetadas",
      description: "Todas as configurações foram restauradas para os valores padrão.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-purple-900">
          Configurações Técnicas
        </h2>
        <p className="text-muted-foreground">
          Ajuste comportamentos do sistema e modos de operação
        </p>
      </div>

      {/* System Modes */}
      <Card>
        <CardHeader>
          <CardTitle>Modos do Sistema</CardTitle>
          <CardDescription>
            Ative ou desative modos especiais de operação
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="maintenance-mode" className="text-base font-semibold">
                Modo de Manutenção
              </Label>
              <p className="text-sm text-muted-foreground">
                Desativa temporariamente o sistema para todos os usuários
              </p>
            </div>
            <Switch
              id="maintenance-mode"
              checked={maintenanceMode}
              onCheckedChange={setMaintenanceMode}
            />
          </div>

          {maintenanceMode && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Atenção!</strong> O modo de manutenção está ativado. Nenhum usuário
                poderá acessar o sistema.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="simulation-mode" className="text-base font-semibold">
                Modo de Simulação
              </Label>
              <p className="text-sm text-muted-foreground">
                Simula respostas da LIA sem consumir API real
              </p>
            </div>
            <Switch
              id="simulation-mode"
              checked={simulationMode}
              onCheckedChange={setSimulationMode}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-responses" className="text-base font-semibold">
                Respostas Automáticas
              </Label>
              <p className="text-sm text-muted-foreground">
                Habilita respostas automáticas para mensagens comuns
              </p>
            </div>
            <Switch
              id="auto-responses"
              checked={autoResponses}
              onCheckedChange={setAutoResponses}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="debug-mode" className="text-base font-semibold">
                Modo Debug
              </Label>
              <p className="text-sm text-muted-foreground">
                Exibe informações detalhadas de log no console
              </p>
            </div>
            <Switch
              id="debug-mode"
              checked={debugMode}
              onCheckedChange={setDebugMode}
            />
          </div>
        </CardContent>
      </Card>

      {/* Default Messages */}
      <Card>
        <CardHeader>
          <CardTitle>Mensagens Padrão</CardTitle>
          <CardDescription>
            Personalize as mensagens automáticas do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="welcome-message">Mensagem de Boas-vindas</Label>
            <Textarea
              id="welcome-message"
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="offline-message">Mensagem de Indisponibilidade</Label>
            <Textarea
              id="offline-message"
              value={offlineMessage}
              onChange={(e) => setOfflineMessage(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="error-message">Mensagem de Erro</Label>
            <Textarea
              id="error-message"
              value={errorMessage}
              onChange={(e) => setErrorMessage(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Performance Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Performance</CardTitle>
          <CardDescription>
            Ajuste parâmetros técnicos do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="response-delay">Delay de Resposta (ms)</Label>
              <Input
                id="response-delay"
                type="number"
                value={responseDelay}
                onChange={(e) => setResponseDelay(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Tempo de espera antes de enviar respostas (para parecer mais natural)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-retries">Tentativas Máximas</Label>
              <Input
                id="max-retries"
                type="number"
                value={maxRetries}
                onChange={(e) => setMaxRetries(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Número de tentativas em caso de erro de API
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="log-level">Nível de Log</Label>
            <Select defaultValue="info">
              <SelectTrigger id="log-level">
                <SelectValue placeholder="Selecione o nível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="debug">Debug (Detalhado)</SelectItem>
                <SelectItem value="info">Info (Normal)</SelectItem>
                <SelectItem value="warn">Warning (Avisos)</SelectItem>
                <SelectItem value="error">Error (Apenas erros)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cache-duration">Duração do Cache (minutos)</Label>
            <Input
              id="cache-duration"
              type="number"
              defaultValue="15"
            />
            <p className="text-xs text-muted-foreground">
              Tempo que respostas ficam em cache antes de expirar
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Resetar para Padrão
        </Button>
        <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
          <Save className="mr-2 h-4 w-4" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
};
