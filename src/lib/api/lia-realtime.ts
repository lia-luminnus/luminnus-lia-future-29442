/**
 * Módulo de integração de voz em tempo real com a LIA
 * Implementa funcionalidades de reconhecimento de fala (ouvir) e síntese de voz (falar)
 *
 * Funcionalidades:
 * - Speech Recognition (Web Speech API) para capturar voz do usuário
 * - Speech Synthesis (Web Speech API) para LIA responder com voz
 * - Gerenciamento de sessão de voz em tempo real
 */

// Tipos e interfaces
interface VoiceConfig {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

// Extend Window interface para suportar webkitSpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// Estado da sessão de voz
let recognition: any = null;
let isListening = false;
let isSpeaking = false;
let onTranscriptCallback: ((text: string) => void) | null = null;
let onFinalTranscriptCallback: ((text: string) => void) | null = null;
let onErrorCallback: ((error: string) => void) | null = null;

/**
 * Verifica se o navegador suporta Speech Recognition
 */
export function isSpeechRecognitionSupported(): boolean {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

/**
 * Verifica se o navegador suporta Speech Synthesis
 */
export function isSpeechSynthesisSupported(): boolean {
  return 'speechSynthesis' in window;
}

/**
 * Inicializa o reconhecimento de voz
 */
function initializeSpeechRecognition(config: VoiceConfig) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    throw new Error('Speech Recognition não é suportado neste navegador');
  }

  recognition = new SpeechRecognition();
  recognition.lang = config.lang;
  recognition.continuous = config.continuous;
  recognition.interimResults = config.interimResults;

  // Handler para resultados parciais e finais
  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;

      if (event.results[i].isFinal) {
        finalTranscript += transcript + ' ';
      } else {
        interimTranscript += transcript;
      }
    }

    // Callback para transcrição parcial
    if (interimTranscript && onTranscriptCallback) {
      onTranscriptCallback(interimTranscript);
    }

    // Callback para transcrição final
    if (finalTranscript && onFinalTranscriptCallback) {
      onFinalTranscriptCallback(finalTranscript.trim());
    }
  };

  // Handler para erros
  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    console.error('[Voice] Erro no reconhecimento:', event.error);

    let errorMessage = 'Erro ao reconhecer voz';

    switch (event.error) {
      case 'no-speech':
        errorMessage = 'Nenhuma fala detectada';
        break;
      case 'audio-capture':
        errorMessage = 'Microfone não encontrado';
        break;
      case 'not-allowed':
        errorMessage = 'Permissão de microfone negada';
        break;
      case 'network':
        errorMessage = 'Erro de rede';
        break;
    }

    if (onErrorCallback) {
      onErrorCallback(errorMessage);
    }

    isListening = false;
  };

  // Handler para fim do reconhecimento
  recognition.onend = () => {
    console.log('[Voice] Reconhecimento finalizado');
    if (isListening && config.continuous) {
      // Reinicia automaticamente se estiver em modo contínuo
      try {
        recognition.start();
      } catch (error) {
        console.error('[Voice] Erro ao reiniciar reconhecimento:', error);
        isListening = false;
      }
    } else {
      isListening = false;
    }
  };
}

/**
 * Inicia uma sessão de reconhecimento de voz
 * @param callbacks - Callbacks para transcrição e erros
 * @param config - Configurações opcionais
 */
export async function startRealtimeSession(
  callbacks?: {
    onTranscript?: (text: string) => void;
    onFinalTranscript?: (text: string) => void;
    onError?: (error: string) => void;
  },
  config?: Partial<VoiceConfig>
): Promise<void> {
  if (!isSpeechRecognitionSupported()) {
    throw new Error('Reconhecimento de voz não é suportado neste navegador');
  }

  if (isListening) {
    console.warn('[Voice] Sessão de voz já está ativa');
    return;
  }

  // Solicitar permissão de microfone
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop()); // Para o stream, só precisamos da permissão
  } catch (error) {
    throw new Error('Permissão de microfone negada');
  }

  // Configurar callbacks
  onTranscriptCallback = callbacks?.onTranscript || null;
  onFinalTranscriptCallback = callbacks?.onFinalTranscript || null;
  onErrorCallback = callbacks?.onError || null;

  // Configurações padrão
  const voiceConfig: VoiceConfig = {
    lang: config?.lang || 'pt-BR',
    continuous: config?.continuous !== undefined ? config.continuous : true,
    interimResults: config?.interimResults !== undefined ? config.interimResults : true,
  };

  // Inicializar e começar reconhecimento
  initializeSpeechRecognition(voiceConfig);

  try {
    recognition.start();
    isListening = true;
    console.log('[Voice] Sessão de voz iniciada');
  } catch (error) {
    console.error('[Voice] Erro ao iniciar reconhecimento:', error);
    throw new Error('Erro ao iniciar reconhecimento de voz');
  }
}

