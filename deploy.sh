#!/bin/bash
set -e

echo "🚀 Starting OpenNext Build Process..."

# 1. Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# 2. Build using OpenNext adapter for Cloudflare
echo "🏗️  Building for Cloudflare Edge using OpenNext..."
npx opennextjs-cloudflare build

echo "✅ Build complete. Output is in .open-next/ assets are in .open-next/assets."
