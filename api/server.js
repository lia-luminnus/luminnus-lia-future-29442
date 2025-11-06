import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

// CORS configurado para aceitar todas as origens (desenvolvimento)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

app.use(express.json());

// Log de todas as requisições
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.get("/", (req, res) => res.send("LIA Chat API ativa!"));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "API está online" });
});

// Endpoint para obter token efêmero para WebRTC
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

    // Retornar apenas o client_secret
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

// Endpoint proxy para WebRTC Realtime (SDP offer/answer)
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

    // Retornar o SDP answer como texto
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

app.post("/chat", async (req, res) => {
  try {
    console.log("[API] Nova requisição /chat recebida");
    console.log("[API] Body:", req.body);

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
        model: "gpt-3.5-turbo",
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor LIA ativo na porta ${PORT}`));
