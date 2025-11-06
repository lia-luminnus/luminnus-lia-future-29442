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
