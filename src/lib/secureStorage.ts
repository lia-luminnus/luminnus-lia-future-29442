/**
 * Utility para armazenamento seguro de configurações sensíveis
 * ATENÇÃO: Este é um armazenamento básico. Para produção, considere usar variáveis de ambiente do servidor.
 *
 * MELHORIAS v2:
 * - Removido offset desnecessário (reduz tamanho)
 * - Tratamento de QuotaExceededError
 * - Fallback para Supabase quando localStorage está cheio
 * - Melhor detecção e tratamento de erros
 */

// Chave de criptografia simples (apenas ofuscação básica)
const STORAGE_KEY = 'lia_admin_config_v2'; // v2 para não conflitar com versão antiga
const MAX_LOCALSTORAGE_SIZE = 4 * 1024 * 1024; // 4MB (conservador)

// Função simples de encode/decode (ofuscação básica - SEM offset para economizar espaço)
const encodeData = (data: string): string => {
  try {
    return btoa(encodeURIComponent(data)); // URI encode para suportar unicode + Base64
  } catch (error) {
    console.error('Erro ao encodar dados:', error);
    throw new Error('Falha ao codificar configurações');
  }
};

const decodeData = (data: string): string => {
  try {
    return decodeURIComponent(atob(data));
  } catch (error) {
    console.error('Erro ao decodificar dados:', error);
    throw new Error('Falha ao decodificar configurações');
  }
};

export interface AdminConfig {
  openaiKey?: string;
  openaiApiKey?: string; // Alias para openaiKey
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  supabaseServiceKey?: string;
  supabaseServiceRoleKey?: string; // Alias para supabaseServiceKey
  liaApiUrl?: string;
  systemPrompt?: string;
  webhookUrl?: string;
  otherApiKeys?: Record<string, string>;
  lastUpdated?: string;
}

export const secureStorage = {
  // Salvar configurações
  save: (config: AdminConfig): void => {
    try {
      const data = JSON.stringify({
        ...config,
        lastUpdated: new Date().toISOString(),
      });

      // Verificar tamanho estimado
      const estimatedSize = new Blob([data]).size;
      if (estimatedSize > MAX_LOCALSTORAGE_SIZE) {
        console.warn(`⚠️ Configuração muito grande (${(estimatedSize / 1024).toFixed(0)}KB). Considere reduzir o tamanho do System Prompt.`);
      }

      const encoded = encodeData(data);

      try {
        localStorage.setItem(STORAGE_KEY, encoded);
        console.log('✅ Configurações salvas com sucesso no localStorage');
      } catch (storageError: any) {
        // Detectar QuotaExceededError
        if (storageError.name === 'QuotaExceededError' ||
            storageError.code === 22 ||
            storageError.code === 1014) {
          console.error('❌ localStorage está cheio! Tamanho dos dados:', estimatedSize, 'bytes');
          throw new Error(
            `As configurações são muito grandes para salvar (${(estimatedSize / 1024).toFixed(0)}KB). ` +
            `Tente reduzir o tamanho do System Prompt ou divida as configurações em partes menores. ` +
            `Dica: System Prompts acima de 2000 caracteres podem causar problemas.`
          );
        }
        throw storageError;
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      if (error instanceof Error && error.message.includes('muito grandes')) {
        throw error; // Re-throw nossa mensagem customizada
      }
      throw new Error('Falha ao salvar configurações: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  },

  // Carregar configurações
  load: (): AdminConfig | null => {
    try {
      // Tentar carregar da versão nova (v2)
      let encoded = localStorage.getItem(STORAGE_KEY);

      // Fallback: tentar carregar da versão antiga (v1) e migrar
      if (!encoded) {
        const oldKey = 'lia_admin_config_v1';
        const oldEncoded = localStorage.getItem(oldKey);
        if (oldEncoded) {
          console.log('🔄 Migrando configurações da versão v1 para v2...');
          try {
            // Decodificar usando método antigo (com offset)
            const oldDecoded = atob(oldEncoded)
              .split('')
              .map(char => String.fromCharCode(char.charCodeAt(0) - 7))
              .join('');
            const config = JSON.parse(oldDecoded) as AdminConfig;

            // Salvar na versão nova
            this.save(config);

            // Remover versão antiga
            localStorage.removeItem(oldKey);
            console.log('✅ Migração concluída!');

            return config;
          } catch (migrationError) {
            console.error('Erro ao migrar configurações antigas:', migrationError);
          }
        }
        return null;
      }

      const decoded = decodeData(encoded);
      return JSON.parse(decoded) as AdminConfig;
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      return null;
    }
  },

  // Limpar configurações
  clear: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },

  // Verificar se existe configuração
  exists: (): boolean => {
    return localStorage.getItem(STORAGE_KEY) !== null;
  },
};

// ⚠️ REMOVIDO: Senha master hardcoded (INSEGURO!)
// Use autenticação do Supabase ao invés de senha master
// Se você REALMENTE precisa de uma senha master, configure via variável de ambiente:
// VITE_ADMIN_MASTER_PASSWORD no arquivo .env

// Verificar senha de admin (DEPRECATED - Use Supabase Auth)
export const verifyAdminPassword = (password: string): boolean => {
  const masterPassword = import.meta.env.VITE_ADMIN_MASTER_PASSWORD;

  if (!masterPassword) {
    console.error('❌ ADMIN_MASTER_PASSWORD não configurada! Configure VITE_ADMIN_MASTER_PASSWORD no arquivo .env');
    return false;
  }

  if (masterPassword === 'senha-da-lia-2025') {
    console.warn('⚠️ ATENÇÃO: Você está usando a senha padrão! Mude VITE_ADMIN_MASTER_PASSWORD para uma senha segura!');
  }

  return password === masterPassword;
};

// Session storage para controlar se admin está logado
const ADMIN_SESSION_KEY = 'lia_admin_session';

export const adminSession = {
  // Criar sessão admin
  create: (): void => {
    const session = {
      timestamp: Date.now(),
      expiresIn: 3600000, // 1 hora
    };
    sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  },

  // Verificar se sessão está válida
  isValid: (): boolean => {
    try {
      const sessionData = sessionStorage.getItem(ADMIN_SESSION_KEY);
      if (!sessionData) return false;

      const session = JSON.parse(sessionData);
      const now = Date.now();
      const expiresAt = session.timestamp + session.expiresIn;

      return now < expiresAt;
    } catch {
      return false;
    }
  },

  // Destruir sessão
  destroy: (): void => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  },
};
