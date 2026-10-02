#!/bin/bash
set -e

echo "🚀 Starting OpenNext Build Process..."

# 1. Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# 2. Build the project using OpenNext for Cloudflare
echo "🏗️  Running OpenNext build for Cloudflare..."
npm run build:cloudflare

echo "✅ Build complete. Assets are in the .open-next directory."
