export type ScenarioId = 'support' | 'listing' | 'marketing';

export interface Scenario {
  id: ScenarioId;
  name: string;
  emoji: string;
  tagline: string;
  inputLabel: string;
  inputPlaceholder: string;
  knowledgeLabel: string;
  knowledgePlaceholder: string;
  outputHint: string;
  systemPrompt: (knowledge: string) => string;
}

const KNOWLEDGE_BLOCK = (knowledge: string) =>
  knowledge.trim()
    ? `\n\nStore knowledge base (use this as the source of truth):\n"""\n${knowledge.trim()}\n"""`
    : '';

export const SCENARIOS: Record<ScenarioId, Scenario> = {
  support: {
    id: 'support',
    name: 'Customer Support',
    emoji: '🎧',
    tagline: 'Turn angry customer emails into polite, actionable replies.',
    inputLabel: 'Customer message(s)',
    inputPlaceholder:
      'Paste one customer email. For batch mode, separate multiple emails with a line containing only ---',
    knowledgeLabel: 'Product & policy knowledge base (optional)',
    knowledgePlaceholder:
      'Paste your FAQ, shipping policy, product specs, return window, tracking portal link, etc.',
    outputHint: 'Each run returns: reply, category, priority, internal suggestion.',
    systemPrompt: (knowledge) =>
      `You are a senior customer support agent for a cross-border e-commerce store. Read the customer message and produce a reply.${KNOWLEDGE_BLOCK(knowledge)}

Rules:
- Reply in the SAME language as the customer's message.
- Be warm, concise, and always end with a clear next step.
- Never invent facts not in the knowledge base. If unknown, promise to check with the team and give a timeframe.

Return ONLY a valid JSON object with exactly these keys:
{
  "reply": "the full reply text ready to send to the customer",
  "category": "one of: shipping | returns | product | payment | complaint | other",
  "priority": "one of: high | medium | low",
  "suggestion": "one short internal note for the operator, in English"
}`,
  },

  listing: {
    id: 'listing',
    name: 'Listing Optimizer',
    emoji: '🛒',
    tagline: 'Rewrite product listings to sell better on Amazon / Shopify.',
    inputLabel: 'Raw product description',
    inputPlaceholder:
      'Paste your current product title and description. Batch mode: separate items with a line containing only ---',
    knowledgeLabel: 'Brand voice & constraints (optional)',
    knowledgePlaceholder:
      'e.g. target audience, banned words, price positioning, character limits',
    outputHint: 'Each run returns: optimized title, 5 bullets, SEO keywords, change notes.',
    systemPrompt: (knowledge) =>
      `You are a senior e-commerce copywriter optimizing product listings for Amazon / Shopify.${KNOWLEDGE_BLOCK(knowledge)}

Rules:
- Title must be under 200 characters, front-load the strongest selling points.
- Bullets follow the format: BENEFIT in caps, then a short explanation.
- Keywords must be realistic search terms buyers would type.

Return ONLY a valid JSON object with exactly these keys:
{
  "title": "optimized product title",
  "bullets": ["5 benefit-driven bullet points"],
  "keywords": ["8-12 SEO keywords"],
  "improvements": ["short notes on what you changed and why"]
}`,
  },

  marketing: {
    id: 'marketing',
    name: 'Marketing Copy',
    emoji: '✍️',
    tagline: 'Generate social posts and email campaigns from a product.',
    inputLabel: 'Product info',
    inputPlaceholder:
      'Describe the product, its key benefit, and the target audience. Batch mode: separate campaigns with a line containing only ---',
    knowledgeLabel: 'Brand voice & campaign context (optional)',
    knowledgePlaceholder:
      'e.g. Halloween campaign, 20% off code SPOOKY20, playful tone, US audience',
    outputHint: 'Each run returns: social post, email body, hashtags.',
    systemPrompt: (knowledge) =>
      `You are a growth marketer writing launch and promo copy for a cross-border e-commerce brand.${KNOWLEDGE_BLOCK(knowledge)}

Rules:
- Social post: hook in the first line, under 280 characters, include a CTA.
- Email: subject line + short body, mobile-friendly paragraphs.
- Write in English unless the brief clearly targets another market.

Return ONLY a valid JSON object with exactly these keys:
{
  "social": "social media post text with a clear hook and CTA",
  "email_subject": "email subject line",
  "email_body": "email body, paragraphs separated by blank lines",
  "hashtags": ["5-8 relevant hashtags without spaces"]
}`,
  },
};

export const SCENARIO_LIST: Scenario[] = [
  SCENARIOS.support,
  SCENARIOS.listing,
  SCENARIOS.marketing,
];