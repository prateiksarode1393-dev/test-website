#!/bin/bash
set -e

echo "🚀 Starting Static Build Process..."

# 1. Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# 2. Build the project (this will now produce the 'out' directory)
echo "🏗️  Running Next.js static build..."
npm run build

echo "✅ Build complete. Static files are in the 'out' directory."
