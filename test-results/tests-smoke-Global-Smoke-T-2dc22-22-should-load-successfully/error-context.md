# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\smoke.test.ts >> Global Smoke Test >> Route /test/http/422 should load successfully
- Location: tests\smoke.test.ts:8:9

# Error details

```
Error: expect(received).toBeLessThan(expected)

Expected: < 500
Received:   500
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
> 10 |       expect(response?.status()).toBeLessThan(500);
     |                                  ^ Error: expect(received).toBeLessThan(expected)
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
  24 |     expect(isRegistered).toBe(true);
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