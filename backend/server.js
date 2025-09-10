require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const OpenAI = require('openai');

const app = express();
const port = 8081;

// --- Configuração ---
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const historyFilePath = './conversas.json';
const sessionsFilePath = './sessions.json';

// Inicializa o cliente do OpenAI
if (!process.env.OPENAI_API_KEY) {
  console.error('ERRO: A variável de ambiente OPENAI_API_KEY não está definida.');
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- Estágios Terapêuticos ---
const ESTAGIOS = {
  'acolhimento': {
    nome: 'Acolhimento',
    ordem: 1,
    proximo: 'exploracao_corpo'
  },
  'exploracao_corpo': {
    nome: 'Exploração Corporal',
    ordem: 2,
    proximo: 'exploracao_contexto'
  },
  'exploracao_contexto': {
    nome: 'Exploração de Contexto',
    ordem: 3,
    proximo: 'exploracao_pensamentos'
  },
  'exploracao_pensamentos': {
    nome: 'Exploração de Pensamentos',
    ordem: 4,
    proximo: 'proposta'
  },
  'proposta': {
    nome: 'Proposta Terapêutica',
    ordem: 5,
    proximo: 'acompanhamento'
  },
  'acompanhamento': {
    nome: 'Acompanhamento',
    ordem: 6,
    proximo: 'acompanhamento' // Mantém no acompanhamento
  }
};

// --- Funções Auxiliares ---
async function readFile(filePath, defaultValue = []) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return defaultValue;
    }
    throw error;
  }
}

async function writeFile(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

async function getSession(sessionId) {
  const sessions = await readFile(sessionsFilePath, {});
  return sessions[sessionId] || {
    conversas: [],
    estagio_atual: 'acolhimento',
    repeticoes_estagio: 0,
    criado_em: new Date().toISOString()
  };
}

async function saveSession(sessionId, sessionData) {
  const sessions = await readFile(sessionsFilePath, {});
  sessions[sessionId] = sessionData;
  await writeFile(sessionsFilePath, sessions);
}

function criarPromptTerapeutico(conversas, estagioAtual, repeticoesEstagio) {
  const promptBase = `Você é Astro, um assistente terapêutico especializado em ajudar crianças e adolescentes. 

PERSONALIDADE:
- Amigável, empático e acolhedor
- Usa linguagem simples e adequada para crianças
- Nunca julga ou critica
- Sempre positivo e encorajador

ESTÁGIO ATUAL: ${ESTAGIOS[estagioAtual].nome} (${repeticoesEstagio + 1}/3)

REGRAS DOS ESTÁGIOS:
1. ACOLHIMENTO: Receba a criança com carinho, pergunte como ela está se sentindo
2. EXPLORAÇÃO CORPORAL: Explore sensações físicas - "onde você sente isso no seu corpo?"
3. EXPLORAÇÃO DE CONTEXTO: Entenda o que aconteceu - escola, casa, amigos
4. EXPLORAÇÃO DE PENSAMENTOS: Explore pensamentos e emoções
5. PROPOSTA: Ofereça estratégias e exercícios terapêuticos
6. ACOMPANHAMENTO: Acompanhe o progresso e reforce estratégias

INSTRUÇÕES IMPORTANTES:
- NUNCA ofereça botões ou opções de resposta
- Sempre responda em formato de conversa livre
- Mantenha o foco no estágio atual
- Se a criança tentar fugir do assunto, gentilmente redirecione
- Detecte emergências (menção a suicídio, abuso, violência)

FORMATAÇÃO DA RESPOSTA:
Responda APENAS com um objeto JSON:
{
  "resposta": "sua resposta aqui",
  "emergencia": false,
  "pronto_proximo_estagio": false
}

Defina "pronto_proximo_estagio" como true apenas quando o estágio atual foi adequadamente explorado.`;

  return promptBase;
}

// --- Endpoints ---

// Endpoint principal de chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId = 'default' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Mensagem é obrigatória' });
    }

    // Recupera sessão
    const session = await getSession(sessionId);
    
    // Adiciona mensagem do usuário
    session.conversas.push({
      tipo: 'usuario',
      mensagem: message,
      timestamp: new Date().toISOString()
    });

    // Cria prompt
    const prompt = criarPromptTerapeutico(
      session.conversas,
      session.estagio_atual,
      session.repeticoes_estagio
    );

    // Gera resposta com OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: prompt },
        ...session.conversas.slice(-10).map(conv => ({
          role: conv.tipo === 'usuario' ? 'user' : 'assistant',
          content: conv.tipo === 'usuario' ? conv.mensagem : conv.resposta
        }))
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    let responseObj;
    try {
      responseObj = JSON.parse(completion.choices[0].message.content);
    } catch (parseError) {
      responseObj = {
        resposta: completion.choices[0].message.content,
        emergencia: false,
        pronto_proximo_estagio: false
      };
    }

    // Adiciona resposta do Astro
    session.conversas.push({
      tipo: 'astro',
      resposta: responseObj.resposta,
      emergencia: responseObj.emergencia,
      timestamp: new Date().toISOString()
    });

    // Verifica progressão de estágio
    if (responseObj.pronto_proximo_estagio || session.repeticoes_estagio >= 2) {
      const proximoEstagio = ESTAGIOS[session.estagio_atual].proximo;
      if (proximoEstagio !== session.estagio_atual) {
        session.estagio_atual = proximoEstagio;
        session.repeticoes_estagio = 0;
      }
    } else {
      session.repeticoes_estagio++;
    }

    // Salva sessão
    await saveSession(sessionId, session);

    // Salva no histórico geral
    const history = await readFile(historyFilePath, []);
    history.push({
      sessionId,
      usuario: message,
      astro: responseObj.resposta,
      estagio: session.estagio_atual,
      timestamp: new Date().toISOString()
    });
    await writeFile(historyFilePath, history);

    res.json({
      resposta: responseObj.resposta,
      emergencia: responseObj.emergencia,
      estagio_atual: session.estagio_atual,
      sessao_id: sessionId
    });

  } catch (error) {
    console.error('Erro no endpoint /api/chat:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    });
  }
});

