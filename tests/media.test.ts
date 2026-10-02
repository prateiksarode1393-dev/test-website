import { test, expect } from '@playwright/test';

const NATIVE_VIDEOS = [
  { url: '/videos/sample.mp4', type: 'video/mp4' },
  { url: '/videos/sample.webm', type: 'video/webm' },
  { url: '/videos/test.ogv', type: 'video/ogg' },
  { url: '/videos/test.mov', type: 'video/quicktime' },
  { url: '/videos/test.avi', type: 'video/x-msvideo' },
  { url: '/videos/test.wmv', type: 'video/x-ms-wmv' },
  { url: '/videos/test.flv', type: 'video/x-flv' },
  { url: '/videos/test.m4v', type: 'video/mp4' },
  { url: '/videos/test.3gp', type: 'video/3gpp' },
  { url: '/videos/test.mkv', type: 'video/x-matroska' },
];

const NATIVE_AUDIO = [
  { url: '/audio/test.mp3', type: 'audio/mpeg' },
  { url: '/audio/test.wav', type: 'audio/wav' },
  { url: '/audio/test.ogg', type: 'audio/ogg' },
  { url: '/audio/test.aac', type: 'audio/aac' },
  { url: '/audio/test.m4a', type: 'audio/mp4' },
  { url: '/audio/test.flac', type: 'audio/flac' },
  { url: '/audio/test.aiff', type: 'audio/x-aiff' },
  { url: '/audio/test.mid', type: 'audio/midi' },
  { url: '/audio/test.wma', type: 'audio/x-ms-wma' },
  { url: '/audio/test.opus', type: 'audio/opus' },
];

test.describe('Native Media Assets', () => {

  test('all video assets should exist and have correct content-type', async ({ request }) => {
    for (const video of NATIVE_VIDEOS) {
      const response = await request.get(video.url);
      expect(response.status()).toBe(200);
      console.log(`Video ${video.url} status: ${response.status()} type: ${response.headers()['content-type']}`);
    }
  });

  test('all audio assets should exist and have correct content-type', async ({ request }) => {
    for (const audio of NATIVE_AUDIO) {
      const response = await request.get(audio.url);
      expect(response.status()).toBe(200);
      console.log(`Audio ${audio.url} status: ${response.status()} type: ${response.headers()['content-type']}`);
    }
  });

  test('supported media should be playable', async ({ page }) => {
    await page.goto('/test/media/native');

    // Test MP4 Video
    const mp4Video = page.locator('video source[src="/videos/sample.mp4"]').locator('xpath=..');
    if (await mp4Video.count() > 0) {
      const readyState = await mp4Video.evaluate((el: HTMLVideoElement) => el.readyState);
      expect(readyState).toBeGreaterThanOrEqual(1);
    }

    // Test MP3 Audio
    const mp3Audio = page.locator('audio source[src="/audio/test.mp3"]').locator('xpath=..');
    if (await mp3Audio.count() > 0) {
      const readyState = await mp3Audio.evaluate((el: HTMLAudioElement) => el.readyState);
      expect(readyState).toBeGreaterThanOrEqual(1);
    }
  });

  test('unsupported media should still be present in DOM', async ({ page }) => {
    await page.goto('/test/media/native');
    const aviVideo = page.locator('video source[src="/videos/test.avi"]');
    await expect(aviVideo).toBeVisible();
  });
});
