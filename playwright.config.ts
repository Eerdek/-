import { defineConfig, devices } from '@playwright/test';

/**
 * Лаборатори №1 — Playwright тохиргоо
 * Баримт: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',

  /* Тестүүд хоорондоо хамааралгүй тул параллель ажиллуулна (test isolation) */
  fullyParallel: true,

  /* CI дээр санамсаргүй үлдсэн test.only байвал build-ыг унагана */
  forbidOnly: !!process.env.CI,

  /* CI дээр л дахин оролдоно; локал дээр алдаа шууд харагдах нь дээр */
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  /* HTML тайлан үүсгэнэ. Ажиллуулсны дараа: npx playwright show-report */
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    /* Бүх тестийн үндсэн хаяг — page.goto('/') гэж бичихэд хангалттай болно */
    baseURL: 'https://www.saucedemo.com',

    /* saucedemo нь data-testid биш data-test атрибут хэрэглэдэг тул getByTestId-г түүнд тохируулав */
    testIdAttribute: 'data-test',

    /* Алхам бүрийн trace бичнэ — show-trace-ээр DOM snapshot, network-ийг хармаар */
    trace: 'on',

    /* Унасан тестийн видео, скриншотыг хадгална */
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Firefox / WebKit-ийг нэмэхэд `npx playwright install` командыг дахин ажиллуулна
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit',  use: { ...devices['Desktop Safari'] } },
  ],
});
