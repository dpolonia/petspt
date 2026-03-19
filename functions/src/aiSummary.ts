import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import fetch from 'node-fetch';

const db = admin.firestore();
const SUMMARY_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const EIXO_CONTEXT: Record<number, string> = {
  1: `Eixo 1 — Resposta a Tempo e Horas.
10 medidas (2 urgentes, 3 prioritárias, 5 estruturantes).
Resultados-chave (Mar/2025):
- OncoStop2024: zero doentes oncológicos fora TMRG em Ago/2024; 180 fora TMRG em Mar/2025 (-87,7% vs homólogo)
- Cirurgias oncológicas Q1 2025: 20.376 (+7,3% vs 2024, +11,7% vs 2023)
- Cirurgias não-oncológicas Q1 2025: 186.273 (+6,3% vs 2024); 17.149 fora TMRG (-12,4%)
- Consultas CTH Q1 2025: 391.472 (+4% vs 2024)
Estado: 4 concluídas, 1 em curso, 5 estruturantes em curso.`,
  2: `Eixo 2 — Bebés e Mães em Segurança.
10 medidas (3 urgentes, 4 prioritárias, 3 estruturantes).
Resultados-chave (Mar/2025):
- SNS Grávida: 133.500 chamadas; 36.500 grávidas retiradas das urgências
- Taxa cesarianas: 33% (meta <30%)
Estado: 5 concluídas, 2 parciais, 3 não implementadas.`,
  3: `Eixo 3 — Cuidados Urgentes e Emergentes.
13 medidas (3 urgentes, 8 prioritárias, 2 estruturantes).
Resultados-chave (Mar/2025):
- 15 CAC operacionais (vs 2 iniciais); 30.334 utentes atendidos
- 1.611 camas contratadas (vs 538 em Dez/2024)
- Especialidade Medicina de Urgência aprovada
- 7.000 teleconsultas realizadas
Estado: 11 concluídas, 2 em curso.`,
  4: `Eixo 4 — Saúde Próxima e Familiar.
12 medidas (4 urgentes, 5 prioritárias, 3 estruturantes).
Resultados-chave (Mar/2025):
- 1,6M utentes sem MdF (+135.542 com MdF vs Jan/2024)
- Batas Brancas: 323.674 consultas (+49,83%)
- USF-C: 19 candidaturas, ~191.000 utentes
- Rastreios: mama 65,42%, colo 59,66%, colorretal 58,42%
Estado: 4 concluídas, 8 em curso.`,
  5: `Eixo 5 — Saúde Mental.
9 medidas (3 urgentes, 4 prioritárias, 2 estruturantes).
Resultados-chave (Mar/2025):
- 1.385 psicólogos no SNS (+31 desde Mai/2024)
- 40 ECSM previstas: 20 operacionais
- 15 CRI piloto operacionais desde Jul/2024
- Consultas psicologia: +11,27%; psiquiatria: -1,29%
Estado: 5 concluídas, 4 em curso.`,
};

const SYSTEM_PROMPT = `És um analista de políticas de saúde pública especializado no sistema de saúde português.
Escreves em português europeu, com rigor académico mas acessível a decisores políticos e jornalistas.
Quando referências académicas são fornecidas, integra-as naturalmente no texto.

Formato da resposta — JSON com a seguinte estrutura:
{
  "sumario": "Parágrafo de 3-5 frases com a avaliação global do eixo",
  "pontos_fortes": ["ponto 1", "ponto 2", "ponto 3"],
  "desafios": ["desafio 1", "desafio 2", "desafio 3"],
  "recomendacoes": ["recomendação 1", "recomendação 2"],
  "contexto_internacional": "1-2 frases comparando com boas práticas internacionais",
  "referencias": ["referência 1 (se fornecidas)", "referência 2"]
}

Responde APENAS com o JSON, sem markdown, sem backticks, sem texto adicional.`;

const SCOPUS_QUERIES: Record<number, string> = {
  1: 'surgical waiting list reduction NHS OR health system',
  2: 'maternal health triage system OR obstetric emergency',
  3: 'emergency department crowding OR clinical assessment centre',
  4: 'primary health care family physician shortage',
  5: 'community mental health team OR psychiatric deinstitutionalization',
};

