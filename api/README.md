# 🚀 API da LIA - Backend

API REST da LIA (Luminnus Intelligent Assistant) para processamento de mensagens de chat usando OpenAI GPT-3.5-turbo.

## 📋 Endpoints

### `GET /`
Verifica se a API está ativa.

**Resposta:**
```
LIA Chat API ativa!
```

### `GET /health`
Endpoint de health check para monitoramento.

**Resposta:**
```json
{
  "status": "ok",
  "message": "API está online"
}
```

### `POST /chat`
Envia uma mensagem para a LIA e recebe a resposta processada.

**Request Body:**
```json
{
  "message": "Olá, LIA!"
}
```

**Resposta de Sucesso (200):**
```json
{
  "reply": "Olá! Como posso ajudar você hoje?"
}
```

**Resposta de Erro (400):**
```json
{
  "error": "Mensagem não fornecida."
}
```

**Resposta de Erro (500):**
```json
{
  "error": "Erro interno no servidor."
}
```

## 🔧 Configuração Local

### 1. Instalar dependências
```bash
cd api
npm install
```

### 2. Configurar variáveis de ambiente
Crie um arquivo `.env` na pasta `api`:

```env
OPENAI_API_KEY=sua_chave_openai_aqui
PORT=3000
```

### 3. Executar servidor
```bash
npm start
```

O servidor estará disponível em `http://localhost:3000`

## 🌐 Deploy no Render

### Passo 1: Preparar o repositório
Certifique-se de que os arquivos `api/server.js` e `api/package.json` estão commitados no repositório.

### Passo 2: Criar novo Web Service no Render
1. Acesse [https://render.com](https://render.com)
2. Clique em **"New +"** → **"Web Service"**
3. Conecte seu repositório GitHub
4. Configure o serviço:
   - **Name:** `lia-chat-api`
   - **Region:** `Oregon (US West)` ou mais próximo
   - **Branch:** `main` (ou sua branch principal)
   - **Root Directory:** `api`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free` (ou superior)

### Passo 3: Configurar variáveis de ambiente
No painel do Render, vá em **Environment** e adicione:

- **OPENAI_API_KEY**: sua chave da OpenAI (obrigatório)
  - Obtenha em: https://platform.openai.com/api-keys
  - Formato: `sk-proj-...`

### Passo 4: Deploy
Clique em **"Create Web Service"** e aguarde o deploy finalizar.

Sua API estará disponível em:
```
https://lia-chat-api.onrender.com
```

### Passo 5: Testar
Acesse a URL do seu serviço no navegador. Você deve ver:
```
LIA Chat API ativa!
```

Teste o health check:
```bash
curl https://lia-chat-api.onrender.com/health
```

Teste o chat:
```bash
curl -X POST https://lia-chat-api.onrender.com/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Olá, LIA!"}'
```

## ⚙️ Configurações do Render

### Auto-Deploy
O Render faz deploy automático quando você faz push para a branch configurada.

### Sleep Mode (Free Tier)
No plano gratuito, o serviço "dorme" após 15 minutos de inatividade:
- A primeira requisição pode demorar ~30 segundos
- Para evitar, considere fazer upgrade para plano pago

### Logs
Acesse os logs em tempo real no painel do Render:
1. Clique no seu serviço
2. Vá em **"Logs"**

### Monitoramento
- **Health Check URL:** `/health`
- Configure alertas no painel do Render

## 🔒 Segurança

### Variáveis de Ambiente
- ✅ **NUNCA** commite a `OPENAI_API_KEY` no código
- ✅ Use variáveis de ambiente no Render
- ✅ Mantenha as chaves seguras e rotacione periodicamente

### CORS
A API permite requisições de qualquer origem (`cors()` sem restrições).
Para produção, considere restringir:

```javascript
app.use(cors({
  origin: 'https://seu-frontend.com'
}));
```

### Rate Limiting
Para produção, adicione rate limiting:

```bash
npm install express-rate-limit
```

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo de 100 requisições por IP
});

app.use('/chat', limiter);
```

## 📊 Custos OpenAI

O modelo `gpt-3.5-turbo` tem os seguintes custos (aproximados):
- **Input:** $0.50 / 1M tokens
- **Output:** $1.50 / 1M tokens

Monitore seu uso em: https://platform.openai.com/usage

## 🛠️ Troubleshooting

### Erro 401 "Incorrect API key"
- Verifique se a `OPENAI_API_KEY` está configurada corretamente no Render
- Confirme que a chave está ativa em https://platform.openai.com/api-keys

### Erro "Cannot find module"
- Certifique-se de que o `package.json` está correto
- Verifique se o Build Command está como `npm install`

### Timeout / 504 Gateway Timeout
- A OpenAI pode demorar para responder mensagens longas
- Considere aumentar o timeout ou adicionar streaming

### API não responde
- Verifique os logs no painel do Render
- Confirme que o serviço está "Running" (não "Sleeping" ou "Failed")
- Teste o endpoint `/health` primeiro

## 📚 Documentação OpenAI

- [API Reference](https://platform.openai.com/docs/api-reference)
- [Chat Completions](https://platform.openai.com/docs/guides/chat)
- [Rate Limits](https://platform.openai.com/docs/guides/rate-limits)

## 🔄 Atualizações Futuras

Possíveis melhorias:
- [ ] Adicionar streaming de respostas
- [ ] Implementar cache de respostas
- [ ] Adicionar suporte a imagens (GPT-4 Vision)
- [ ] Implementar histórico de conversas
- [ ] Adicionar analytics e métricas
- [ ] Suporte a múltiplos modelos (GPT-4, Claude, etc.)

## 📝 Licença

Este projeto faz parte do sistema proprietário Luminnus.
Todos os direitos reservados © 2025 Luminnus.
