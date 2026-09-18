import Link from 'next/link';
import { SCENARIOS } from '@/lib/scenarios';

const SCENARIO_SAMPLES: Record<string, { input: string; output: React.ReactNode }> = {
  support: {
    input: '"I ordered a lamp 2 weeks ago (#12345) and it hasn\'t arrived. This is unacceptable!"',
    output: (
      <>
        <span className="inline-block rounded-full bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 mr-2">
          shipping
        </span>
        <span className="inline-block rounded-full bg-red-100 text-red-700 text-xs font-medium px-2 py-0.5">
          high
        </span>
        <p className="mt-2 text-sm text-gray-800">
          "I completely understand your frustration — let me check on this right away. Shipping to the US takes 7-12 business days, so order #12345 may still be in transit. You can track it at track.example.com. If it hasn&apos;t arrived within a few days, I&apos;ll personally follow up…"
        </p>
      </>
    ),
  },
  listing: {
    input: '"Wooden coffee mug organizer, holds 6 mugs, handmade, 30cm"',
    output: (
      <>
        <p className="text-sm font-semibold text-gray-900">
          Handmade Oak Wooden Coffee Mug Organizer – Holds 6 Mugs, Fits Kitchen Counter…
        </p>
        <ul className="mt-2 text-xs text-gray-700 space-y-1 list-disc pl-4">
          <li><b>HANDMADE OAK CRAFTSMANSHIP</b> — Premium oak adds rustic elegance.</li>
          <li><b>HOLDS 6 MUGS</b> — Display your favorites within reach.</li>
          <li><b>SPACE-SAVING</b> — 30cm footprint fits any counter.</li>
        </ul>
        <p className="mt-2 text-xs text-gray-500">
          12 SEO keywords · Change notes
        </p>
      </>
    ),
  },
  marketing: {
    input: '"Smartphone gimbal with auto-tracking, 12h battery, content creators"',
    output: (
      <>
        <p className="text-sm text-gray-900">
          <b>Social:</b> "Stop shaky videos forever! 📱 Our foldable smartphone gimbal with auto-tracking and 12-hour battery is a content creator&apos;s dream. Get 25% off with LAUNCH25…"
        </p>
        <p className="mt-2 text-sm text-gray-900">
          <b>Email subject:</b> Your videos deserve this: 25% off gimbal stabilizer
        </p>
        <p className="mt-1 text-xs text-gray-500">8 hashtags included</p>
      </>
    ),
  },
};

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Loop<span className="text-amber-600">.</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600">
          <a href="#agents" className="hover:text-black">Agents</a>
          <a href="#how" className="hover:text-black">How it works</a>
          <a href="#pricing" className="hover:text-black">Pricing</a>
          <a href="#faq" className="hover:text-black">FAQ</a>
        </nav>
        <Link
          href="/studio"
          className="bg-black text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          Try free
        </Link>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50 via-white to-white" />
      <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-16 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          Powered by DeepSeek · OpenAI-compatible · No vendor lock-in
        </span>
        <h1 className="mt-6 text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1]">
          Three AI agents
          <br />
          <span className="text-amber-600">every cross-border store needs</span>
        </h1>
        <p className="mt-6 mx-auto max-w-2xl text-lg text-gray-600">
          Reply to customer emails, optimize product listings, and write marketing copy
          — in one workspace. From $29/mo.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/studio"
            className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800"
          >
            Try free →
          </Link>
          <a
            href="#how"
            className="text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100"
          >
            See how it works
          </a>
        </div>
        <p className="mt-4 text-xs text-gray-500">
          50 free runs · No credit card required
        </p>
      </div>
    </section>
  );
}

