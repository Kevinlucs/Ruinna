const MODELS = [
  'gemini-1.5-flash',
  'gemini-1.5-pro'
];

async function fetchWithRetry(url, options, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url, options);

      if (response.ok) {
        return response;
      }

      if (
        response.status === 429 ||
        response.status === 500 ||
        response.status === 503
      ) {
        const waitTime = 2000 * (attempt + 1);
        console.warn(`Retry em ${waitTime}ms`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      const errorText = await response.text();
      throw new Error(errorText);
    } catch (error) {
      if (attempt === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }
}

async function tryModels(prompt, apiKey) {
  let lastError = null;

  for (const model of MODELS) {
    try {
      console.log(`Tentando: ${model}`);
      const response = await fetchWithRetry(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.4,
              topP: 0.95,
              topK: 40,
              maxOutputTokens: 8192
              // Removido responseMimeType para compatibilidade com modelos mais antigos se necessário,
              // o parsePlanResponse no frontend já trata as cercas do markdown.
            }
          })
        },
        2
      );

      const data = await response.json();
      if (!data.candidates?.length) {
        throw new Error('Gemini retornou vazio');
      }

      return {
        model,
        text: data.candidates[0].content.parts[0].text
      };
    } catch (error) {
      console.error(`Erro no ${model}:`, error.message);
      lastError = error;
    }
  }
  throw lastError;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt obrigatório' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY não configurada' });
    }

    const result = await tryModels(prompt, apiKey);

    return res.status(200).json({
      success: true,
      model: result.model,
      text: result.text
    });

  } catch (error) {
    console.error('SERVER ERROR DETAIL:', error);
    return res.status(500).json({
      error: 'Erro ao gerar resposta com Gemini',
      details: error.message,
      stack: error.stack // Ajuda a ver onde quebrou exatamente
    });
  }
}