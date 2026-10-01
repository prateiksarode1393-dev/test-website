import { test, expect } from '@playwright/test';

const STATUS_CODES = [400, 401, 403, 404, 405, 406, 408, 409, 410, 413, 415, 422, 429, 500, 501, 502, 503, 504, 505, 511];
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('HTTP Status Verification', () => {
  for (const status of STATUS_CODES) {
    test(`GET /test/http/${status} should return status ${status}`, async ({ request }) => {
      const response = await request.get(`${BASE_URL}/test/http/${status}`);
      expect(response.status(), `URL ${BASE_URL}/test/http/${status} should return status ${status}`).toBe(status);
    });
  }
});
