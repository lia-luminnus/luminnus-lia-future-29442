import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Upload, Download, Settings, Database, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * COMPONENTE: AdminLiaCoreUpdates
 *
 * Painel para atualizações e gestão do core da LIA
 * - Atualizar personalidade/prompt
 * - Treinar com novos dados
 * - Configurar modelos de IA
 * - Versões e rollbacks
 * - Fine-tuning
 */
const AdminLiaCoreUpdates = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-900 bg-clip-text text-transparent mb-2 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-pink-600" />
          LIA Core - Atualizações e Treinamento
        </h1>
        <p className="text-gray-600">
          Configure e atualize o cérebro da LIA
        </p>
      </div>

      {/* Status do Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Versão Atual</CardTitle>
            <Code className="w-4 h-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-pink-600">v1.0.0</p>
            <Badge className="mt-2 bg-green-100 text-green-700">Estável</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Modelo IA</CardTitle>
            <Database className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">GPT-4o-mini</p>
            <p className="text-xs text-gray-500 mt-1">OpenAI</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Última Atualização</CardTitle>
            <Settings className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-blue-600">Nunca</p>
            <p className="text-xs text-gray-500 mt-1">Sistema inicial</p>
          </CardContent>
        </Card>
      </div>

      {/* Ações Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-pink-600" />
              <div>
                <CardTitle>Atualizar Personalidade</CardTitle>
                <CardDescription>Modifique o system prompt e comportamento da LIA</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Configure como a LIA se comporta, seu tom de voz e estilo de respostas.
              Você pode torná-la mais formal, casual, técnica ou amigável.
            </p>
            <Button className="w-full bg-pink-600 hover:bg-pink-700">
              <Settings className="w-4 h-4 mr-2" />
              Ir para Configurações da LIA
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Upload className="w-8 h-8 text-blue-600" />
              <div>
                <CardTitle>Treinar com Dados</CardTitle>
                <CardDescription>Adicione conhecimento específico do seu negócio</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Faça upload de documentos, FAQs e bases de conhecimento para que a LIA
              aprenda sobre seus produtos, serviços e processos.
            </p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Upload className="w-4 h-4 mr-2" />
              Upload de Dados
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-purple-600" />
              <div>
                <CardTitle>Configurar Modelo de IA</CardTitle>
                <CardDescription>Escolha o modelo e parâmetros de geração</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Selecione qual modelo da OpenAI usar (GPT-4, GPT-4o, GPT-3.5-turbo) e
              ajuste parâmetros como temperatura e max tokens.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Modelo atual:</span>
                <Badge>GPT-4o-mini</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Temperatura:</span>
                <Badge variant="outline">0.7</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Max Tokens:</span>
                <Badge variant="outline">1000</Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              <Settings className="w-4 h-4 mr-2" />
              Alterar Configurações
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Download className="w-8 h-8 text-green-600" />
              <div>
                <CardTitle>Versões e Rollback</CardTitle>
                <CardDescription>Gerencie versões e volte para versões anteriores</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Visualize o histórico de atualizações da LIA e, se necessário,
              restaure uma versão anterior da configuração.
            </p>
            <div className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">v1.0.0</p>
                  <p className="text-xs text-gray-500">Versão inicial</p>
                </div>
                <Badge className="bg-green-100 text-green-700">Atual</Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full" disabled>
              <Download className="w-4 h-4 mr-2" />
              Ver Histórico
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Avisos */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-yellow-800 flex items-center gap-2">
            ⚠️ Importante
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-yellow-800 space-y-2">
          <p>
            • Alterações na personalidade e no modelo afetam <strong>todas as conversas</strong> da LIA
          </p>
          <p>
            • Faça backup das configurações antes de realizar mudanças significativas
          </p>
          <p>
            • Teste as alterações em ambiente de staging antes de aplicar em produção
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLiaCoreUpdates;
