# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\http-status.test.ts >> HTTP Status Verification >> GET /test/http/403 should return status 403
- Location: tests\http-status.test.ts:8:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 403
Received: 500
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const STATUS_CODES = [400, 401, 403, 404, 500, 503];
  4  | const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
  5  | 
  6  | test.describe('HTTP Status Verification', () => {
  7  |   for (const status of STATUS_CODES) {
  8  |     test(`GET /test/http/${status} should return status ${status}`, async ({ request }) => {
  9  |       const response = await request.get(`${BASE_URL}/test/http/${status}`);
> 10 |       expect(response.status()).toBe(status);
     |                                 ^ Error: expect(received).toBe(expected) // Object.is equality
  11 |     });
  12 |   }
  13 | });
  14 | 
```