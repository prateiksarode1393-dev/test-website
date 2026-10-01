import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';
const MEDIA_PAGE = `${BASE_URL}/test/media/native`;

test.describe('Native Media Verification', () => {
  test('all media sources should be reachable (HTTP 200)', async ({ page }) => {
    await page.goto(MEDIA_PAGE);
    
    const sources = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('source')).map(s => s.getAttribute('src'));
    });

    expect(sources.length).toBe(20);

    for (const src of sources) {
      if (!src) continue;
      const fullUrl = src.startsWith('http') ? src : `${BASE_URL}${src}`;
      const response = await page.request.get(fullUrl);
      expect(response.status(), `URL ${fullUrl} should return 200`).toBe(200);
    }
  });

  test('supported media should be playable', async ({ page }) => {
    await page.goto(MEDIA_PAGE);

    // We only test a few that are definitely supported by Chromium
    const supported = [
      { name: 'MP4 Standard', selector: 'video' },
      { name: 'MP3 Standard', selector: 'audio' },
    ];

    for (const item of supported) {
      // Find the container that has the name
      const container = page.locator(`div:has-text("${item.name}")`).first();
      const mediaElement = container.locator(item.selector);
      
      // Trigger play and check if it starts
      await mediaElement.evaluate((el: HTMLMediaElement) => {
        el.play();
      });

      // Wait a bit for playback to start
      await page.waitForTimeout(1000);

      const isPlaying = await mediaElement.evaluate((el: HTMLMediaElement) => {
        return !el.paused && el.currentTime > 0;
      });

      expect(isPlaying, `${item.name} should be playing`).toBe(true);
    }
  });

  test('unsupported media should be present but may not play', async ({ page }) => {
    await page.goto(MEDIA_PAGE);
    
    // Verify that MKV is present (it's explicitly marked as intentionally unsupported)
    const mkvContainer = page.locator('div:has-text("MKV Format")').first();
    await expect(mkvContainer).toBeVisible();
    
    const video = mkvContainer.locator('video');
    await expect(video).toBeVisible();
  });
});
