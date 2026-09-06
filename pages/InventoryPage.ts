import { Page, Locator, expect } from '@playwright/test';

/** Page Object — бүтээгдэхүүний жагсаалтын хуудас (/inventory.html) */
export class InventoryPage {
  readonly page: Page;

  readonly title: Locator;
  readonly items: Locator;
  readonly names: Locator;
  readonly prices: Locator;
  readonly sortDropdown: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.title = page.getByText('Products');
    this.items = page.getByTestId('inventory-item');
    this.names = page.getByTestId('inventory-item-name');
    this.prices = page.getByTestId('inventory-item-price');
    this.sortDropdown = page.getByRole('combobox'); // хуудсанд ганц combobox байдаг
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
  }

  /** Хуудас бүрэн ачаалагдсан эсэхийг батлах — тест бүрийн эхлэлийн цэг */
  async expectLoaded() {
    await expect(this.page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(this.title).toBeVisible();
  }

  /**
   * Тухайн барааны картыг НЭРЭЭР нь олох.
   * filter({ hasText }) нь жагсаалтаас индексээр (items.nth(0)) сонгохоос хамаагүй
   * найдвартай — бараануудын дараалал өөрчлөгдсөн ч тест унахгүй.
   */
  item(name: string): Locator {
    return this.items.filter({ hasText: name });
  }

  async addToCart(name: string) {
    await this.item(name).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeFromCart(name: string) {
    await this.item(name).getByRole('button', { name: 'Remove' }).click();
  }

  /** Эрэмбэлэх — дотоод код биш, хэрэглэгчид харагдах шошгоор сонгоно */
  async sortBy(label: string) {
    await this.sortDropdown.selectOption({ label });
  }

  /** Дэлгэц дээр харагдаж буй үнийг тоо болгож буцаана: "$29.99" -> 29.99 */
  async visiblePrices(): Promise<number[]> {
    const texts = await this.prices.allTextContents();
    return texts.map((text) => Number(text.replace('$', '')));
  }

  /** Дэлгэц дээр харагдаж буй барааны нэрсийг буцаана */
  async visibleNames(): Promise<string[]> {
    return this.names.allTextContents();
  }

  async openCart() {
    await this.cartLink.click();
  }
}
