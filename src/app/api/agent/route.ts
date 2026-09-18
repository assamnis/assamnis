import OpenAI from 'openai';
import { NextRequest } from 'next/server';
import { SCENARIOS, ScenarioId } from '@/lib/scenarios';

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

export const runtime = 'nodejs';

interface AgentRequest {
  scenario: ScenarioId;
  input: string;
  knowledge?: string;
}

export async function POST(req: NextRequest) {
  let body: AgentRequest;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { scenario, input, knowledge = '' } = body;

  if (!scenario || !(scenario in SCENARIOS)) {
    return Response.json(
      { error: 'scenario must be one of: support | listing | marketing' },
      { status: 400 }
    );
  }

  if (!input || !input.trim()) {
    return Response.json({ error: 'input must be a non-empty string' }, { status: 400 });
  }

  try {
    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: SCENARIOS[scenario as ScenarioId].systemPrompt(knowledge),
        },
        { role: 'user', content: input.trim() },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5,
    });

    const raw = completion.choices[0]?.message?.content || '{}';

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return Response.json(
        { error: 'Model returned invalid JSON', raw },
        { status: 502 }
      );
    }

    return Response.json({ ok: true, result: parsed });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown upstream error';
    const status =
      typeof (err as { status?: number }).status === 'number'
        ? (err as { status: number }).status
        : 502;

    if (status === 402) {
      return Response.json(
        {
          error:
            'DeepSeek 账户余额不足（402）。请到 https://platform.deepseek.com 充值 ¥10 后重试。',
        },
        { status: 402 }
      );
    }
    if (status === 401) {
      return Response.json(
        {
          error:
            'DeepSeek API Key 无效（401）。请检查 .env.local 里的 DEEPSEEK_API_KEY 是否正确。',
        },
        { status: 401 }
      );
    }

    return Response.json({ error: message }, { status });
  }
}