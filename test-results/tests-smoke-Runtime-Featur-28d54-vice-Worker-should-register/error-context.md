# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\smoke.test.ts >> Runtime Feature Validation >> Service Worker should register
- Location: tests\smoke.test.ts:16:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - complementary [ref=e3]:
      - generic [ref=e4]: ChaosNet
      - navigation [ref=e9]:
        - generic [ref=e10]:
          - paragraph [ref=e11]: Main
          - link "Core Dashboard" [ref=e13] [cursor=pointer]:
            - /url: /
        - generic [ref=e19]:
          - paragraph [ref=e20]: Testing Ground
          - generic [ref=e21]:
            - link "Media Testing" [ref=e22] [cursor=pointer]:
              - /url: /test/media
            - link "Scraping Defenses" [ref=e26] [cursor=pointer]:
              - /url: /test/defenses
            - link "HTTP Matrix" [ref=e29] [cursor=pointer]:
              - /url: /test/http
            - link "DOM Traps" [ref=e33] [cursor=pointer]:
              - /url: /test/dom
            - link "Chaos Engineering" [ref=e38] [cursor=pointer]:
              - /url: /test/chaos
            - link "Dynamic Cloaking" [ref=e42] [cursor=pointer]:
              - /url: /test/dynamic
      - generic [ref=e45]: System Operational
    - main [ref=e49]:
      - generic [ref=e50]:
        - heading "System / Console" [level=1] [ref=e51]
        - generic [ref=e52]: v1.0.4-stable
      - generic [ref=e55]:
        - generic [ref=e56]:
          - link [ref=e57] [cursor=pointer]:
            - /url: /test/runtime
          - heading "Service Worker Trap" [level=1] [ref=e60]
        - generic [ref=e61]:
          - generic [ref=e62]:
            - heading "Registration Status" [level=2] [ref=e67]
            - generic [ref=e68]: installing
            - paragraph [ref=e71]:
              - text: This page registers a Service Worker at
              - code [ref=e72]: /sw.js
              - text: . The worker intercepts the "Secret Data" request below.
          - generic [ref=e73]:
            - heading "Intercept Test" [level=2] [ref=e77]
            - button "Fetch Secret Data" [ref=e78]
            - generic [ref=e79]: No data fetched yet...
  - alert [ref=e81]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { SITE_ROUTES } from '../src/lib/routes';
  3  | 
  4  | const BASE_URL = 'http://localhost:3000';
  5  | 
  6  | test.describe('Global Smoke Test', () => {
  7  |   for (const route of SITE_ROUTES) {
  8  |     test(`Route ${route.path} should load successfully`, async ({ page }) => {
  9  |       const response = await page.goto(BASE_URL + route.path);
  10 |       expect(response?.status()).toBeLessThan(500);
  11 |     });
  12 |   }
  13 | });
  14 | 
  15 | test.describe('Runtime Feature Validation', () => {
  16 |   test('Service Worker should register', async ({ page }) => {
  17 |     await page.goto(BASE_URL + '/test/runtime/service-worker');
  18 |     // Give it a moment to register
  19 |     await page.waitForTimeout(1000);
  20 |     const isRegistered = await page.evaluate(async () => {
  21 |       const registrations = await navigator.serviceWorker.getRegistrations();
  22 |       return registrations.length > 0;
  23 |     });
> 24 |     expect(isRegistered).toBe(true);
     |                          ^ Error: expect(received).toBe(expected) // Object.is equality
  25 |   });
  26 | 
  27 |   test('WebSocket should receive data', async ({ page }) => {
  28 |     await page.goto(BASE_URL + '/test/runtime/websocket');
  29 |     // The page sends a ping automatically after 3s
  30 |     await page.waitForSelector('text=Server Echo:', { timeout: 10000 });
  31 |     const content = await page.textContent('body');
  32 |     expect(content).toContain('Server Echo:');
  33 |   });
  34 | 
  35 |   test('Web Worker should compute result', async ({ page }) => {
  36 |     await page.goto(BASE_URL + '/test/runtime/web-worker');
  37 |     await page.click('text=Start Heavy Task');
  38 |     // Wait for the result text to replace "Computing..."
  39 |     await page.waitForSelector('.text-white.text-4xl', { timeout: 15000 });
  40 |     const result = await page.textContent('.text-white.text-4xl');
  41 |     expect(result).not.toBe('Computing...');
  42 |   });
  43 | });
  44 | 
```