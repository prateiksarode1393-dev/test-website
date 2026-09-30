# 🚀 ChaosNet: Crawler Stress-Test Ground

ChaosNet is a high-fidelity, modern Web Application engineered as a "chaos environment" for benchmarking and stress-testing advanced web crawlers (e.g., **Brozzler**, **Warcprox**, and **yt-dlp**).

## 🛠 Tech Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **Deployment**: Dockerized Node.js environment

## 🧪 Testing Matrix & Route Map

### 1. Media & Asset Extraction (`/test/media/*`)
- `/test/media`: Hub with verified embeds from YouTube, Vimeo, Dailymotion, etc.
- `/test/media/native`: Raw HTML5 `<video>` and `<audio>` streams (MP4, WebM).
- `/test/media/mixed`: Density stress test (10+ simultaneous embeds).
- `/test/media/vault`: Resource library with downloadable binaries (`.pdf`, `.zip`, `.docx`).

### 2. Scraping Defenses (`/test/defenses/*`)
- `/test/defenses/waf`: UA inspection & JS challenges (Simulates Cloudflare/AWS).
- `/test/defenses/rate-limit`: HTTP 429 simulation with `Retry-After` headers.
- `/test/defenses/fingerprint`: Canvas & WebGL telemetry detection.

### 3. HTTP & Network Protocol Matrix (`/test/http/*`)
- `/test/http/[status]`: Dynamic routes for `400`, `401`, `403`, `404`, `422`, `429`, `500`, `502`, `503`, `504`.
- `/test/http/redirect`: Deep nested 302 chains (Steps 1 $\to$ 4) leading to success or external exit.
- `/test/http/loop`: Infinite redirect cycles.
- `/test/http/slow`: Slow-Loris simulation (extreme response latency).

### 4. DOM & Hydration Traps (`/test/dom/*`)
- `/test/dom/infinite-scroll`: Virtualized lists via Intersection Observer.
- `/test/dom/no-load`: Blocks CDP `pageLoadEvent` / `window.onload`.
- `/test/dom/live`: WebSocket/SSE real-time data stream.
- `/test/dom/shadow`: Content hidden in **Closed Shadow Roots**.
- `/test/dom/mismatch`: Server-Client hydration state conflict.
- `/test/dom/pagination`: Classic pagination discovery test.

### 5. Chaos Engineering (`/test/chaos/*`)
- `/test/chaos/oom`: Automatic heap exhaustion $\to$ Tab Crash.
- `/test/chaos/gpu`: Auto-scaling GPU load (Level 1 $\to$ 3).
- `/test/chaos/recursive`: Nested iFrame/Worker spawning.
- `/test/chaos/flaky`: Random 50% failure rate.
- `/test/chaos/high-failure`: Aggressive 75% failure rate.
- `/test/chaos/popup`: Multiple `window.open` pop-up explosions.
- `/test/chaos/tracking`: Infinite unique URLs via tracking parameters.

### 6. Dynamic Cloaking (`/test/dynamic/*`)
- `/test/dynamic/delayed`: Blank page $\to$ Content injection after 10s.
- `/test/dynamic/hidden`: Links masked via CSS `clip-path` and `::after`.
- `/test/dynamic/state`: Layouts locked by cookies/localStorage.
- `/test/dynamic/shifting`: Content rotates (Text $\to$ Image $\to$ Video) every 5s.
- `/test/dynamic/cookie`: Forced consent banners blocking DOM.

## 🐳 Deployment
```bash
docker compose up -d --build
```

## 📖 Crawler Guidance (yt-dlp)
To test extraction from the Media Hub:
`yt-dlp --allow-unplayable-formats https://chaosnet.local/test/media/mixed`
