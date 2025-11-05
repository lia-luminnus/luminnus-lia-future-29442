/**
 * Módulo de integração com a API da LIA
 * API hospedada no Render: https://lia-chat-api.onrender.com
 *
 * Funcionalidades:
 * - Envio e recebimento de mensagens em tempo real via fetch/streaming
 * - Reprodução automática de voz
 * - Tratamento de erros e status de conexão
 */

/**
 * URL base da API da LIA no Render
 */
export const LIA_API_URL = "https://lia-chat-api.onrender.com";

/**
 * Status da conexão com a LIA
 */
export enum LiaStatus {
  IDLE = 'idle',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  STREAMING = 'streaming',
  ERROR = 'error',
  OFFLINE = 'offline'
}

/**
 * Interface para callback de status
 */
export type StatusCallback = (status: LiaStatus, message?: string) => void;

/**
 * Interface para callback de mensagem
 */
export type MessageCallback = (message: string, isDone: boolean) => void;

/**
 * Interface de resposta da API de sessão
 */
interface SessionResponse {
  client_secret: {
    value: string;
  };
}

/**
 * Interface de mensagem WebSocket
 */
interface WebSocketMessage {
  type: string;
  text?: string;
  delta?: string;
}

/**
 * Opções para enviar mensagem
 */
export interface SendMessageOptions {
  message: string;
  onMessage: MessageCallback;
  onStatus?: StatusCallback;
  voiceEnabled?: boolean;
}

/**
 * FUNÇÃO: Criar sessão com a API da LIA
 * Retorna o client_secret para conexão WebSocket
 */
async function createSession(onStatus?: StatusCallback): Promise<string> {
  try {
    onStatus?.(LiaStatus.CONNECTING, 'Conectando com a LIA...');

    const response = await fetch(`${LIA_API_URL}/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
    }

    const data: SessionResponse = await response.json();

    if (!data?.client_secret?.value) {
      throw new Error('Sessão inválida retornada pela API');
    }

    onStatus?.(LiaStatus.CONNECTED, 'LIA online');
    return data.client_secret.value;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    onStatus?.(LiaStatus.ERROR, `Erro ao conectar: ${errorMessage}`);
    throw new Error(`Falha ao criar sessão: ${errorMessage}`);
  }
}

/**
 * FUNÇÃO: Enviar mensagem via WebSocket e receber resposta em tempo real
 * Usa WebSocket para streaming de respostas
 */
export async function sendMessage(options: SendMessageOptions): Promise<void> {
  const { message, onMessage, onStatus, voiceEnabled = true } = options;

  let ws: WebSocket | null = null;
  let responseText = '';

  try {
    // Criar sessão
    const clientSecret = await createSession(onStatus);

    // Conectar via WebSocket
    ws = new WebSocket(clientSecret);

    return new Promise((resolve, reject) => {
      if (!ws) {
        reject(new Error('WebSocket não inicializado'));
        return;
      }

      // Handler: Conexão aberta
      ws.onopen = () => {
        onStatus?.(LiaStatus.STREAMING, 'Enviando mensagem...');

        // Enviar mensagem do usuário
        ws?.send(JSON.stringify({
          type: 'input_text',
          text: message
        }));
      };

      // Handler: Mensagens recebidas
      ws.onmessage = async (event) => {
        try {
          const msg: WebSocketMessage = JSON.parse(event.data);

          // Processar resposta de texto completa
          if (msg.type === 'response_text' && msg.text) {
            responseText = msg.text;
            onMessage(msg.text, true);

            // Reproduzir voz se habilitado
            if (voiceEnabled) {
              await playVoice(onStatus);
            }

            onStatus?.(LiaStatus.IDLE, 'Resposta recebida');
            ws?.close();
            resolve();
          }
          // Processar delta de streaming (se disponível)
          else if (msg.type === 'response_delta' && msg.delta) {
            responseText += msg.delta;
            onMessage(responseText, false);
          }
        } catch (error) {
          console.error('Erro ao processar mensagem:', error);
        }
      };

      // Handler: Erro no WebSocket
      ws.onerror = (error) => {
        const errorMsg = 'Erro de conexão com a LIA';
        console.error('WebSocket error:', error);
        onStatus?.(LiaStatus.ERROR, errorMsg);
        reject(new Error(errorMsg));
      };

      // Handler: Conexão fechada
      ws.onclose = (event) => {
        if (!event.wasClean && responseText === '') {
          const errorMsg = 'Conexão fechada inesperadamente';
          onStatus?.(LiaStatus.ERROR, errorMsg);
          reject(new Error(errorMsg));
        }
      };

      // Timeout de segurança (30 segundos)
      setTimeout(() => {
        if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
          ws.close();
          const errorMsg = 'Timeout: LIA demorou muito para responder';
          onStatus?.(LiaStatus.ERROR, errorMsg);
          reject(new Error(errorMsg));
        }
      }, 30000);
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro ao enviar mensagem';
    onStatus?.(LiaStatus.ERROR, errorMessage);
    throw error;
  } finally {
    // Cleanup: Fechar WebSocket se ainda estiver aberto
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
  }
}

/**
 * FUNÇÃO: Reproduzir voz da LIA
 * Faz requisição ao endpoint /voice e reproduz o áudio automaticamente
 */
export async function playVoice(onStatus?: StatusCallback): Promise<void> {
  try {
    const audio = new Audio(`${LIA_API_URL}/voice`);

    // Event listeners para feedback
    audio.onplay = () => {
      onStatus?.(LiaStatus.STREAMING, 'Reproduzindo voz da LIA...');
    };

    audio.onended = () => {
      onStatus?.(LiaStatus.IDLE, 'Voz reproduzida com sucesso');
    };

    audio.onerror = (error) => {
      console.error('Erro ao reproduzir voz:', error);
      onStatus?.(LiaStatus.ERROR, 'Erro ao reproduzir voz');
    };

    await audio.play();
  } catch (error) {
    console.error('Erro ao iniciar reprodução de voz:', error);
    onStatus?.(LiaStatus.ERROR, 'Erro ao reproduzir voz');
    // Não lançar erro para não interromper o fluxo
  }
}

/**
 * FUNÇÃO: Verificar status da API
 * Faz uma requisição simples para verificar se a API está online
 */
export async function checkApiStatus(): Promise<boolean> {
  try {
    const response = await fetch(`${LIA_API_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000), // Timeout de 5 segundos
    });
    return response.ok;
  } catch (error) {
    console.error('API da LIA offline:', error);
    return false;
  }
}

