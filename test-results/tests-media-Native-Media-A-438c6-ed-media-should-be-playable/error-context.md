# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\media.test.ts >> Native Media Assets >> supported media should be playable
- Location: tests\media.test.ts:49:7

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/test/media/native", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const NATIVE_VIDEOS = [
  4  |   { url: '/videos/sample.mp4', type: 'video/mp4' },
  5  |   { url: '/videos/sample.webm', type: 'video/webm' },
  6  |   { url: '/videos/test.ogv', type: 'video/ogg' },
  7  |   { url: '/videos/test.mov', type: 'video/quicktime' },
  8  |   { url: '/videos/test.avi', type: 'video/x-msvideo' },
  9  |   { url: '/videos/test.wmv', type: 'video/x-ms-wmv' },
  10 |   { url: '/videos/test.flv', type: 'video/x-flv' },
  11 |   { url: '/videos/test.m4v', type: 'video/mp4' },
  12 |   { url: '/videos/test.3gp', type: 'video/3gpp' },
  13 |   { url: '/videos/test.mkv', type: 'video/x-matroska' },
  14 | ];
  15 | 
  16 | const NATIVE_AUDIO = [
  17 |   { url: '/audio/test.mp3', type: 'audio/mpeg' },
  18 |   { url: '/audio/test.wav', type: 'audio/wav' },
  19 |   { url: '/audio/test.ogg', type: 'audio/ogg' },
  20 |   { url: '/audio/test.aac', type: 'audio/aac' },
  21 |   { url: '/audio/test.m4a', type: 'audio/mp4' },
  22 |   { url: '/audio/test.flac', type: 'audio/flac' },
  23 |   { url: '/audio/test.aiff', type: 'audio/x-aiff' },
  24 |   { url: '/audio/test.mid', type: 'audio/midi' },
  25 |   { url: '/audio/test.wma', type: 'audio/x-ms-wma' },
  26 |   { url: '/audio/test.opus', type: 'audio/opus' },
  27 | ];
  28 | 
  29 | test.describe('Native Media Assets', () => {
  30 | 
  31 |   test('all video assets should exist and have correct content-type', async ({ request }) => {
  32 |     for (const video of NATIVE_VIDEOS) {
  33 |       const response = await request.get(video.url);
  34 |       expect(response.status()).toBe(200);
  35 |       // Note: Cloudflare/Next.js might serve these as application/octet-stream if not configured,
  36 |       // but we check for existence first.
  37 |       console.log(`Video ${video.url} status: ${response.status()} type: ${response.headers()['content-type']}`);
  38 |     }
  39 |   });
  40 | 
  41 |   test('all audio assets should exist and have correct content-type', async ({ request }) => {
  42 |     for (const audio of NATIVE_AUDIO) {
  43 |       const response = await request.get(audio.url);
  44 |       expect(response.status()).toBe(200);
  45 |       console.log(`Audio ${audio.url} status: ${response.status()} type: ${response.headers()['content-type']}`);
  46 |     }
  47 |   });
  48 | 
  49 |   test('supported media should be playable', async ({ page }) => {
> 50 |     await page.goto('/test/media/native');
     |                ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  51 | 
  52 |     // Test MP4 Video
  53 |     const mp4Video = page.locator('video source[src="/videos/sample.mp4"]').parentElement();
  54 |     if (mp4Video) {
  55 |       const readyState = await mp4Video.evaluate((el) => el.readyState);
  56 |       // readyState 1 = HAVE_CURRENT_DATA, 2 = HAVE_FUTURE_DATA, 3 = HAVE_POTENTIALLY_ENOUGH_DATA, 4 = HAVE_ENOUGH_DATA
  57 |       expect(readyState).toBeGreaterThanOrEqual(1);
  58 |     }
  59 | 
  60 |     // Test MP3 Audio
  61 |     const mp3Audio = page.locator('audio source[src="/audio/test.mp3"]').parentElement();
  62 |     if (mp3Audio) {
  63 |       const readyState = await mp3Audio.evaluate((el) => el.readyState);
  64 |       expect(readyState).toBeGreaterThanOrEqual(1);
  65 |     }
  66 |   });
  67 | 
  68 |   test('unsupported media should still be present in DOM', async ({ page }) => {
  69 |     await page.goto('/test/media/native');
  70 |     const aviVideo = page.locator('video source[src="/videos/test.avi"]');
  71 |     await expect(aviVideo).toBeVisible();
  72 |   });
  73 | });
  74 | 
```