async function fetchScopusAbstracts(eixo: number, apiKey: string): Promise<string[]> {
  try {
    const query = encodeURIComponent(SCOPUS_QUERIES[eixo]);
    const url = `https://api.elsevier.com/content/search/scopus?query=${query}&count=3&sort=-citedby-count&field=dc:title,dc:description,prism:publicationName,prism:coverDate`;
    const response = await fetch(url, {
      headers: { 'X-ELS-APIKey': apiKey, 'Accept': 'application/json' },
    });
    if (!response.ok) return [];
    const data = await response.json() as { 'search-results': { entry: Array<Record<string, string>> } };
    const entries = data['search-results']?.entry || [];
    return entries.map((e: Record<string, string>) => {
      const title = e['dc:title'] || '';
      const journal = e['prism:publicationName'] || '';
      const year = (e['prism:coverDate'] || '').substring(0, 4);
      const abstract = (e['dc:description'] || '').substring(0, 200);
      return `${title} (${journal}, ${year}). ${abstract}...`;
    });
  } catch {
    return [];
  }
}

async function callLLM(prompt: string, apiKey: string): Promise<{ text: string; inputTokens: number; outputTokens: number }> {
  const isAnthropic = apiKey.startsWith('sk-ant-');

  if (isAnthropic) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (!response.ok) throw new Error(`Anthropic API error: ${response.status}`);
    const data = await response.json() as { content: Array<{ text: string }>; usage: { input_tokens: number; output_tokens: number } };
    return { text: data.content[0]?.text || '', inputTokens: data.usage?.input_tokens || 0, outputTokens: data.usage?.output_tokens || 0 };
  } else {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 1000,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: prompt }],
      }),
    });
    if (!response.ok) throw new Error(`OpenAI API error: ${response.status}`);
    const data = await response.json() as { choices: Array<{ message: { content: string } }>; usage: { prompt_tokens: number; completion_tokens: number } };
    return { text: data.choices[0]?.message?.content || '', inputTokens: data.usage?.prompt_tokens || 0, outputTokens: data.usage?.completion_tokens || 0 };
  }
}

export const aiSummary = functions
  .region('europe-west1')
  .https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');
    if (req.method === 'OPTIONS') { res.status(204).send(''); return; }

    const eixo = parseInt(req.query.eixo as string);
    if (!eixo || eixo < 1 || eixo > 5) {
      res.status(400).json({ error: 'Parametro eixo invalido (1-5)' });
      return;
    }

    const cacheRef = db.collection('ai_summaries').doc(`eixo_${eixo}`);
    const cached = await cacheRef.get();
    if (cached.exists) {
      const data = cached.data()!;
      if (Date.now() - data.timestamp < SUMMARY_CACHE_TTL_MS) {
        res.json({ ...data.summary, cached: true, generated_at: new Date(data.timestamp).toISOString() });
        return;
      }
    }

    const apiKey = process.env.AI_MODEL_KEY;
    if (!apiKey) {
      res.status(200).json({
        sumario: 'Resumo AI indisponivel — chave API nao configurada.',
        pontos_fortes: [], desafios: [], recomendacoes: [],
        contexto_internacional: '', referencias: [],
        cached: false, error: 'NO_API_KEY',
      });
      return;
    }

    const context = EIXO_CONTEXT[eixo];
    let scopusContext = '';
    const scopusKey = process.env.SCOPUS_API_KEY;
    if (scopusKey) {
      const abstracts = await fetchScopusAbstracts(eixo, scopusKey);
      if (abstracts.length > 0) {
        scopusContext = `\n\nReferencias academicas relevantes (Scopus):\n${abstracts.map((a, i) => `${i + 1}. ${a}`).join('\n')}`;
      }
    }

    const userPrompt = `Analisa o seguinte eixo do Plano de Emergencia e Transformacao da Saude (PETS) de Portugal:\n\n${context}${scopusContext}\n\nGera uma analise estruturada conforme o formato JSON solicitado.`;

    try {
      const result = await callLLM(userPrompt, apiKey);
      let summary;
      try {
        const cleaned = result.text.replace(/```json|```/g, '').trim();
        summary = JSON.parse(cleaned);
      } catch {
        summary = { sumario: result.text.substring(0, 500), pontos_fortes: [], desafios: [], recomendacoes: [], contexto_internacional: '', referencias: [], parse_error: true };
      }
      await cacheRef.set({ summary, timestamp: Date.now(), inputTokens: result.inputTokens, outputTokens: result.outputTokens });
      res.json({ ...summary, cached: false, generated_at: new Date().toISOString() });
    } catch (error) {
      res.status(200).json({
        sumario: `Resumo AI temporariamente indisponivel. Erro: ${(error as Error).message}`,
        pontos_fortes: [], desafios: [], recomendacoes: [],
        contexto_internacional: '', referencias: [],
        cached: false, error: 'LLM_CALL_FAILED',
      });
    }
  });