/**
 * Para a sessão de reconhecimento de voz
 */
export async function stopRealtimeSession(): Promise<void> {
  if (!isListening || !recognition) {
    console.warn('[Voice] Nenhuma sessão de voz ativa');
    return;
  }

  try {
    recognition.stop();
    isListening = false;
    console.log('[Voice] Sessão de voz parada');
  } catch (error) {
    console.error('[Voice] Erro ao parar reconhecimento:', error);
    throw new Error('Erro ao parar reconhecimento de voz');
  }
}

/**
 * Verifica se está ouvindo
 */
export function isVoiceListening(): boolean {
  return isListening;
}

/**
 * Verifica se está falando
 */
export function isVoiceSpeaking(): boolean {
  return isSpeaking;
}

/**
 * Fala um texto usando Speech Synthesis
 * @param text - Texto para ser falado
 * @param options - Opções de voz (idioma, velocidade, pitch, volume)
 */
export async function speakText(
  text: string,
  options?: {
    lang?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
    voice?: SpeechSynthesisVoice;
  }
): Promise<void> {
  if (!isSpeechSynthesisSupported()) {
    console.warn('[Voice] Speech Synthesis não é suportado neste navegador');
    return;
  }

  // Cancela qualquer fala em andamento
  window.speechSynthesis.cancel();

  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text);

    // Configurações
    utterance.lang = options?.lang || 'pt-BR';
    utterance.rate = options?.rate || 1.0;
    utterance.pitch = options?.pitch || 1.0;
    utterance.volume = options?.volume || 1.0;

    // Se uma voz específica foi fornecida
    if (options?.voice) {
      utterance.voice = options.voice;
    } else {
      // Tenta encontrar uma voz em português brasileiro
      const voices = window.speechSynthesis.getVoices();
      const ptBRVoice = voices.find(voice =>
        voice.lang === 'pt-BR' || voice.lang.startsWith('pt-BR')
      );
      if (ptBRVoice) {
        utterance.voice = ptBRVoice;
      }
    }

    // Handlers
    utterance.onstart = () => {
      isSpeaking = true;
      console.log('[Voice] Começou a falar');
    };

    utterance.onend = () => {
      isSpeaking = false;
      console.log('[Voice] Terminou de falar');
      resolve();
    };

    utterance.onerror = (event) => {
      isSpeaking = false;
      console.error('[Voice] Erro ao falar:', event);
      reject(new Error('Erro ao sintetizar voz'));
    };

    // Iniciar fala
    window.speechSynthesis.speak(utterance);
  });
}

/**
 * Para a fala em andamento
 */
export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
    isSpeaking = false;
    console.log('[Voice] Fala interrompida');
  }
}

/**
 * Obtém as vozes disponíveis
 */
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (!isSpeechSynthesisSupported()) {
    return [];
  }

  return window.speechSynthesis.getVoices();
}

/**
 * Obtém vozes em português
 */
export function getPortugueseVoices(): SpeechSynthesisVoice[] {
  const voices = getAvailableVoices();
  return voices.filter(voice =>
    voice.lang.startsWith('pt') || voice.lang === 'pt-BR' || voice.lang === 'pt-PT'
  );
}

/**
 * Carrega as vozes (necessário em alguns navegadores)
 */
export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();

    if (voices.length > 0) {
      resolve(voices);
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        resolve(window.speechSynthesis.getVoices());
      };
    }
  });
}
