# my-ai-saas · AI 出海 MVP

基于 Next.js 16 + DeepSeek 的最简可工作骨架，用于「海外场景化 AI SaaS」起步。

## 已就位

- ✅ Next.js 16.3.5 + React 19 + TypeScript + Tailwind v4
- ✅ `openai` SDK 7.x 复用为 DeepSeek 客户端（OpenAI 兼容协议）
- ✅ `stripe` 22.x 与 `@supabase/supabase-js` 2.x 已装好待接入
- ✅ 流式聊天 API：`POST /api/chat`（`src/app/api/chat/route.ts`）
- ✅ 极简聊天 UI：`src/app/page.tsx`
- ✅ `.env.local` 环境变量模板（含 DeepSeek / Supabase / Stripe 三组 key）
- ✅ dev server 已运行：http://localhost:3000

## 目录结构

```
my-ai-saas/
├── src/
│   ├── app/
│   │   ├── api/chat/route.ts   ← DeepSeek 流式转发
│   │   ├── layout.tsx
│   │   └── page.tsx            ← 聊天 UI
│   └── ...
├── .env.local                  ← 待填 key
├── package.json
└── README.md
```

## 你需要做的 1 步

打开 https://platform.deepseek.com ，注册 + 实名 + 充值 ¥10，创建 API Key，复制形如 `sk-xxxxxxxx` 的字符串。

然后用任意编辑器打开 `.env.local`，把第 6 行：

```
DEEPSEEK_API_KEY=sk-把你的真实-key-粘贴到这里
```

改为：

```
DEEPSEEK_API_KEY=sk-你的真实key
```

保存。Next.js 会自动热重载，刷新 http://localhost:3000 即可使用。

## 跑通后下一步

| 选项 | 做什么 | 价值 |
|---|---|---|
| A | 接 Supabase Auth（注册/登录） | 多用户隔离 |
| B | 接 Stripe 订阅 + 付费墙 | 第一个付费用户 |
| C | 写产品落地页（landing page） | 开始 SEO 引流 |
| D | 接入 Qwen / GLM 做多模型路由 | 成本对冲 |

## 常用命令

```bash
cd my-ai-saas
npm run dev      # 本地开发
npm run build    # 生产构建
npm start        # 跑生产 server
```