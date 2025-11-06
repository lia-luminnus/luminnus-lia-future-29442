/**
 * Módulo de integração com a API da LIA
 * API hospedada no Render: https://lia-chat-api.onrender.com
 *
 * Funcionalidades:
 * - Envio e recebimento de mensagens via endpoint /chat
 * - Tratamento de erros e respostas
 */

import { secureStorage } from "@/lib/secureStorage";

/**
 * URL base da API da LIA no Render (fallback padrão)
 */
const LIA_API_URL_DEFAULT = "https://lia-chat-api.onrender.com";

/**
 * FUNÇÃO: Obter URL da API da LIA configurada
 * Busca a URL configurada no secureStorage ou retorna a URL padrão
 * @returns URL da API da LIA
 */
export function obterUrlApiLIA(): string {
  const config = secureStorage.load();
  return config?.liaApiUrl || LIA_API_URL_DEFAULT;
}

/**
 * URL base da API da LIA no Render
 * @deprecated Use obterUrlApiLIA() para obter a URL configurada dinamicamente
 */
export const LIA_API_URL = LIA_API_URL_DEFAULT;

/**
 * Interface de resposta da API
 */
export interface LiaResponse {
  response?: string;
  reply?: string;
  text?: string;
  message?: string;
  error?: string;
  audioUrl?: string;
}

/**
 * FUNÇÃO: Enviar mensagem para a LIA
 * @param mensagem - A mensagem a ser enviada para a LIA
 * @returns Promise com a resposta da API
 */
export async function enviarMensagemLIA(mensagem: string): Promise<LiaResponse> {
  try {
    const apiUrl = obterUrlApiLIA();
    const response = await fetch(`${apiUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: mensagem }),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    throw new Error("Não foi possível se conectar à LIA.");
  }
}

/**
 * FUNÇÃO: Verificar status da API
 * @returns Promise<boolean> indicando se a API está online
 */
export async function verificarStatusAPI(): Promise<boolean> {
  try {
    const apiUrl = obterUrlApiLIA();
    const response = await fetch(`${apiUrl}/health`, {
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
 * FUNÇÃO: Reproduzir áudio de voz (se disponível)
 * @param audioUrl - URL do áudio retornado pela API
 */
export async function reproduzirVoz(audioUrl: string): Promise<void> {
  try {
    const audio = new Audio(audioUrl);
    await audio.play();
  } catch (error) {
    console.error('Erro ao reproduzir voz:', error);
    // Não lançar erro para não interromper o fluxo
  }
}
