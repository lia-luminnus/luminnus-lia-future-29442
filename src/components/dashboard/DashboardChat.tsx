import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bot, Send, Loader2, User, AlertCircle } from 'lucide-react';
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
        setMessages(data);
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
      <Card className="bg-white/5 backdrop-blur-lg border border-white/10 h-[calc(100vh-300px)] flex flex-col">
        {/* MENSAGENS */}
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={message.id || index}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {/* Avatar da Lia */}
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#6A00FF] to-[#00C2FF] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}

              {/* Bolha de mensagem */}
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#FF2E9E] text-white'
                    : 'bg-white/10 text-white border border-white/10'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-white/70' : 'text-white/50'}`}>
                  {formatTime(message.created_at)}
                </p>
              </div>

              {/* Avatar do Usuário */}
              {message.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#FF2E9E] to-[#7C3AED] flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#6A00FF] to-[#00C2FF] flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white/10 text-white border border-white/10 rounded-2xl px-4 py-3">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        {/* INPUT DE MENSAGEM */}
        <div className="border-t border-white/10 p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              disabled={loading}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#00C2FF]"
            />
            <Button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="bg-gradient-to-r from-[#7C3AED] to-[#FF2E9E] hover:opacity-90"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default DashboardChat;
