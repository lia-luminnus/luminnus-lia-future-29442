import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send, Loader2, User, Sparkles, Trash2, Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { enviarMensagemLIA } from "@/lib/api/lia";
import { secureStorage } from "@/lib/secureStorage";
import { startRealtimeSession, stopRealtimeSession } from "@/lib/api/lia-realtime";

/**
 * INTERFACE: Mensagem de Chat
 */
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

/**
 * COMPONENTE: AdminLiaChat
 */
const AdminLiaChat = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 Olá! Sou a LIA, sua assistente virtual da Luminnus. Respondo em tempo real e com voz personalizada. Como posso ajudar você hoje?",
      created_at: new Date().toISOString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [micAtivo, setMicAtivo] = useState(false);
  const [transcricaoTemp, setTranscricaoTemp] = useState("");
  const [isRealtimeActive, setIsRealtimeActive] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Scroll automático
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [messages]);

  // Encerrar sessão ao desmontar
  useEffect(() => {
    return () => {
      if (micAtivo) stopRealtimeSession();
    };
  }, [micAtivo]);

  /**
   * 🔊 Alternar microfone / sessão Realtime
   */
  const toggleMicrofone = async () => {
    try {
      if (micAtivo) {
        await stopRealtimeSession();
        setMicAtivo(false);
        setIsRealtimeActive(false);
        setTranscricaoTemp("");
        toast({ title: "Microfone desativado", description: "Sessão de voz encerrada" });
        return;
      }

      await startRealtimeSession({
        backendUrl: "https://lia-chat-api.onrender.com",
        onConnected: () => {
          setIsRealtimeActive(true);
          setMicAtivo(true);
          toast({ title: "🎙️ Conectado à LIA", description: "Pode falar agora." });
        },
        onDisconnected: () => {
          setIsRealtimeActive(false);
          setMicAtivo(false);
        },
        onTranscript: (text, isFinal) => {
          if (isFinal) {
            const newUserMessage: ChatMessage = {
              id: `user-${Date.now()}`,
              role: "user",
              content: text,
              created_at: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, newUserMessage]);
            setTranscricaoTemp("");
          } else {
            setTranscricaoTemp(text);
          }
        },
        onError: (error) => {
          console.error("[Realtime Error]", error);
          toast({ title: "Erro Realtime", description: String(error), variant: "destructive" });
          setMicAtivo(false);
          setIsRealtimeActive(false);
        },
      });
    } catch (error) {
      console.error("[AdminChat] Erro ao ativar microfone:", error);
      toast({
        title: "Erro",
        description: "Não foi possível ativar o microfone",
        variant: "destructive",
      });
      setMicAtivo(false);
    }
  };

  // Ajuste dinâmico do textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + "px";
    }
  }, [inputMessage]);

  /**
   * 💬 Enviar mensagem via API Render
   */
  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputMessage.trim()) return;

    const config = secureStorage.load();
    if (!config?.liaApiUrl) {
      toast({
        title: "Configuração necessária",
        description: "⚠️ A API da LIA não está configurada. Vá em Configurações e adicione a URL da API.",
        variant: "destructive",
      });
      return;
    }

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setLoading(true);

    const newUserMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: userMessage,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newUserMessage]);

    try {
      const resposta = await enviarMensagemLIA(userMessage);
      const respostaTexto =
        resposta.reply || resposta.response || resposta.text || "Desculpe, não consegui responder agora.";

      const newAssistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: respostaTexto,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newAssistantMessage]);
    } catch (error) {
      console.error("[Chat Error]", error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: `❌ Erro: ${error instanceof Error ? error.message : "Falha ao enviar mensagem"}`,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast({ title: "Erro", description: String(error), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (t: string) => new Date(t).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "👋 Olá! Sou a LIA, sua assistente virtual da Luminnus. Como posso ajudar você hoje?",
        created_at: new Date().toISOString(),
      },
    ]);
    toast({ title: "Chat limpo", description: "O histórico foi removido." });
  };

  const handleQuickSuggestion = () => setInputMessage("Como você pode me ajudar?");

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          Assistente LIA
          <span className="text-xs font-normal bg-purple-100 text-purple-700 px-2 py-1 rounded-full">API Render</span>
        </h1>
        <p className="text-gray-600">Chat com integração Realtime (voz + texto)</p>
      </div>

      {/* CHAT */}
      <div className="flex flex-col h-[calc(100vh-280px)] relative">
        <Card className="flex-1 bg-white border border-gray-200 overflow-hidden shadow-lg">
          <CardContent className="h-full overflow-y-auto p-6 space-y-6">
            {messages.map((msg, i) => (
              <div
                key={msg.id || i}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                {msg.role === "assistant" && (
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-md ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-purple-600 to-purple-700 text-white"
                        : "bg-gray-100 text-gray-900 border border-gray-200"
                    }`}
                  >
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <span className="text-xs mt-1.5 px-2 text-gray-400">{formatTime(msg.created_at)}</span>
                </div>
                {msg.role === "user" && (
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl px-5 py-3 shadow-md flex gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-150"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-300"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>
        </Card>

        {/* INPUT */}
        <div className="mt-4 space-y-3">
          {transcricaoTemp && (
            <div className="px-4 py-2 bg-blue-50 border-t border-blue-200 mb-2">
              <p className="text-xs text-blue-600 italic flex items-center gap-2">
                <Mic className="w-3 h-3 animate-pulse" /> Ouvindo: {transcricaoTemp}
              </p>
            </div>
          )}
          <div className="flex items-center justify-center gap-2 px-4">
            <Button variant="ghost" size="sm" onClick={handleClearChat}>
              <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Limpar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMicrofone}
              className={`transition-all duration-200 ${
                micAtivo ? "text-red-600 animate-pulse" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {micAtivo ? (
                <>
                  <Mic className="w-3.5 h-3.5 mr-1.5" /> Ouvindo...
                </>
              ) : (
                <>
                  <MicOff className="w-3.5 h-3.5 mr-1.5" /> Microfone
                </>
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleQuickSuggestion}>
              <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Sugestões
            </Button>
          </div>

          <div className="max-w-4xl mx-auto w-full px-4">
            <form onSubmit={handleSendMessage} className="relative">
              <div className="relative bg-white border-2 border-gray-200 rounded-3xl shadow-lg focus-within:border-purple-500 transition-all">
                <Textarea
                  ref={textareaRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Digite sua mensagem..."
                  disabled={loading}
                  rows={1}
                  className="resize-none bg-transparent border-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 px-6 py-4"
                />
                <Button
                  type="submit"
                  disabled={loading || !inputMessage.trim()}
                  size="icon"
                  className="absolute right-2 bottom-2 h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLiaChat;
