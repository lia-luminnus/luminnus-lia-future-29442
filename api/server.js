import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import cron from "node-cron";
import {
  runMetricsCollection,
  trackOpenAIUsage,
  trackCartesiaUsage,
  trackRenderRequest,
  trackSupabaseOperation,
  getProviderMetrics,
  getProviderStatus,
  getMonthlyProjection,
  getTodaySummary,
  fetchProviderStatus,
} from "./lib/metricsCollector.js";
import supabase from "./lib/supabaseClient.js";

const app = express();

// CORS configurado para aceitar todas as origens (desenvolvimento)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

app.use(express.json());

// =====================================================
// MIDDLEWARE: Log de requisições e tracking do Render
// =====================================================
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);

  // Tracking de requisições do Render
  if (req.path !== "/health" && req.path !== "/") {
    trackRenderRequest();
  }

  next();
});

// =====================================================
// MIDDLEWARE: Autenticação Admin (para rotas sensíveis)
// =====================================================
async function requireAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token não fornecido" });
    }

    const token = authHeader.split(" ")[1];

    // Verificar token com Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Token inválido" });
    }

    // Verificar se é admin
    if (user.email !== "luminnus.lia.ai@gmail.com") {
      return res.status(403).json({ error: "Acesso negado. Apenas admin." });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("[Auth] Erro:", err);
    res.status(500).json({ error: "Erro de autenticação" });
  }
}

// =====================================================
// ROTAS BÁSICAS
// =====================================================

app.get("/", (req, res) => res.send("LIA Chat API ativa!"));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API está online",
    timestamp: new Date().toISOString()
  });
});

// =====================================================
// ROTAS DE CHAT (OpenAI)
// =====================================================

