#!/bin/bash
set -e

echo "🚀 Starting Cloudflare Pages Build Process..."

# 1. Install dependencies with legacy-peer-deps to avoid Next.js 16 conflicts
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# 2. Build the Next.js project
echo "🏗️  Running Next.js build..."
npm run build

# 3. Convert build output to Cloudflare Pages format
echo "☁️  Converting to Cloudflare Pages format..."
npx @cloudflare/next-on-pages

echo "✅ Build and Conversion complete. Cloudflare will now deploy the .vercel/output directory."
