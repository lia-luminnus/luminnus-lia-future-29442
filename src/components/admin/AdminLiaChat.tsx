import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Send, Loader2, User, Sparkles, Trash2, Volume2, VolumeX } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * URL da API Realtime da LIA hospedada no Render
 */
const LIA_API_URL = "https://lia-chat-api.onrender.com";

/**
 * INTERFACE: Mensagem de Chat
 */
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

/**
 * COMPONENTE: AdminLiaChat
 *
 * Chat integrado com a LIA especificamente para administradores
 * Interface estilo ChatGPT com integração API Render (WebSocket + Voz)
 */
const AdminLiaChat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
   * EFEITO: Cleanup - Fechar WebSocket e áudio ao desmontar
   */
  useEffect(() => {
    return () => {
      // Fechar WebSocket se estiver aberto
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      // Parar áudio se estiver tocando
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  /**
   * EFEITO: Redimensionar textarea automaticamente
   */
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, [inputMessage]);

  /**
   * FUNÇÃO: Carregar ou criar conversa
   */
  const loadOrCreateConversation = async () => {
    if (!user) return;

    try {
      // Tentar buscar uma conversa de admin existente
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

        // Adicionar mensagem de boas-vindas da LIA
        const welcomeMessage: ChatMessage = {
          id: 'welcome',
          role: 'assistant',
          content: '👋 Olá! Sou a LIA, sua assistente virtual da plataforma Luminnus com respostas em tempo real e voz personalizada. Estou aqui para ajudá-lo a configurar, criar e gerenciar todo o sistema. Como posso ajudar você hoje?',
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
          content: '👋 Olá! Sou a LIA, sua assistente virtual da plataforma Luminnus com respostas em tempo real e voz personalizada. Estou aqui para ajudá-lo a configurar, criar e gerenciar todo o sistema. Como posso ajudar você hoje?',
          created_at: new Date().toISOString(),
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  /**
   * FUNÇÃO: Reproduzir voz da LIA
   */
  const playVoice = async () => {
    if (!voiceEnabled) return;

    try {
      // Criar novo elemento de áudio para reproduzir voz da LIA
      const audio = new Audio(`${LIA_API_URL}/voice`);
      audioRef.current = audio;
      await audio.play();
    } catch (error) {
      console.error('Erro ao reproduzir voz da LIA:', error);
      // Não mostra toast para não ser intrusivo
    }
  };

  /**
   * FUNÇÃO: Enviar mensagem via API Realtime (Render)
   */
  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!inputMessage.trim() || !conversationId || !user) return;

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
      // Salvar mensagem do usuário no Supabase para histórico
      const { error: userMsgError } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          role: 'user',
          content: userMessage,
        });

      if (userMsgError) {
        console.error('Erro ao salvar mensagem do usuário:', userMsgError);
      }

      // Criar sessão realtime com a API do Render
      const sessionResponse = await fetch(`${LIA_API_URL}/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!sessionResponse.ok) {
        throw new Error('Erro ao criar sessão com a LIA');
      }

      const sessionData = await sessionResponse.json();

      if (!sessionData?.client_secret?.value) {
        throw new Error('Sessão inválida retornada pela API');
      }

      // Conectar via WebSocket
      const ws = new WebSocket(sessionData.client_secret.value);
      wsRef.current = ws;

      // Handler: Conexão aberta
      ws.onopen = () => {
        console.log('WebSocket conectado à LIA');
        // Enviar mensagem do usuário
        ws.send(JSON.stringify({
          type: 'input_text',
          text: userMessage
        }));
      };

      // Handler: Mensagens recebidas
      ws.onmessage = async (event) => {
        try {
          const msg = JSON.parse(event.data);

          // Processar resposta de texto
          if (msg.type === 'response_text' && msg.text) {
            const assistantMessage: ChatMessage = {
              id: `temp-assistant-${Date.now()}`,
              role: 'assistant',
              content: msg.text,
              created_at: new Date().toISOString(),
            };

            setMessages(prev => [...prev, assistantMessage]);
            setLoading(false);

            // Salvar resposta da Lia no Supabase
            const { error: assistantMsgError } = await supabase
              .from('chat_messages')
              .insert({
                conversation_id: conversationId,
                role: 'assistant',
                content: msg.text,
              });

            if (assistantMsgError) {
              console.error('Erro ao salvar resposta da Lia:', assistantMsgError);
            }

            // Reproduzir voz da LIA
            await playVoice();

            // Fechar conexão WebSocket após receber resposta
            ws.close();
          }
        } catch (error) {
          console.error('Erro ao processar mensagem do WebSocket:', error);
        }
      };

      // Handler: Erro no WebSocket
      ws.onerror = (error) => {
        console.error('Erro no WebSocket:', error);
        setLoading(false);
        toast({
          title: 'Erro de conexão',
          description: 'Não foi possível conectar com a LIA.',
          variant: 'destructive',
        });
        ws.close();
      };

      // Handler: Conexão fechada
      ws.onclose = () => {
        console.log('WebSocket desconectado');
        setLoading(false);
      };

      // Timeout de segurança (30 segundos)
      setTimeout(() => {
        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
          ws.close();
          setLoading(false);
          toast({
            title: 'Timeout',
            description: 'A LIA demorou muito para responder.',
            variant: 'destructive',
          });
        }
      }, 30000);

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setLoading(false);
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar a mensagem. Tente novamente.',
        variant: 'destructive',
      });
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
        content: '👋 Olá! Sou a LIA, sua assistente virtual da plataforma Luminnus com respostas em tempo real e voz personalizada. Estou aqui para ajudá-lo a configurar, criar e gerenciar todo o sistema. Como posso ajudar você hoje?',
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
   * FUNÇÃO: Sugestão rápida
   */
  const handleQuickSuggestion = () => {
    setInputMessage('Como você pode me ajudar?');
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          Assistente LIA
          <span className="text-xs font-normal bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
            Realtime + Voz
          </span>
        </h1>
        <p className="text-gray-600">
          Chat integrado com a LIA para administradores - Respostas em tempo real via WebSocket com voz personalizada
        </p>
      </div>

      {/* CHAT INTERFACE */}
      <div className="flex flex-col h-[calc(100vh-280px)] relative">
        {/* ÁREA DE MENSAGENS */}
        <Card className="flex-1 bg-white border border-gray-200 overflow-hidden shadow-lg">
          <CardContent className="h-full overflow-y-auto p-6 space-y-6">
            {messages.map((message, index) => (
              <div
                key={message.id || index}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                {/* Avatar da Lia */}
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}

                {/* Bolha de mensagem */}
                <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-md ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white'
                        : 'bg-gray-100 text-gray-900 border border-gray-200'
                    }`}
                  >
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <span className={`text-xs mt-1.5 px-2 ${message.role === 'user' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {formatTime(message.created_at)}
                  </span>
                </div>

                {/* Avatar do Usuário */}
                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex gap-3 justify-start animate-in fade-in duration-200">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gray-100 text-gray-900 border border-gray-200 rounded-2xl px-5 py-3 shadow-md">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
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
              onClick={handleClearChat}
              className="text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 rounded-full px-3 py-1.5 h-auto"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Limpar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`text-xs transition-all duration-200 rounded-full px-3 py-1.5 h-auto ${
                voiceEnabled
                  ? 'text-purple-600 hover:text-purple-700 hover:bg-purple-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {voiceEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 mr-1.5" />
                  Voz Ativa
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 mr-1.5" />
                  Voz Desativada
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleQuickSuggestion}
              className="text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 rounded-full px-3 py-1.5 h-auto"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Sugestões
            </Button>
          </div>

          {/* Input Container */}
          <div className="max-w-4xl mx-auto w-full px-4">
            <form onSubmit={handleSendMessage} className="relative">
              <div className="relative bg-white border-2 border-gray-200 rounded-3xl shadow-lg focus-within:border-purple-500 focus-within:shadow-purple-200 transition-all duration-200">
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
                  className="resize-none bg-transparent border-0 text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 pr-14 py-4 px-6 text-[15px] leading-relaxed max-h-[150px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                  style={{ minHeight: '56px' }}
                />
                <Button
                  type="submit"
                  disabled={loading || !inputMessage.trim()}
                  size="icon"
                  className="absolute right-2 bottom-2 h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 hover:opacity-90 disabled:opacity-40 transition-all duration-200 shadow-lg shadow-purple-500/30"
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
          <p className="text-center text-xs text-gray-500 px-4">
            Pressione <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 border border-gray-300">Enter</kbd> para enviar, <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 border border-gray-300">Shift + Enter</kbd> para quebrar linha
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLiaChat;
