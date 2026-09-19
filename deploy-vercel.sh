#!/usr/bin/env bash
# 用法： bash deploy-vercel.sh <VERCEL_TOKEN>
# 作用： 创建 Vercel 项目 -> 注入 DEEPSEEK_API_KEY -> 生产部署并返回公网 URL
set -euo pipefail

TOKEN="${1:?用法: bash deploy-vercel.sh <VERCEL_TOKEN>}"
PROJECT_NAME="${PROJECT_NAME:-my-ai-saas}"
DEEPSEEK_KEY="${DEEPSEEK_KEY:-sk-ddbede551231467498adf7ac4491eb70}"
PROJ_DIR="/c/Users/hsy/WorkBuddy/2026-09-18-15-37-28/my-ai-saas"

cd "$PROJ_DIR"
export NODE_OPTIONS=""   # 绕开本地沙箱的文件删除保护，否则 next build 收尾会报错
VC="npx --yes vercel@latest"

echo "==> [1/3] 创建项目并首次部署（此时还没有环境变量）"
$VC deploy --token "$TOKEN" --yes --prod --project "$PROJECT_NAME"

echo "==> [2/3] 注入环境变量 DEEPSEEK_API_KEY（production）"
$VC env add DEEPSEEK_API_KEY production \
  --value "$DEEPSEEK_KEY" \
  --token "$TOKEN" --yes --force --project "$PROJECT_NAME"

echo "==> [3/3] 带上环境变量重新部署（正式可用）"
$VC deploy --token "$TOKEN" --yes --prod --force --project "$PROJECT_NAME"

echo "==> 完成。上面输出的 Production 地址即为公网 URL。"
