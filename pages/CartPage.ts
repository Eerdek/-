import { Page, Locator, expect } from '@playwright/test';

/** Page Object — сагсны хуудас (/cart.html) */
export class CartPage {
  readonly page: Page;

  readonly items: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.items = page.getByTestId('inventory-item');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL('https://www.saucedemo.com/cart.html');
  }

  /** Сагсанд яг хүлээгдэж буй бараанууд, яг тэр тоогоороо байгаа эсэх */
  async expectContains(names: string[]) {
    await expect(this.items).toHaveCount(names.length);
    for (const name of names) {
      await expect(this.items.filter({ hasText: name })).toBeVisible();
    }
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
