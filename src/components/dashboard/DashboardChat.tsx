import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bot, Send, Loader2, User, AlertCircle, Code2, Trash2, Settings, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUserPlanLimits } from '@/hooks/useUserPlanLimits';
import { useNavigate } from 'react-router-dom';

/**
 * INTERFACE: Mensagem de Chat
 */
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

/**
 * COMPONENTE: DashboardChat
 *
 * Interface de chat com a Lia com bolhas de conversa
 * Integração com API e persistência no Supabase
 */
const DashboardChat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { canUseFeature, incrementUsage, getRemainingUsage } = useUserPlanLimits();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * EFEITO: Scroll automático para última mensagem
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * EFEITO: Carregar ou criar conversa ao montar componente
   */
  useEffect(() => {
    loadOrCreateConversation();
  }, [user]);

  /**
   * FUNÇÃO: Carregar ou criar conversa
   */
  const loadOrCreateConversation = async () => {
    if (!user) return;

    try {
      // Tentar buscar uma conversa existente
      const { data: conversations, error: fetchError } = await supabase
        .from('chat_conversations')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (fetchError) {
        console.error('Erro ao buscar conversa:', fetchError);
        return;
      }

      if (conversations && conversations.length > 0) {
        // Usar conversa existente
        setConversationId(conversations[0].id);
        await loadMessages(conversations[0].id);
      } else {
        // Criar nova conversa
        const { data: newConversation, error: createError } = await supabase
          .from('chat_conversations')
          .insert({ user_id: user.id })
          .select('id')
          .single();

        if (createError) {
          console.error('Erro ao criar conversa:', createError);
          return;
        }

        setConversationId(newConversation.id);

        // Adicionar mensagem de boas-vindas
        const welcomeMessage: ChatMessage = {
          id: 'welcome',
          role: 'assistant',
          content: 'Olá! Sou a Lia, sua assistente inteligente. Como posso ajudá-lo hoje?',
          created_at: new Date().toISOString(),
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Erro ao carregar conversa:', error);
    }
  };

  /**
   * FUNÇÃO: Carregar mensagens da conversa
   */
  const loadMessages = async (convId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao carregar mensagens:', error);
        return;
      }

      if (data && data.length > 0) {
        setMessages(data as ChatMessage[]);
      } else {
        // Se não houver mensagens, adicionar mensagem de boas-vindas
        const welcomeMessage: ChatMessage = {
          id: 'welcome',
          role: 'assistant',
          content: 'Olá! Sou a Lia, sua assistente inteligente. Como posso ajudá-lo hoje?',
          created_at: new Date().toISOString(),
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  /**
   * FUNÇÃO: Enviar mensagem
   */
  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!inputMessage.trim() || !conversationId || !user) return;

    // Verificar limites do plano
    if (!canUseFeature('mensagens')) {
      const remaining = getRemainingUsage('mensagens');
      toast({
        title: 'Limite de mensagens atingido',
        description: `Você atingiu o limite do seu plano. Faça upgrade para continuar enviando mensagens.`,
        variant: 'destructive',
      });
      return;
    }

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setLoading(true);

    // Adicionar mensagem do usuário à lista
    const newUserMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newUserMessage]);

    try {
      // Salvar mensagem do usuário no Supabase
      const { error: userMsgError } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          role: 'user',
          content: userMessage,
        });

      if (userMsgError) {
        console.error('Erro ao salvar mensagem do usuário:', userMsgError);
      } else {
        // Incrementar contador de uso
        await incrementUsage('mensagens');
      }

      // Chamar Supabase Edge Function da Lia
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Sessão não encontrada');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lia-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            message: userMessage,
            conversationId: conversationId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao obter resposta da Lia');
      }

      const data = await response.json();

      // Adicionar resposta da Lia à lista
      const assistantMessage: ChatMessage = {
        id: `temp-assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response || 'Desculpe, não consegui processar sua mensagem.',
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Salvar resposta da Lia no Supabase
      const { error: assistantMsgError } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          role: 'assistant',
          content: assistantMessage.content,
        });

      if (assistantMsgError) {
        console.error('Erro ao salvar resposta da Lia:', assistantMsgError);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar a mensagem. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * FUNÇÃO: Formatar timestamp
   */
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  /**
   * FUNÇÃO: Limpar conversa
   */
  const handleClearChat = async () => {
    if (!conversationId) return;

    try {
      // Deletar todas as mensagens da conversa
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('conversation_id', conversationId);

      if (error) throw error;

      // Resetar estado local
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        role: 'assistant',
        content: 'Olá! Sou a Lia, sua assistente inteligente. Como posso ajudá-lo hoje?',
        created_at: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);

      toast({
        title: 'Chat limpo',
        description: 'O histórico de conversa foi removido.',
      });
    } catch (error) {
      console.error('Erro ao limpar chat:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível limpar o chat.',
        variant: 'destructive',
      });
    }
  };

  /**
   * FUNÇÃO: Ativar modo código
   */
  const handleCodeMode = () => {
    setInputMessage('/codigo ');
    toast({
      title: 'Modo Código Ativado',
      description: 'A LIA está pronta para ajudar com programação!',
    });
  };

  /**
   * FUNÇÃO: Abrir configurações
   */
  const handleSettings = () => {
    toast({
      title: 'Configurações',
      description: 'Em breve você poderá personalizar a LIA aqui!',
    });
  };

  /**
   * FUNÇÃO: Sugestão rápida
   */
  const handleQuickSuggestion = () => {
    setInputMessage('Como você pode me ajudar?');
  };

  /**
   * FUNÇÃO: Redimensionar textarea automaticamente
   */
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, [inputMessage]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Bot className="w-8 h-8 text-[#00C2FF]" />
          Chat com a Lia
        </h1>
        <p className="text-white/60">
          Converse com sua assistente inteligente
        </p>
      </div>

      {/* ALERTA DE USO */}
      {(() => {
        const remaining = getRemainingUsage('mensagens');
        if (remaining !== 'unlimited' && remaining <= 10) {
          return (
            <Alert className="bg-yellow-500/10 border-yellow-500/20">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <AlertDescription className="text-yellow-200">
                Você tem apenas {remaining} mensagens restantes no seu plano.{' '}
                <button
                  onClick={() => navigate('/planos')}
                  className="underline font-medium hover:text-yellow-100"
                >
                  Faça upgrade
                </button>
              </AlertDescription>
            </Alert>
          );
        }
        return null;
      })()}

      {/* CHAT INTERFACE */}
      <div className="flex flex-col h-[calc(100vh-280px)] relative">
        {/* ÁREA DE MENSAGENS */}
        <Card className="flex-1 bg-white/5 backdrop-blur-lg border border-white/10 overflow-hidden">
          <CardContent className="h-full overflow-y-auto p-6 space-y-6">
            {messages.map((message, index) => (
              <div
                key={message.id || index}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                {/* Avatar da Lia */}
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#6A00FF] via-[#8B5CF6] to-[#00C2FF] flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}

                {/* Bolha de mensagem */}
                <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-lg ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-[#7C3AED] via-[#9333EA] to-[#FF2E9E] text-white shadow-purple-500/20'
                        : 'bg-white/10 text-white border border-white/20 backdrop-blur-sm shadow-black/20'
                    }`}
                  >
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <span className={`text-xs mt-1.5 px-2 ${message.role === 'user' ? 'text-white/50' : 'text-white/40'}`}>
                    {formatTime(message.created_at)}
                  </span>
                </div>

                {/* Avatar do Usuário */}
                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#FF2E9E] via-[#D946EF] to-[#7C3AED] flex items-center justify-center shadow-lg shadow-pink-500/30">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex gap-3 justify-start animate-in fade-in duration-200">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#6A00FF] via-[#8B5CF6] to-[#00C2FF] flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white/10 text-white border border-white/20 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-lg shadow-black/20">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>
        </Card>

        {/* ÁREA DE INPUT - Estilo ChatGPT */}
        <div className="mt-4 space-y-3">
          {/* Opções Interativas */}
          <div className="flex items-center justify-center gap-2 px-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCodeMode}
              className="text-xs text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-full px-3 py-1.5 h-auto"
            >
              <Code2 className="w-3.5 h-3.5 mr-1.5" />
              Modo Código
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearChat}
              className="text-xs text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-full px-3 py-1.5 h-auto"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Limpar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleQuickSuggestion}
              className="text-xs text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-full px-3 py-1.5 h-auto"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Sugestões
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSettings}
              className="text-xs text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-full px-3 py-1.5 h-auto"
            >
              <Settings className="w-3.5 h-3.5 mr-1.5" />
              Configurar
            </Button>
          </div>

          {/* Input Container */}
          <div className="max-w-4xl mx-auto w-full px-4">
            <form onSubmit={handleSendMessage} className="relative">
              <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl shadow-black/20 focus-within:border-[#00C2FF]/50 focus-within:shadow-[#00C2FF]/20 transition-all duration-200">
                <Textarea
                  ref={textareaRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Digite sua mensagem para a LIA..."
                  disabled={loading}
                  rows={1}
                  className="resize-none bg-transparent border-0 text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:ring-offset-0 pr-14 py-4 px-6 text-[15px] leading-relaxed max-h-[150px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
                  style={{ minHeight: '56px' }}
                />
                <Button
                  type="submit"
                  disabled={loading || !inputMessage.trim()}
                  size="icon"
                  className="absolute right-2 bottom-2 h-10 w-10 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#FF2E9E] hover:opacity-90 disabled:opacity-40 transition-all duration-200 shadow-lg shadow-purple-500/30"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Hint text */}
          <p className="text-center text-xs text-white/40 px-4">
            Pressione <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/50">Enter</kbd> para enviar, <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/50">Shift + Enter</kbd> para quebrar linha
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardChat;