/**
 * FUNÇÃO: Obter mensagem de status legível
 */
export function getStatusMessage(status: LiaStatus): string {
  const messages: Record<LiaStatus, string> = {
    [LiaStatus.IDLE]: 'Pronta para conversar',
    [LiaStatus.CONNECTING]: 'Conectando...',
    [LiaStatus.CONNECTED]: 'LIA online',
    [LiaStatus.STREAMING]: 'Respondendo...',
    [LiaStatus.ERROR]: 'Erro ao conectar',
    [LiaStatus.OFFLINE]: 'LIA offline'
  };

  return messages[status] || 'Status desconhecido';
}

/**
 * Interface de resposta da API POST /chat
 */
export interface LiaChatResponse {
  text: string;
  voiceUrl?: string;
  success: boolean;
  error?: string;
}

/**
 * FUNÇÃO: Enviar mensagem via POST /chat (alternativa REST simples)
 * Útil para casos onde não é necessário streaming em tempo real
 *
 * @param mensagem - Texto da mensagem do usuário
 * @returns Resposta da LIA com texto e URL de voz (se disponível)
 */
export async function enviarMensagemLIA(mensagem: string): Promise<LiaChatResponse> {
  try {
    const response = await fetch(`${LIA_API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: mensagem }),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Retornar resposta formatada
    return {
      text: data.response || data.text || data.message || '',
      voiceUrl: data.voiceUrl || data.voice_url || data.audio,
      success: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro ao comunicar com a LIA';
    console.error('Erro ao enviar mensagem:', error);

    return {
      text: '',
      voiceUrl: undefined,
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * FUNÇÃO: Reproduzir áudio a partir de uma URL
 *
 * @param audioUrl - URL do arquivo de áudio
 * @param onStatus - Callback opcional para feedback de status
 */
export async function reproduzirAudio(audioUrl: string, onStatus?: StatusCallback): Promise<void> {
  try {
    const audio = new Audio(audioUrl);

    audio.onplay = () => {
      onStatus?.(LiaStatus.STREAMING, 'Reproduzindo voz da LIA...');
    };

    audio.onended = () => {
      onStatus?.(LiaStatus.IDLE, 'Voz reproduzida com sucesso');
    };

    audio.onerror = (error) => {
      console.error('Erro ao reproduzir áudio:', error);
      onStatus?.(LiaStatus.ERROR, 'Erro ao reproduzir áudio');
    };

    await audio.play();
  } catch (error) {
    console.error('Erro ao iniciar reprodução de áudio:', error);
    onStatus?.(LiaStatus.ERROR, 'Erro ao reproduzir áudio');
  }
}

/**
 * FUNÇÃO: Limpar recursos (cleanup)
 * Útil para quando o componente for desmontado
 */
export function cleanup(): void {
  // Qualquer limpeza necessária
  // Por enquanto, não há recursos globais para limpar
}