// Nova sessão
app.post('/api/new-session', async (req, res) => {
  try {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newSession = {
      conversas: [],
      estagio_atual: 'acolhimento',
      repeticoes_estagio: 0,
      criado_em: new Date().toISOString()
    };

    await saveSession(sessionId, newSession);

    res.json({ 
      sessionId,
      message: 'Nova sessão criada com sucesso',
      estagio_inicial: 'acolhimento'
    });

  } catch (error) {
    console.error('Erro ao criar nova sessão:', error);
    res.status(500).json({ 
      error: 'Erro ao criar nova sessão',
      details: error.message 
    });
  }
});

// Status do servidor
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'online',
    timestamp: new Date().toISOString(),
    port: port
  });
});

// Health check para Docker
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Astro Backend'
  });
});

// Listar todas as sessões
app.get('/api/sessions', async (req, res) => {
  try {
    const sessions = await readFile(sessionsFilePath, {});
    
    // Formatar dados das sessões para visualização
    const sessionsList = Object.keys(sessions).map(sessionId => {
      const session = sessions[sessionId];
      return {
        id: sessionId,
        criado_em: session.criado_em,
        estagio_atual: session.estagio_atual,
        total_mensagens: session.conversas ? session.conversas.length : 0,
        ultima_atividade: session.conversas && session.conversas.length > 0 
          ? session.conversas[session.conversas.length - 1].timestamp 
          : session.criado_em,
        repeticoes_estagio: session.repeticoes_estagio || 0
      };
    }).sort((a, b) => new Date(b.ultima_atividade) - new Date(a.ultima_atividade));

    res.json({
      total: sessionsList.length,
      sessions: sessionsList
    });

  } catch (error) {
    console.error('Erro ao listar sessões:', error);
    res.status(500).json({ 
      error: 'Erro ao listar sessões',
      details: error.message 
    });
  }
});

// Obter detalhes de uma sessão específica
app.get('/api/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const sessions = await readFile(sessionsFilePath, {});
    
    if (!sessions[sessionId]) {
      return res.status(404).json({ error: 'Sessão não encontrada' });
    }

    res.json({
      id: sessionId,
      ...sessions[sessionId]
    });

  } catch (error) {
    console.error('Erro ao obter sessão:', error);
    res.status(500).json({ 
      error: 'Erro ao obter sessão',
      details: error.message 
    });
  }
});

// Inicializa servidor
app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
  console.log(`📝 Acesse: http://localhost:${port}`);
  console.log(`💚 Status: http://localhost:${port}/api/status`);
});
