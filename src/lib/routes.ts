export interface RouteInfo {
  path: string;
  title: string;
  category: 'chaos' | 'defenses' | 'dom' | 'dynamic' | 'http' | 'media' | 'runtime';
  description?: string;
}

export const SITE_ROUTES: RouteInfo[] = [
  // Chaos
  { path: '/test/chaos', title: 'Chaos Engineering Hub', category: 'chaos', description: 'Stability and crash testing' },
  { path: '/test/chaos/oom', title: 'OOM Memory Trap', category: 'chaos' },
  { path: '/test/chaos/gpu', title: 'GPU/CPU Stress', category: 'chaos' },
  { path: '/test/chaos/recursive', title: 'Recursive Spawning', category: 'chaos' },
  { path: '/test/chaos/flaky', title: 'Flaky Response', category: 'chaos' },
  { path: '/test/chaos/high-failure', title: 'High-Failure Node', category: 'chaos' },
  { path: '/test/chaos/captcha', title: 'Bot Captcha', category: 'chaos' },
  { path: '/test/chaos/popup', title: 'Popup Storm', category: 'chaos' },
  { path: '/test/chaos/tracking', title: 'Tracking Pixel', category: 'chaos' },

  // Defenses
  { path: '/test/defenses', title: 'Scraping Defenses Hub', category: 'defenses', description: 'WAF and Bot detection' },
  { path: '/test/defenses/fingerprint', title: 'Fingerprinting', category: 'defenses' },
  { path: '/test/defenses/rate-limit', title: 'Rate Limiter', category: 'defenses' },
  { path: '/test/defenses/waf', title: 'WAF Simulation', category: 'defenses' },

  // DOM
  { path: '/test/dom', title: 'DOM Failure Engineering Hub', category: 'dom', description: 'DOM manipulation and event lifecycle' },
  { path: '/test/dom/infinite-scroll', title: 'Infinite Scroll', category: 'dom' },
  { path: '/test/dom/live', title: 'Live-Stream Terminal', category: 'dom' },
  { path: '/test/dom/mismatch', title: 'Hydration Mismatch', category: 'dom' },
  { path: '/test/dom/no-load', title: 'The No-Load Trap', category: 'dom' },
  { path: '/test/dom/pagination', title: 'Deep Pagination', category: 'dom' },
  { path: '/test/dom/shadow', title: 'Shadow DOM Vault', category: 'dom' },

  // Dynamic
  { path: '/test/dynamic', title: 'Dynamic Cloaking Hub', category: 'dynamic', description: 'Cloaking and timing traps' },
  { path: '/test/dynamic/cookie', title: 'Cookie Blockers', category: 'dynamic' },
  { path: '/test/dynamic/delayed', title: 'Delayed Rendering', category: 'dynamic' },
  { path: '/test/dynamic/hidden', title: 'CSS-Hidden Links', category: 'dynamic' },
  { path: '/test/dynamic/shifting', title: 'Shifting Content', category: 'dynamic' },
  { path: '/test/dynamic/state', title: 'State-Locked Content', category: 'dynamic' },

  // HTTP
  { path: '/test/http', title: 'HTTP Matrix Hub', category: 'http', description: 'Network and status code tests' },
  { path: '/test/http/loop', title: 'Infinite Loop', category: 'http' },
  { path: '/test/http/slow', title: 'Slow-Loris', category: 'http' },
  { path: '/test/http/redirect', title: 'Redirect Chain', category: 'http' },
  ...(['400', '401', '403', '404', '405', '406', '408', '409', '410', '413', '415', '422', '429', '500', '501', '502', '503', '504', '505', '511'] as const).map(code => ({
    path: `/test/http/${code}`,
    title: `HTTP ${code}`,
    category: 'http' as const
  })),

  // Media
  { path: '/test/media', title: 'Media Testing Hub', category: 'media', description: 'Asset extraction and provider tests' },
  { path: '/test/media/mixed', title: 'Mixed Media Hub', category: 'media' },
  { path: '/test/media/native', title: 'Native Media', category: 'media' },
  { path: '/test/media/vault', title: 'Asset Vault', category: 'media' },

  // Runtime
  { path: '/test/runtime', title: 'Runtime Environment Hub', category: 'runtime', description: 'Async execution and browser runtime tests' },
  { path: '/test/runtime/service-worker', title: 'Service Worker Trap', category: 'runtime' },
  { path: '/test/runtime/websocket', title: 'WebSocket Stream', category: 'runtime' },
  { path: '/test/runtime/web-worker', title: 'Web Worker Compute', category: 'runtime' },
];