app.post("/chat", async (req, res) => {
  try {
    console.log("[API] Nova requisição /chat recebida");

    const { message } = req.body;
    if (!message) {
      console.error("[API] Mensagem não fornecida");
      return res.status(400).json({ error: "Mensagem não fornecida." });
    }

    console.log("[API] Enviando para OpenAI:", message);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Você é a LIA, uma assistente virtual inteligente e prestativa da plataforma Luminnus." },
          { role: "user", content: message },
        ],
      }),
    });

    if (!response.ok) {
      console.error("[API] Erro OpenAI:", response.status, response.statusText);
      return res.status(response.status).json({
        error: `Erro da OpenAI: ${response.statusText}`
      });
    }

    const data = await response.json();
    console.log("[API] Resposta da OpenAI recebida");

    // Track de tokens
    if (data.usage) {
      trackOpenAIUsage(
        data.usage.prompt_tokens || 0,
        data.usage.completion_tokens || 0
      );
    }

    const reply = data.choices?.[0]?.message?.content || "Desculpe, não consegui gerar uma resposta.";

    console.log("[API] Enviando resposta ao cliente");
    res.json({ reply });
  } catch (error) {
    console.error("[API] Erro:", error);
    res.status(500).json({
      error: "Erro interno no servidor.",
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// =====================================================
// ROTAS DE VOZ (OpenAI Realtime)
// =====================================================

app.post("/session", async (req, res) => {
  try {
    console.log("[Realtime] Solicitando ephemeral token...");

    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17",
        voice: "alloy",
        instructions: "Você é a LIA, uma assistente virtual inteligente e prestativa da plataforma Luminnus. Responda de forma clara, simpática e objetiva.",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Realtime] Erro ao obter token:", response.status, errorText);
      return res.status(response.status).json({
        error: "Erro ao criar sessão de voz",
        details: errorText
      });
    }

    const data = await response.json();
    console.log("[Realtime] Token efêmero criado com sucesso");

    res.json({
      client_secret: data.client_secret.value,
      expires_at: data.expires_at
    });
  } catch (error) {
    console.error("[Realtime] Erro:", error);
    res.status(500).json({
      error: "Erro ao criar sessão",
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

app.post("/proxy-realtime", async (req, res) => {
  try {
    console.log("[Proxy Realtime] Recebendo requisição SDP...");

    const { sdp, client_secret } = req.body;

    if (!sdp || !client_secret) {
      console.error("[Proxy Realtime] SDP ou client_secret ausente");
      return res.status(400).json({
        error: "SDP e client_secret são obrigatórios"
      });
    }

    console.log("[Proxy Realtime] Enviando SDP para OpenAI...");

    const response = await fetch(
      "https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${client_secret}`,
          "Content-Type": "application/sdp",
        },
        body: sdp,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Proxy Realtime] Erro da OpenAI:", response.status, errorText);
      return res.status(response.status).json({
        error: "Erro ao conectar WebRTC com OpenAI",
        details: errorText
      });
    }

    const answerSdp = await response.text();
    console.log("[Proxy Realtime] SDP answer recebido com sucesso");

    res.setHeader('Content-Type', 'application/sdp');
    res.send(answerSdp);
  } catch (error) {
    console.error("[Proxy Realtime] Erro:", error);
    res.status(500).json({
      error: "Erro interno ao processar WebRTC",
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// =====================================================
// ROTAS DE TTS (Cartesia)
// =====================================================

app.post("/tts", async (req, res) => {
  try {
    const { text, voice_id } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Texto não fornecido" });
    }

    const cartesiaApiKey = process.env.CARTESIA_API_KEY;
    if (!cartesiaApiKey) {
      return res.status(500).json({ error: "Cartesia API key não configurada" });
    }

    const response = await fetch("https://api.cartesia.ai/tts/bytes", {
      method: "POST",
      headers: {
        "X-API-Key": cartesiaApiKey,
        "Cartesia-Version": "2024-06-10",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model_id: "sonic-3",
        transcript: text,
        voice: {
          mode: "id",
          id: voice_id || process.env.CARTESIA_VOICE_ID || "a0e99841-438c-4a64-b679-ae501e7d6091",
        },
        output_format: {
          container: "mp3",
          bit_rate: 128000,
          sample_rate: 44100,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[TTS] Erro Cartesia:", response.status, errorText);
      return res.status(response.status).json({
        error: "Erro ao gerar áudio",
        details: errorText
      });
    }

    // Track caracteres enviados
    trackCartesiaUsage(text.length);

    const audioBuffer = await response.buffer();

    res.setHeader("Content-Type", "audio/mpeg");
    res.send(audioBuffer);
  } catch (error) {
    console.error("[TTS] Erro:", error);
    res.status(500).json({
      error: "Erro ao processar TTS",
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// =====================================================
// ROTAS DE MÉTRICAS (requerem autenticação admin)
// =====================================================

// GET /api/metrics/providers - Retorna consumo total
app.get("/api/metrics/providers", requireAdmin, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const metrics = await getProviderMetrics(null, days);

    // Agregar por provedor
    const aggregated = {};
    for (const row of metrics) {
      if (!aggregated[row.provider]) {
        aggregated[row.provider] = {
          provider: row.provider,
          tokens_input: 0,
          tokens_output: 0,
          audio_minutes: 0,
          requests: 0,
          storage_mb: 0,
          writes: 0,
          reads: 0,
          cost: 0,
        };
      }
      aggregated[row.provider].tokens_input += parseFloat(row.tokens_input) || 0;
      aggregated[row.provider].tokens_output += parseFloat(row.tokens_output) || 0;
      aggregated[row.provider].audio_minutes += parseFloat(row.audio_minutes) || 0;
      aggregated[row.provider].requests += parseFloat(row.requests) || 0;
      aggregated[row.provider].storage_mb = parseFloat(row.storage_mb) || 0; // Último valor
      aggregated[row.provider].writes += parseFloat(row.writes) || 0;
      aggregated[row.provider].reads += parseFloat(row.reads) || 0;
      aggregated[row.provider].cost += parseFloat(row.cost) || 0;
    }

    res.json({
      success: true,
      data: Object.values(aggregated),
      period: `${days} days`,
    });
  } catch (error) {
    console.error("[API] Erro /api/metrics/providers:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/metrics/provider/:id - Retorna dados completos de um provedor
app.get("/api/metrics/provider/:id", requireAdmin, async (req, res) => {
  try {
    const provider = req.params.id;
    const days = parseInt(req.query.days) || 30;

    if (!["openai", "cartesia", "render", "cloudflare", "supabase"].includes(provider)) {
      return res.status(400).json({ success: false, error: "Provedor inválido" });
    }

    const metrics = await getProviderMetrics(provider, days);

    res.json({
      success: true,
      provider,
      data: metrics,
      period: `${days} days`,
    });
  } catch (error) {
    console.error(`[API] Erro /api/metrics/provider/${req.params.id}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/metrics/monthly - Projeção mensal
app.get("/api/metrics/monthly", requireAdmin, async (req, res) => {
  try {
    const projection = await getMonthlyProjection();

    res.json({
      success: true,
      data: projection,
    });
  } catch (error) {
    console.error("[API] Erro /api/metrics/monthly:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/metrics/status - Status e latência dos provedores
app.get("/api/metrics/status", requireAdmin, async (req, res) => {
  try {
    const status = await getProviderStatus();

    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    console.error("[API] Erro /api/metrics/status:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/metrics/today - Resumo do dia
app.get("/api/metrics/today", requireAdmin, async (req, res) => {
  try {
    const summary = await getTodaySummary();

    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error("[API] Erro /api/metrics/today:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/metrics/refresh - Atualização manual
app.post("/api/metrics/refresh", requireAdmin, async (req, res) => {
  try {
    console.log("[API] Atualização manual de métricas solicitada");
    const result = await runMetricsCollection();

    res.json({
      success: result.success,
      message: result.success ? "Métricas atualizadas com sucesso" : "Erro ao atualizar métricas",
      data: result,
    });
  } catch (error) {
    console.error("[API] Erro /api/metrics/refresh:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/metrics/history - Histórico para gráficos
app.get("/api/metrics/history", requireAdmin, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const provider = req.query.provider;

    const metrics = await getProviderMetrics(provider, days);

    // Agrupar por data
    const byDate = {};
    for (const row of metrics) {
      if (!byDate[row.date]) {
        byDate[row.date] = {
          date: row.date,
          openai: { tokens: 0, cost: 0 },
          cartesia: { minutes: 0, cost: 0 },
          render: { requests: 0, cost: 0 },
          cloudflare: { requests: 0, cost: 0 },
          supabase: { storage_mb: 0, reads: 0, writes: 0, cost: 0 },
          total_cost: 0,
        };
      }

      const d = byDate[row.date];
      const cost = parseFloat(row.cost) || 0;

      switch (row.provider) {
        case "openai":
          d.openai.tokens = (parseFloat(row.tokens_input) || 0) + (parseFloat(row.tokens_output) || 0);
          d.openai.cost = cost;
          break;
        case "cartesia":
          d.cartesia.minutes = parseFloat(row.audio_minutes) || 0;
          d.cartesia.cost = cost;
          break;
        case "render":
          d.render.requests = parseFloat(row.requests) || 0;
          d.render.cost = cost;
          break;
        case "cloudflare":
          d.cloudflare.requests = parseFloat(row.requests) || 0;
          d.cloudflare.cost = cost;
          break;
        case "supabase":
          d.supabase.storage_mb = parseFloat(row.storage_mb) || 0;
          d.supabase.reads = parseFloat(row.reads) || 0;
          d.supabase.writes = parseFloat(row.writes) || 0;
          d.supabase.cost = cost;
          break;
      }

      d.total_cost += cost;
    }

    // Ordenar por data
    const history = Object.values(byDate).sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    res.json({
      success: true,
      data: history,
      period: `${days} days`,
    });
  } catch (error) {
    console.error("[API] Erro /api/metrics/history:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// =====================================================
// ROTAS DE CONFIGURAÇÃO DE PROVEDORES
// =====================================================

// GET /api/providers/config - Buscar configurações
app.get("/api/providers/config", requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("provider_config")
      .select("*");

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error("[API] Erro /api/providers/config:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/providers/config/:provider - Atualizar configuração
app.put("/api/providers/config/:provider", requireAdmin, async (req, res) => {
  try {
    const { provider } = req.params;
    const { config } = req.body;

    if (!["openai", "cartesia", "render", "cloudflare", "supabase"].includes(provider)) {
      return res.status(400).json({ success: false, error: "Provedor inválido" });
    }

    const { error } = await supabase
      .from("provider_config")
      .upsert({
        provider,
        config,
        updated_at: new Date().toISOString(),
      }, { onConflict: "provider" });

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({ success: true, message: "Configuração atualizada" });
  } catch (error) {
    console.error(`[API] Erro /api/providers/config/${req.params.provider}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// =====================================================
// CRON JOB: Coleta de métricas a cada 5 minutos
// =====================================================

// Executar a cada 5 minutos
cron.schedule("*/5 * * * *", async () => {
  console.log("[Cron] Executando coleta de métricas programada...");
  await runMetricsCollection();
});

// Verificar status a cada 1 minuto
cron.schedule("*/1 * * * *", async () => {
  console.log("[Cron] Verificando status dos provedores...");
  await fetchProviderStatus();
});

// =====================================================
// INICIALIZAÇÃO DO SERVIDOR
// =====================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`\n🚀 Servidor LIA ativo na porta ${PORT}`);
  console.log(`📊 Cron de métricas: a cada 5 minutos`);
  console.log(`🔍 Cron de status: a cada 1 minuto`);
  console.log(`📅 Iniciado em: ${new Date().toISOString()}\n`);

  // Executar coleta inicial de status
  console.log("[Init] Executando verificação inicial de status...");
  await fetchProviderStatus();
  console.log("[Init] Verificação inicial concluída\n");
});
