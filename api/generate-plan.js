const MODELS = [
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash',
  'gemini-1.5-flash-8b',
  'gemini-1.5-flash'
];

async function fetchWithRetry(url, options, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url, options);

      // Sucesso
      if (response.ok) {
        return response;
      }

      // Erros temporários da API
      if (
        response.status === 429 ||
        response.status === 500 ||
        response.status === 503
      ) {
        const waitTime = 2000 * (attempt + 1);
        console.warn(`Gemini sobrecarregado. Tentando novamente em ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      // Outros erros
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(JSON.stringify(errorData));
    } catch (error) {
      if (attempt === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1500 * (attempt + 1)));
    }
  }
  throw new Error('Todos os retries falharam');
}

async function tryModels(prompt, apiKey) {
  let lastError = null;

  for (const model of MODELS) {
    try {
      console.log(`Tentando modelo: ${model}`);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetchWithRetry(
        url,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.4,
              topP: 0.95,
              topK: 40,
              maxOutputTokens: 8192, // Aumentado para suportar planilhas longas
              responseMimeType: 'application/json'
            }
          })
        },
        2 // Menos retries por modelo para ser mais rápido no fallback
      );

      const data = await response.json();
      return { model, data };
    } catch (error) {
      console.error(`Erro no modelo ${model}:`, error.message);
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
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API Key not configured on server' });
    }

    if (prompt.length > 30000) {
      return res.status(400).json({ error: 'Prompt too large' });
    }

    // Chama Gemini com fallback automático
    const result = await tryModels(prompt, apiKey);

    // Retornamos apenas result.data para manter compatibilidade com o frontend atual
    return res.status(200).json(result.data);

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({
      error: 'Erro ao gerar resposta com Gemini',
      details: error.message
    });
  }
}