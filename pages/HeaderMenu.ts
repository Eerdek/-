import { Page, Locator, expect } from '@playwright/test';

/** Page Object — нэвтэрсний дараах бүх хуудсанд нийтлэг байдаг бургер цэс */
export class HeaderMenu {
  readonly page: Page;

  readonly openMenuButton: Locator;
  readonly logoutLink: Locator;
  readonly resetLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.openMenuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.getByRole('link', { name: 'Logout' });
    this.resetLink = page.getByRole('link', { name: 'Reset App State' });
  }

  /** Системээс гарах — тест бүрийг цэвэр төлөвт төгсгөнө (Алхам 5) */
  async logout() {
    await this.openMenuButton.click();
    await this.logoutLink.click();

    // Гарсны дараа заавал нэвтрэх хуудас руу буцна
    await expect(this.page).toHaveURL('https://www.saucedemo.com/');
    await expect(this.page.getByRole('button', { name: 'Login' })).toBeVisible();
  }
}
