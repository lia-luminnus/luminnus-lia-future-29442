# 🤖 Chat Integrado da LIA - Painel Admin

## 📋 Visão Geral

O **Chat da LIA** é uma interface de conversação integrada ao painel administrativo da plataforma Luminnus, permitindo que administradores interajam com a assistente virtual LIA usando comandos naturais para configurar, gerenciar e automatizar o sistema.

---

## ✨ Funcionalidades

### Para Administradores
- ✅ Interface de chat estilo ChatGPT
- ✅ Integração com OpenAI API (GPT-4o-mini)
- ✅ Prompt personalizado para contexto administrativo
- ✅ Histórico de conversas persistido no Supabase
- ✅ Respostas inteligentes sobre:
  - Gerenciamento de usuários
  - Configuração de planos
  - Integrações e automações
  - Métricas e estatísticas
  - Configurações técnicas

### Interface
- 💬 Bolhas de mensagem estilo chat moderno
- 🎨 Design limpo e responsivo
- ⚡ Scroll automático
- 🔄 Auto-resize do campo de input
- ⌨️ Atalhos de teclado (Enter para enviar, Shift+Enter para quebrar linha)
- 🗑️ Limpar histórico de conversa

---

## 🏗️ Arquitetura

### Componentes Criados

1. **AdminLiaChat.tsx** (`/src/components/admin/AdminLiaChat.tsx`)
   - Componente principal do chat
   - Interface de usuário
   - Gerenciamento de estado das mensagens
   - Integração com edge function

2. **AdminSidebar.tsx** (atualizado)
   - Nova entrada "Assistente LIA" com ícone Bot
   - Posicionada como segunda opção no menu

3. **AdminDashboard.tsx** (atualizado)
   - Integração do AdminLiaChat no sistema de roteamento
   - Renderização condicional da seção

4. **Edge Function lia-chat** (atualizado)
   - Integração com OpenAI API
   - Prompts personalizados para admin/usuário
   - Sistema de fallback
   - Histórico de conversação

---

## 🔧 Configuração

### 1. Configurar Chave da OpenAI

Para usar a integração com OpenAI, você precisa configurar a variável de ambiente `OPENAI_API_KEY` no Supabase:

#### Opção A: Via Supabase Dashboard
1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá em **Project Settings** → **Edge Functions** → **Environment Variables**
3. Adicione a variável:
   - Nome: `OPENAI_API_KEY`
   - Valor: `sk-...` (sua chave da OpenAI)

#### Opção B: Via Supabase CLI
```bash
# Definir secret
supabase secrets set OPENAI_API_KEY=sk-...

# Verificar secrets
supabase secrets list
```

### 2. Obter Chave da OpenAI

