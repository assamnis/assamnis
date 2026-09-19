'use client';

import { useEffect, useState } from 'react';
import { SCENARIO_LIST, Scenario, ScenarioId } from '@/lib/scenarios';

interface RunResult {
  input: string;
  status: 'done' | 'error';
  data?: Record<string, unknown>;
  error?: string;
}

const asString = (v: unknown): string =>
  typeof v === 'string' ? v : v == null ? '' : String(v);

const asList = (v: unknown): string[] =>
  Array.isArray(v) ? v.map(asString).filter(Boolean) : [];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="text-xs text-gray-500 hover:text-black border border-gray-200 rounded px-2 py-0.5"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function Badge({ children, tone }: { children: React.ReactNode; tone: string }) {
  return (
    <span className={`text-xs font-medium rounded-full px-2.5 py-0.5 ${tone}`}>
      {children}
    </span>
  );
}

const priorityTone: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-green-100 text-green-700',
};

function ResultCard({ result, scenario }: { result: RunResult; scenario: Scenario }) {
  const d = result.data || {};

  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white">
      <p className="text-xs text-gray-400 mb-3 truncate">
        Input: {result.input.slice(0, 120)}
        {result.input.length > 120 ? '…' : ''}
      </p>

      {result.status === 'error' ? (
        <p className="text-red-600 text-sm">Error: {result.error}</p>
      ) : scenario.id === 'support' ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge tone="bg-blue-100 text-blue-700">{asString(d.category)}</Badge>
            <Badge tone={priorityTone[asString(d.priority)] || 'bg-gray-100 text-gray-700'}>
              {asString(d.priority)}
            </Badge>
          </div>
          <div className="flex items-start justify-between gap-3">
            <pre className="whitespace-pre-wrap font-sans text-sm text-gray-900 flex-1">
              {asString(d.reply)}
            </pre>
            <CopyButton text={asString(d.reply)} />
          </div>
          <p className="text-xs text-gray-500 border-t pt-2">
            💡 {asString(d.suggestion)}
          </p>
        </div>
      ) : scenario.id === 'listing' ? (
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-sm">{asString(d.title)}</h3>
            <CopyButton
              text={`${asString(d.title)}\n\n${asList(d.bullets)
                .map((b) => `• ${b}`)
                .join('\n')}`}
            />
          </div>
          <ul className="text-sm text-gray-800 space-y-1 list-disc pl-5">
            {asList(d.bullets).map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-1.5">
            {asList(d.keywords).map((k, i) => (
              <Badge key={i} tone="bg-purple-100 text-purple-700">
                {k}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-gray-500 border-t pt-2">
            Changes: {asList(d.improvements).join(' · ')}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm whitespace-pre-wrap flex-1">{asString(d.social)}</p>
            <CopyButton text={asString(d.social)} />
          </div>
          <div className="border rounded-lg p-3 bg-gray-50">
            <p className="font-medium text-sm mb-1">✉️ {asString(d.email_subject)}</p>
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm text-gray-700 whitespace-pre-wrap flex-1">
                {asString(d.email_body)}
              </p>
              <CopyButton
                text={`${asString(d.email_subject)}\n\n${asString(d.email_body)}`}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {asList(d.hashtags).map((h, i) => (
              <Badge key={i} tone="bg-teal-100 text-teal-700">
                {h}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [activeId, setActiveId] = useState<ScenarioId>('support');
  const scenario = SCENARIO_LIST.find((s) => s.id === activeId)!;

  const [knowledge, setKnowledge] = useState('');
  const [showKnowledge, setShowKnowledge] = useState(false);
  const [input, setInput] = useState('');
  const [results, setResults] = useState<RunResult[]>([]);
  const [running, setRunning] = useState(false);

  const [code, setCode] = useState('');
  useEffect(() => {
    setCode(localStorage.getItem('access_code') || '');
  }, []);
  const saveCode = (v: string) => {
    setCode(v);
    localStorage.setItem('access_code', v);
  };

  const run = async () => {
    const items = input
      .split(/\n\s*---\s*\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (items.length === 0 || running) return;

    setRunning(true);
    setResults([]);

    for (const item of items) {
      setResults((r) => [...r, { input: item, status: 'done', data: {} }]);
      try {
        const res = await fetch('/api/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-access-code': code },
          body: JSON.stringify({ scenario: activeId, input: item, knowledge }),
        });
        const json = await res.json();
        setResults((r) => {
          const next = [...r];
          if (res.ok && json.ok) {
            next[next.length - 1] = { input: item, status: 'done', data: json.result };
          } else {
            next[next.length - 1] = {
              input: item,
              status: 'error',
              error: json.error || `HTTP ${res.status}`,
            };
          }
          return next;
        });
      } catch (err) {
        setResults((r) => {
          const next = [...r];
          next[next.length - 1] = {
            input: item,
            status: 'error',
            error: err instanceof Error ? err.message : 'Network error',
          };
          return next;
        });
      }
    }

    setRunning(false);
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">AI Agent Studio</h1>
        <p className="text-gray-500 mt-1">
          Three ready-to-sell agents for cross-border e-commerce teams.
        </p>
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-2 border border-gray-200 rounded-lg p-3">
        <label className="text-sm font-medium" htmlFor="access-code">
          Access code
        </label>
        <input
          id="access-code"
          type="password"
          value={code}
          onChange={(e) => saveCode(e.target.value)}
          placeholder="输入访问口令"
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-black"
        />
        <span className="text-xs text-gray-500">
          {code ? '已保存在本机浏览器，不会上传' : '未填写口令时运行会返回 401'}
        </span>
      </div>

      <nav className="flex gap-2 mb-6">
        {SCENARIO_LIST.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              setActiveId(s.id);
              setResults([]);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
              activeId === s.id
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
            }`}
          >
            {s.emoji} {s.name}
          </button>
        ))}
      </nav>

      <section className="bg-gray-50 border rounded-xl p-4 mb-5">
        <p className="text-sm font-medium">{scenario.tagline}</p>
        <p className="text-xs text-gray-500 mt-1">{scenario.outputHint}</p>
      </section>

      <div className="mb-4">
        <button
          onClick={() => setShowKnowledge((v) => !v)}
          className="text-sm text-gray-600 hover:text-black"
        >
          {showKnowledge ? '▾' : '▸'} {scenario.knowledgeLabel}
        </button>
        {showKnowledge && (
          <textarea
            value={knowledge}
            onChange={(e) => setKnowledge(e.target.value)}
            rows={5}
            className="mt-2 w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            placeholder={scenario.knowledgePlaceholder}
          />
        )}
      </div>

      <label className="block text-sm font-medium mb-2">{scenario.inputLabel}</label>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={6}
        className="w-full border border-gray-300 rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-black"
        placeholder={scenario.inputPlaceholder}
        disabled={running}
      />

      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={run}
          disabled={running || !input.trim()}
          className="bg-black text-white px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {running ? 'Running…' : 'Run agent'}
        </button>
        {running && (
          <span className="text-sm text-gray-500">
            Processing {results.length}/{input.split(/\n\s*---\s*\n/).filter(Boolean).length}
          </span>
        )}
      </div>

      {results.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-sm font-medium text-gray-500">
            Results ({results.filter((r) => r.status === 'done').length}/{results.length})
          </h2>
          {results.map((r, i) => (
            <ResultCard key={i} result={r} scenario={scenario} />
          ))}
        </section>
      )}
    </main>
  );
}