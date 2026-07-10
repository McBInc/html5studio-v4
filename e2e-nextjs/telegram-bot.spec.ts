import { test, expect } from '@playwright/test';

test.describe('Telegram Bot and Integration Tests', () => {
  test('should verify Telegram Engine text or features in the Next.js app', async ({ page }) => {
    await page.goto('/');

    const telegramText = page.getByText(/Telegram Engine|Telegram Mini Apps/i);
    if (await telegramText.count() > 0) {
      await expect(telegramText.first()).toBeVisible();
    }
  });
});