1. Acesse [OpenAI Platform](https://platform.openai.com/api-keys)
2. Faça login ou crie uma conta
3. Clique em **"Create new secret key"**
4. Copie a chave (ela só será exibida uma vez!)
5. Cole no Supabase conforme instruções acima

### 3. Deploy da Edge Function

Após configurar a chave, faça o deploy da edge function atualizada:

```bash
# Deploy da função lia-chat
supabase functions deploy lia-chat

# Verificar status
supabase functions list
```

---

## 🎯 Prompt Base da LIA

### Para Administradores

```
Você é a LIA, assistente virtual da plataforma Luminnus.
Seu papel é ajudar o administrador a configurar, criar e gerenciar
todo o sistema e os recursos da Luminnus com comandos de texto ou voz.

Você é proativa, inteligente, compreende comandos naturais e é capaz
de criar planilhas, fluxos, autenticação, integrações e outras
automações avançadas.

Suas capacidades incluem:
- Configurar e gerenciar usuários e planos
- Criar e configurar integrações (WhatsApp, CRM, E-mail, etc)
- Configurar automações e fluxos de trabalho
- Gerenciar chaves de API e configurações técnicas
- Analisar dados e métricas da plataforma
- Criar relatórios e exportar dados
- Configurar permissões e acessos
- Ajudar com tarefas administrativas complexas

Sempre seja clara, objetiva e forneça instruções passo a passo
quando necessário. Use linguagem profissional mas amigável.
```

---

## 📊 Fluxo de Funcionamento

```
┌─────────────────────────────────────────────────────────────┐
│                    Admin envia mensagem                      │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  AdminLiaChat.tsx salva mensagem no Supabase                │
│  (tabela: chat_messages)                                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  Chama Edge Function lia-chat com flag isAdmin=true         │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  Edge Function verifica se OPENAI_API_KEY existe            │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
┌──────────────────┐      ┌──────────────────┐
│  OpenAI API      │      │  Fallback        │
│  (GPT-4o-mini)   │      │  (Keywords)      │
└────────┬─────────┘      └────────┬─────────┘
         │                         │
         └─────────┬───────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  Resposta da LIA é salva no Supabase                        │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  AdminLiaChat.tsx exibe resposta na interface               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Controle de Acesso

O chat da LIA no admin está protegido por:

1. **Email autorizado**: Apenas `luminnus.lia.ai@gmail.com` pode acessar
2. **Hook useAdminAuth**: Verifica permissões e redireciona não-admins
3. **Flag isAdmin**: Diferencia prompts e respostas para admin

---

## 💡 Exemplos de Uso

### Perguntas que o Admin pode fazer:

```
"Como gerenciar usuários?"
"Quantos usuários temos cadastrados?"
"Como configurar a integração com WhatsApp?"
"Quais são os planos disponíveis?"
"Como editar as permissões de um plano?"
"Mostre as estatísticas da plataforma"
"Como adicionar uma nova integração?"
```

### Respostas que a LIA pode dar:

✅ Instruções passo a passo para tarefas administrativas
✅ Explicações sobre funcionalidades do painel
✅ Orientações sobre configurações técnicas
✅ Sugestões de próximas ações
✅ Links para seções relevantes do admin

---

## 🗂️ Estrutura de Dados

### Tabela: `chat_messages`

```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES chat_conversations(id),
  user_id UUID REFERENCES auth.users(id),
  role TEXT CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabela: `chat_conversations`

```sql
CREATE TABLE chat_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🚀 Próximas Melhorias

### Funcionalidades Futuras
- [ ] Suporte para comandos de voz
- [ ] Exportar conversas em PDF/CSV
- [ ] Sugestões contextuais inteligentes
- [ ] Ações diretas (ex: "criar usuário João com plano Plus")
- [ ] Análise de sentimento nas conversas
- [ ] Multi-idioma (EN, ES, PT)
- [ ] Integração com ferramentas externas via webhooks

### Otimizações
- [ ] Cache de respostas frequentes
- [ ] Streaming de respostas (SSE)
- [ ] Rate limiting por usuário
- [ ] Modo offline com service workers
- [ ] Avatares personalizados

---

## 🐛 Troubleshooting

### Chat não responde

1. Verifique se a chave OpenAI está configurada:
   ```bash
   supabase secrets list
   ```

2. Verifique os logs da edge function:
   ```bash
   supabase functions logs lia-chat
   ```

3. Se não houver chave OpenAI, o sistema usa respostas fallback

### Erro "Não autorizado"

- Verifique se você está logado com `luminnus.lia.ai@gmail.com`
- Confirme que o token de sessão está válido
- Limpe o cache do navegador e faça login novamente

### Mensagens não aparecem

- Verifique conexão com Supabase
- Confirme que a tabela `chat_messages` existe
- Verifique RLS (Row Level Security) no Supabase

---

## 📝 Notas Técnicas

### Modelo de IA
- **Modelo**: GPT-4o-mini (OpenAI)
- **Temperatura**: 0.7 (balanceado)
- **Max Tokens**: 1000
- **Custo estimado**: ~$0.0015 por conversa (10 mensagens)

### Performance
- Tempo médio de resposta: 2-4 segundos
- Fallback response: < 100ms
- Suporta até 10 conversas simultâneas

### Segurança
- ✅ Autenticação JWT via Supabase
- ✅ RLS habilitado em todas as tabelas
- ✅ Chaves API armazenadas como secrets
- ✅ Validação de entrada/saída
- ✅ Rate limiting (futuro)

---

## 📚 Referências

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [React Query (TanStack)](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn UI](https://ui.shadcn.com/)

---

## 👥 Equipe

Desenvolvido para a **Luminnus Platform**
- Sistema: LIA (Luminnus Intelligent Assistant)
- Versão: 1.0.0
- Data: 2025

---

## 📄 Licença

Este componente faz parte do sistema proprietário Luminnus.
Todos os direitos reservados © 2025 Luminnus.