function AgentsShowcase() {
  const scenarios = [SCENARIOS.support, SCENARIOS.listing, SCENARIOS.marketing];
  return (
    <section id="agents" className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
        Three agents. One workspace.
      </h2>
      <p className="mt-3 text-center text-gray-600 max-w-2xl mx-auto">
        Each agent reads your store&apos;s knowledge base and produces structured output
        you can paste straight into your workflow.
      </p>

      <div className="mt-12 grid md:grid-cols-3 gap-6">
        {scenarios.map((s) => (
          <div
            key={s.id}
            className="border border-gray-200 rounded-2xl p-6 bg-white hover:shadow-lg transition"
          >
            <div className="text-3xl">{s.emoji}</div>
            <h3 className="mt-3 text-xl font-semibold">{s.name}</h3>
            <p className="mt-2 text-sm text-gray-600">{s.tagline}</p>

            <div className="mt-5 rounded-lg bg-gray-50 border border-gray-100 p-3">
              <p className="text-xs text-gray-400 mb-2">Input</p>
              <p className="text-sm text-gray-700 italic">
                {SCENARIO_SAMPLES[s.id].input}
              </p>
            </div>

            <div className="mt-3 rounded-lg bg-white border border-gray-200 p-3">
              <p className="text-xs text-gray-400 mb-2">Output</p>
              {SCENARIO_SAMPLES[s.id].output}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: '1',
      title: 'Pick an agent',
      body: 'Customer Support, Listing Optimizer, or Marketing Copy. Switch any time.',
    },
    {
      n: '2',
      title: 'Drop in your knowledge',
      body: 'Paste your FAQ, return policy, brand voice, or banned words once. We use it for every run.',
    },
    {
      n: '3',
      title: 'Run one or batch hundreds',
      body: 'Type a single message, or paste many separated by --- and process them all at once.',
    },
  ];
  return (
    <section id="how" className="bg-gray-50 border-y border-gray-200">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
          How it works
        </h2>
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {steps.map((s) => (
            <div key={s.n}>
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-semibold">
                {s.n}
              </div>
              <h3 className="mt-4 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-gray-600 text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    {
      name: 'Starter',
      price: 29,
      runs: '500 runs / mo',
      features: ['3 agents', 'Knowledge base (10k chars)', 'Email support'],
      cta: 'Start free',
      highlight: false,
    },
    {
      name: 'Pro',
      price: 99,
      runs: '3,000 runs / mo',
      features: [
        'Everything in Starter',
        'Knowledge base (100k chars)',
        'Batch mode unlimited',
        'Priority support',
      ],
      cta: 'Start free',
      highlight: true,
    },
    {
      name: 'Scale',
      price: 299,
      runs: 'Unlimited runs',
      features: [
        'Everything in Pro',
        'Custom agent prompts',
        'API access',
        'Dedicated Slack channel',
      ],
      cta: 'Talk to us',
      highlight: false,
    },
  ];
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
        Pricing
      </h2>
      <p className="mt-3 text-center text-gray-600">
        Cancel any time. Annual plans save 20%.
      </p>

      <div className="mt-12 grid md:grid-cols-3 gap-6">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`rounded-2xl p-6 border ${
              t.highlight
                ? 'border-amber-400 bg-amber-50/50 ring-2 ring-amber-400'
                : 'border-gray-200 bg-white'
            }`}
          >
            {t.highlight && (
              <span className="inline-block text-xs font-semibold text-amber-700 bg-amber-100 rounded-full px-2.5 py-0.5 mb-3">
                Most popular
              </span>
            )}
            <h3 className="text-xl font-semibold">{t.name}</h3>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-bold">${t.price}</span>
              <span className="text-gray-500">/mo</span>
            </div>
            <p className="mt-1 text-sm text-gray-600">{t.runs}</p>
            <ul className="mt-5 space-y-2 text-sm text-gray-700">
              {t.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-amber-600">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/studio"
              className={`mt-6 block text-center px-4 py-2.5 rounded-lg font-medium ${
                t.highlight
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'border border-gray-300 text-gray-900 hover:bg-gray-50'
              }`}
            >
              {t.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  const qs = [
    {
      q: 'Which AI model powers Loop?',
      a: 'Loop is OpenAI-compatible out of the box, so you can switch between DeepSeek, OpenAI, Anthropic, or any other provider without code changes. The default deployment uses DeepSeek V3 for the best cost/quality ratio.',
    },
    {
      q: 'Do I need to write prompts?',
      a: 'No. Each agent comes with battle-tested prompts written by e-commerce operators. You only need to paste your store knowledge (FAQ, return policy, brand voice) once.',
    },
    {
      q: 'How is a "run" counted?',
      a: 'One run = one processed item. If you paste 20 customer emails separated by ---, that counts as 20 runs.',
    },
    {
      q: 'Can I cancel?',
      a: 'Yes, any time from the dashboard. No phone calls, no retention emails.',
    },
    {
      q: 'Is my data safe?',
      a: 'Your knowledge base and runs are stored encrypted. We never train any model on your data, and you can delete everything from the dashboard at any time.',
    },
  ];
  return (
    <section id="faq" className="bg-gray-50 border-y border-gray-200">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
          Frequently asked
        </h2>
        <div className="mt-10 space-y-3">
          {qs.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl border border-gray-200 bg-white p-5 open:shadow-sm"
            >
              <summary className="flex cursor-pointer items-center justify-between font-medium text-gray-900 list-none">
                {item.q}
                <span className="ml-4 text-gray-400 group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
        Stop doing repetitive ops work
      </h2>
      <p className="mt-4 text-lg text-gray-600">
        Join the early operators using Loop to ship 10× more customer replies, listings, and campaigns without burning out.
      </p>
      <Link
        href="/studio"
        className="mt-8 inline-block bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800"
      >
        Start your free 50 runs →
      </Link>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Loop · Built for cross-border e-commerce teams
        </p>
        <div className="flex gap-6 text-sm text-gray-500">
          <a href="#pricing" className="hover:text-black">Pricing</a>
          <a href="#faq" className="hover:text-black">FAQ</a>
          <a href="/studio" className="hover:text-black">Open app</a>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <AgentsShowcase />
        <HowItWorks />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}