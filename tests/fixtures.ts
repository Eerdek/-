import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { HeaderMenu } from '../pages/HeaderMenu';

/**
 * Playwright-ийн custom fixture.
 *
 * base.extend(...) ашиглан Page Object-уудыг тест бүрд автоматаар бэлдэж өгнө.
 * Ингэснээр тест бүрийн эхэнд `const loginPage = new LoginPage(page)` гэж
 * давтаж бичих шаардлагагүй болж, тестийн код зөвхөн ЛОГИКОО л харуулна:
 *
 *   test('...', async ({ loginPage, inventoryPage }) => { ... });
 *
 * Fixture нь тест бүрд ШИНЭЭР үүсдэг тул тестүүд хоорондоо төлөв хуваалцахгүй
 * (test isolation) — энэ нь параллель ажиллуулахад чухал.
 */

/** Тест хэрэглэгчид — saucedemo нь нээлттэй демо тул нууц үг задгай байхад асуудалгүй */
export const USERS = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  locked: { username: 'locked_out_user', password: 'secret_sauce' },
  problem: { username: 'problem_user', password: 'secret_sauce' },
} as const;

/** Хүргэлтийн жишээ мэдээлэл */
export const CUSTOMER = {
  firstName: 'Bat',
  lastName: 'Bold',
  postalCode: '14200',
} as const;

type Fixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  menu: HeaderMenu;
  /** Аль хэдийн нэвтэрсэн төлөвт бэлдэгдсэн бүтээгдэхүүний хуудас */
  loggedIn: InventoryPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  menu: async ({ page }, use) => {
    await use(new HeaderMenu(page));
  },

  /**
   * Нэвтрэх нь олон тестийн зөвхөн БЭЛТГЭЛ алхам болохоос тестлэх зүйл нь биш.
   * Тиймээс fixture болгож ялгав: `loggedIn`-г ашигласан тест шууд нэвтэрсэн
   * төлөвөөс эхэлж, төгсгөлд нь автоматаар гарна (use()-ийн дараах хэсэг).
   */
  loggedIn: async ({ page, loginPage, inventoryPage, menu }, use) => {
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.expectLoaded();

    await use(inventoryPage);

    // Цэвэрлэгээ: тест дууссаны дараа системээс гарна (Алхам 5).
    // Тест унасан үед хуудас өөр төлөвт байж болзошгүй тул алдааг залгина —
    // цэвэрлэгээний алдаа нь ЖИНХЭНЭ алдааг далдлах ёсгүй.
    await menu.logout().catch(() => {});
  },
});

export { expect };
