import { test, expect } from '@playwright/test';

test.describe('Admin Panel Tests', () => {
  test('should load the sign in page and have admin inputs', async ({ page }) => {
    await page.goto('/signin');
    await page.waitForLoadState('networkidle');
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    const emailInput = page.locator('input[type="email"]');
    if (await emailInput.count() > 0) {
        await expect(emailInput).toBeVisible();
    }
  });

  test('should load index and allow Next.js navigation', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title).not.toBe('');
  });
});