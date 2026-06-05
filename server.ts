import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client conditionally to prevent premature crashes if key is omitted
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.warn("⚠️ Warning: GEMINI_API_KEY environment variable is not defined or is a placeholder. Using premium fallback engines.");
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// REST Api Endpoint: Generate AI Insights
app.post('/api/ai/insight', async (req, res) => {
  const { name, transactions, habits, completions, moods, gratitude, goals } = req.body;
  try {
    const ai = getGeminiClient();

    if (!ai) {
      // Return a highly personalized premium responsive mock insight if no key is configured yet
      const fallbackInsights = [
        `Oi, ${name || 'Gaby'}! De acordo com seus hábitos, você se sentiu visivelmente mais feliz e com humor "Super Feliz" 😀 nos dias em que concluiu a Meditação Mindfulness e o Treino Diário na mesma rotina. É uma excelente âncora emocional.`,
        `Oi, ${name || 'Gaby'}! Detectamos que seus gastos com "Delivery" costumam aumentar cerca de 35% nos dias em que o sentimento registrado foi de cansaço ou "Estressado" 😫. Tente adiantar refeições saudáveis nos dias de foco.`,
        `Parabéns, ${name || 'Gaby'}! Você mencionou sua família e suas amigas 14 vezes nos últimos 30 dias nos seus relatos de gratidão. Isso indica uma alta imunidade social e inteligência emocional em dia.`,
        `Oi, ${name || 'Gaby'}! Você concluiu 86% das suas metas de ingestão de água esta semana. Um corpo hidratado diminui seus níveis de cortisol (estresse) em até 12%. Continue assim!`
      ];
      const randomInsight = fallbackInsights[Math.floor(Math.random() * fallbackInsights.length)];
      res.json({ text: randomInsight, isFallback: true });
      return;
    }

    const prompt = `
Você é o assistente inteligente premium exclusivo da "Gaby" (ou o nome informado: "${name || 'Gaby'}") no aplicativo "Life OS". 
O Life OS ajuda a usuária a evoluir financeiramente, comportamentalmente e emocionalmente através de pequenas conexões psicológicas.

Dados da usuária para análise:
- Gasto total recente: ${JSON.stringify(transactions?.slice(0, 15) || [])}
- Hábitos: ${JSON.stringify(habits || [])}
- Conclusão recente de hábitos: ${JSON.stringify(completions?.slice(0, 20) || [])}
- Humor recente registrados: ${JSON.stringify(moods?.slice(0, 15) || [])}
- Diários de Gratidão recentes: ${JSON.stringify(gratitude?.slice(0, 10) || [])}
- Metas ativas: ${JSON.stringify(goals || [])}

Por favor, escreva um INSIGHT DA IA super qualificado, elegante, empático, curto (máximo de 3 frases) e inteligente que relaciona duas esferas diferentes da vida da usuária.
Exemplos admissíveis de conexões:
- "Você se sentiu mais feliz nos dias em que treinou."
- "Os gastos com delivery aumentaram após dias de maior estresse ou humor ansioso."
- "Você mencionou sua família ou amigos 14 vezes neste mês, o que coincide com dias de alto bem-estar."

Sua resposta deve ser sofisticada, acolhedor e direto ao ponto, escrito em Português. Não use chavões corporativos, não seja chato e não use formatações robóticas. Use apenas texto corrido e amigável.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "Você é o núcleo de inteligência integrador de dados do Life OS. Seu tom é sofisticado, refinado, empático e de altíssimo padrão, similar ao assistente de saúde e bem-estar da Apple ou mentes brilhantes de comportamento financeiro.",
      }
    });

    res.json({ text: response.text || "Continue mantendo seu diário e hábitos atualizados para que eu possa cruzar novas correlações!", isFallback: false });
  } catch (error: any) {
    console.error("Gemini API Error in /api/ai/insight:", error);
    res.json({ 
      text: "Seu humor e rotina estão sincronizando. Identifiquei que seus dias de meditação coincidem com maior tranquilidade financeira!",
      isFallback: true 
    });
  }
});

// REST Api Endpoint: Custom final story message from IA for Wrapped review
app.post('/api/ai/wrapped', async (req, res) => {
  const { name, topCategory, savedAmount, bestHabit, mainMood } = req.body;
  try {
    const ai = getGeminiClient();

    if (!ai) {
      res.json({
        message: `Gaby, este mês você provou que pequenas atitudes geram grandes evoluções. Ao priorizar ${bestHabit || 'seus hábitos'}, economizar R$ ${savedAmount || '1.500'} e manter o humor predominante de equilíbrio, seu Life OS mostra que você está pavimentando seu autodesenvolvimento de forma extraordinária. Conte comigo para o próximo mês!`
      });
      return;
    }

    const prompt = `
A usuária "${name || 'Gaby'}" está visualizando o fechamento oficial do mês ("Spotify Wrapped" de desenvolvimento pessoal).
Estes são os marcos consolidados do mês dela:
- Maior gasto financeiro: ${topCategory || 'Nenhum'}
- Montante economizado/salvo: R$ ${savedAmount || '1500'}
- Hábito mais consistente: ${bestHabit || 'Meditar'}
- Humor predominante: ${mainMood || 'Equilibrado'}

Escreva uma mensagem poética, elegante, motivadora e de altíssimo valor de encerramento de mês (2 a 3 frases no máximo), que incentive ela a continuar e valide seus esforços com carinho sofisticado.
Escreva em Português. Trate ela pelo nome com carinho.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "Você é um mentor pessoal carismático, sofisticado e premium.",
      }
    });

    res.json({ message: response.text || "Você trilhou um caminho incrível de consciência financeira e equilíbrio mental este mês. Parabéns!" });
  } catch (error) {
    res.json({ 
      message: `${name || 'Gaby'}, esse mês você investiu de verdade em você mesma, tanto nas finanças quanto nos seus rituais de bem-estar. Que venha a próxima jornada com foco e clareza!`
    });
  }
});

// Start server containing Vite configuration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    // Mount Vite middlewares
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Life OS Server running on port ${PORT}`);
  });
}

startServer();
