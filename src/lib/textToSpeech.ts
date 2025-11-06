/**
 * Módulo de Text-to-Speech usando Web Speech API
 * Converte texto em fala usando vozes nativas do navegador
 */

class TextToSpeechManager {
  private synthesis: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;
  private voicesLoaded = false;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.loadVoices();
  }

  /**
   * Carrega as vozes disponíveis
   */
  private loadVoices() {
    const voices = this.synthesis.getVoices();
    if (voices.length > 0) {
      this.voicesLoaded = true;
    } else {
      window.speechSynthesis.addEventListener('voiceschanged', () => {
        this.voicesLoaded = true;
      });
    }
  }

  /**
   * Obtém voz em português brasileiro
   */
  private getPortugueseVoice(): SpeechSynthesisVoice | null {
    const voices = this.synthesis.getVoices();
    
    // Preferência: voz brasileira feminina
    const ptBRVoice = voices.find(v => 
      v.lang === 'pt-BR' && v.name.includes('female')
    ) || voices.find(v => v.lang === 'pt-BR');
    
    // Fallback: qualquer voz portuguesa
    const ptVoice = voices.find(v => v.lang.startsWith('pt'));
    
    return ptBRVoice || ptVoice || null;
  }

  /**
   * Fala o texto fornecido
   */
  speak(text: string, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    onEnd?: () => void;
  }): void {
    // Parar qualquer fala em andamento
    this.stop();

    this.utterance = new SpeechSynthesisUtterance(text);
    
    // Configurar voz
    const voice = this.getPortugueseVoice();
    if (voice) {
      this.utterance.voice = voice;
    }
    
    // Configurações
    this.utterance.rate = options?.rate || 1.0;
    this.utterance.pitch = options?.pitch || 1.0;
    this.utterance.volume = options?.volume || 1.0;
    this.utterance.lang = 'pt-BR';

    // Callback de conclusão
    if (options?.onEnd) {
      this.utterance.onend = options.onEnd;
    }

    // Erro handling
    this.utterance.onerror = (event) => {
      console.error('[TTS] Erro ao falar:', event);
    };

    this.synthesis.speak(this.utterance);
  }

  /**
   * Para a fala atual
   */
  stop(): void {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
    }
  }

  /**
   * Verifica se está falando
   */
  isSpeaking(): boolean {
    return this.synthesis.speaking;
  }

  /**
   * Pausa a fala
   */
  pause(): void {
    if (this.synthesis.speaking && !this.synthesis.paused) {
      this.synthesis.pause();
    }
  }

  /**
   * Retoma a fala
   */
  resume(): void {
    if (this.synthesis.paused) {
      this.synthesis.resume();
    }
  }
}

// Exportar instância singleton
export const textToSpeech = new TextToSpeechManager();

// Funções auxiliares
export const speakText = (text: string, options?: Parameters<typeof textToSpeech.speak>[1]) => {
  textToSpeech.speak(text, options);
};

export const stopSpeaking = () => {
  textToSpeech.stop();
};

export const isSpeaking = () => {
  textToSpeech.isSpeaking();
};
