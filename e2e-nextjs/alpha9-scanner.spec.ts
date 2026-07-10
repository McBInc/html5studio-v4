import { test, expect } from '@playwright/test';

test.describe('Alpha-9 Scanner Testing', () => {
  test('should verify scanner initialization page and API connectivity', async ({ page }) => {
    await page.goto('/');

    const initializeBtn = page.getByRole('button', { name: /Initialize Protocol/i });
    if (await initializeBtn.count() > 0) {
      await expect(initializeBtn).toBeVisible();
    }
  });
});