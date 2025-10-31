import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { message, conversationId } = await req.json();

    // Buscar dados do usuário
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Buscar histórico da conversa
    const { data: messages } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    // Preparar contexto para a IA
    const context = {
      userName: profile?.full_name || 'Cliente',
      userPlan: profile?.plan_type || 'free',
      conversationHistory: messages || []
    };

    console.log('Context:', context);
    console.log('User message:', message);

    // Respostas baseadas em palavras-chave
    const lowerMessage = message.toLowerCase();
    
    let response = '';
    let suggestions: string[] = [];

    if (lowerMessage.includes('plano') || lowerMessage.includes('preço') || lowerMessage.includes('valor')) {
      response = `Olá ${context.userName}! Temos 3 planos disponíveis:\n\n🌟 **Start** (€27/mês)\nIdeal para pequenos negócios\n• 1 canal de atendimento\n• Respostas automáticas básicas\n• Integração com 1 ferramenta\n\n💎 **Plus** (€147/mês) - Mais Popular!\nPara empresas em crescimento\n• Múltiplos canais (WhatsApp, Chat, E-mail)\n• IA avançada com aprendizado\n• Integrações ilimitadas\n• Agendamentos automáticos\n\n🚀 **Pro** (€997+/mês)\nSolução enterprise personalizada\n• Tudo ilimitado\n• IA customizada\n• API dedicada\n• Suporte 24/7\n\nSeu plano atual: **${context.userPlan.toUpperCase()}**\n\nQuer saber mais sobre algum plano específico?`;
      suggestions = ['Detalhes do Start', 'Detalhes do Plus', 'Detalhes do Pro', 'Como fazer upgrade'];
    } else if (lowerMessage.includes('integr') || lowerMessage.includes('funciona')) {
      response = `A Lia funciona de forma muito simples!\n\n✅ **Integração Fácil**\n• Conectamos com WhatsApp, Chat, E-mail e mais\n• Sem código necessário\n• Configuração rápida\n\n🤖 **IA Inteligente**\n• Aprende com cada conversa\n• Respostas personalizadas\n• Atendimento 24/7\n\n🔗 **Conecta com suas ferramentas**\n• CRM\n• Agendas\n• E-commerce\n• E muito mais!\n\nQuer saber como integrar com alguma ferramenta específica?`;
      suggestions = ['Integrar WhatsApp', 'Integrar CRM', 'Ver mais integrações'];
    } else if (lowerMessage.includes('upgrade') || lowerMessage.includes('mudar') || lowerMessage.includes('trocar')) {
      response = `Que ótimo que você quer evoluir! 🚀\n\nSeu plano atual é **${context.userPlan.toUpperCase()}**.\n\nPara fazer upgrade:\n1. Acesse a página de Planos\n2. Escolha o plano desejado\n3. Clique em "Assinar"\n4. Pronto! A mudança é imediata\n\n💡 **Vantagens do upgrade:**\n• Mais canais de atendimento\n• IA mais inteligente\n• Mais integrações\n• Suporte prioritário\n\nQual plano te interessa?`;
      suggestions = ['Ver planos', 'Falar com vendas'];
    } else if (lowerMessage.includes('lia') || lowerMessage.includes('você') || lowerMessage.includes('fazer')) {
      response = `Eu sou a Lia, sua assistente virtual! 😊\n\nPosso te ajudar com:\n\n📋 **Informações**\n• Detalhes sobre planos\n• Funcionalidades\n• Integrações disponíveis\n\n💬 **Atendimento**\n• Responder suas dúvidas\n• Orientar sobre upgrades\n• Explicar como funciona\n\n🎯 **Ações Rápidas**\n• Te direcionar para áreas específicas\n• Conectar com time de vendas\n• Agendar demonstrações\n\nComo posso te ajudar hoje?`;
      suggestions = ['Ver planos', 'Como funciona', 'Falar com vendas'];
    } else if (lowerMessage.includes('obrigad') || lowerMessage.includes('valeu')) {
      response = `Por nada! 😊 Fico feliz em ajudar!\n\nSe precisar de mais alguma coisa, é só chamar. Estou sempre aqui para você!\n\nQuer saber mais alguma coisa?`;
      suggestions = ['Ver planos', 'Falar com vendas', 'Não, obrigado'];
    } else {
      response = `Olá ${context.userName}! 👋\n\nEstou aqui para te ajudar! Posso responder sobre:\n\n• 💰 Planos e preços\n• 🔧 Como funciona a integração\n• 🤖 O que a Lia pode fazer\n• 📈 Como fazer upgrade\n• 📞 Falar com nossa equipe\n\nSobre o que você gostaria de saber?`;
      suggestions = ['Ver planos', 'Como funciona', 'Integração', 'Falar com vendas'];
    }

    return new Response(JSON.stringify({
      response,
      suggestions
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Erro desconhecido' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
