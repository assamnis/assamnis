import { NextRequest } from 'next/server';

/**
 * 公网防护：访问口令 + IP 限流。
 * 目的是防止任何人拿到 URL 就无限调用，烧掉 DeepSeek 余额。
 */

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = Number(process.env.RATE_LIMIT_PER_MIN ?? 20);

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function clientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]!.trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

/** 固定窗口计数限流。注意：状态存在单个 lambda 实例内存里，重启/扩容会重置，属于"够用"级别的防护。 */
export function rateLimit(ip: string): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now();

  if (buckets.size > 5000) {
    for (const [key, b] of buckets) if (now > b.resetAt) buckets.delete(key);
  }

  const b = buckets.get(ip);
  if (!b || now > b.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }

  if (b.count >= MAX_PER_WINDOW) {
    return { ok: false, retryAfter: Math.max(1, Math.ceil((b.resetAt - now) / 1000)) };
  }

  b.count += 1;
  return { ok: true };
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** 校验 x-access-code。返回 null 表示放行，否则返回要直接吐回的错误响应。 */
export function accessCheck(req: NextRequest): Response | null {
  const expected = process.env.ACCESS_CODE;

  // 生产环境没配口令 = 配置错误，直接拒绝（fail-closed），避免"忘了配就裸奔"
  if (!expected) {
    if (process.env.NODE_ENV === 'production') {
      return Response.json(
        { error: '服务端未配置 ACCESS_CODE，已拒绝调用。' },
        { status: 503 }
      );
    }
    return null; // 本地开发放行
  }

  const got = req.headers.get('x-access-code') || '';
  if (!safeEqual(got, expected)) {
    return Response.json({ error: '访问口令不正确' }, { status: 401 });
  }
  return null;
}

/** 依次做口令校验 + 限流，返回 null 表示可以继续处理请求。 */
export function guard(req: NextRequest): Response | null {
  const denied = accessCheck(req);
  if (denied) return denied;

  const rl = rateLimit(clientIp(req));
  if (!rl.ok) {
    return Response.json(
      { error: `请求过于频繁，请 ${rl.retryAfter} 秒后再试。` },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } }
    );
  }

  return null;
}
