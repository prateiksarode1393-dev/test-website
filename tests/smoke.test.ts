import { test, expect } from '@playwright/test';
import { SITE_ROUTES } from '../src/lib/routes';

const BASE_URL = 'http://localhost:3000';

test.describe('Global Smoke Test', () => {
  for (const route of SITE_ROUTES) {
    test(`Route ${route.path} should load successfully`, async ({ page }) => {
      const response = await page.goto(BASE_URL + route.path);
      expect(response?.status()).toBeLessThan(500);
    });
  }
});

test.describe('Runtime Feature Validation', () => {
  test('Service Worker should register', async ({ page }) => {
    await page.goto(BASE_URL + '/test/runtime/service-worker');
    // Give it a moment to register
    await page.waitForTimeout(1000);
    const isRegistered = await page.evaluate(async () => {
      const registrations = await navigator.serviceWorker.getRegistrations();
      return registrations.length > 0;
    });
    expect(isRegistered).toBe(true);
  });

  test('WebSocket should receive data', async ({ page }) => {
    await page.goto(BASE_URL + '/test/runtime/websocket');
    // The page sends a ping automatically after 3s
    await page.waitForSelector('text=Server Echo:', { timeout: 10000 });
    const content = await page.textContent('body');
    expect(content).toContain('Server Echo:');
  });

  test('Web Worker should compute result', async ({ page }) => {
    await page.goto(BASE_URL + '/test/runtime/web-worker');
    await page.click('text=Start Heavy Task');
    // Wait for the result text to replace "Computing..."
    await page.waitForSelector('.text-white.text-4xl', { timeout: 15000 });
    const result = await page.textContent('.text-white.text-4xl');
    expect(result).not.toBe('Computing...');
  });
});
