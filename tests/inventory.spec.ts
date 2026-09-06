import { test, expect } from '@playwright/test';
import { USERS, login, logout } from './helpers';

/**
 * Тест №4-5: Нэвтэрсний дараах үйлдлүүд (сагслах, эрэмбэлэх).
 * beforeEach hook нь тест бүрийн өмнө шинэ хуудсанд дахин нэвтэрдэг тул
 * тестүүд бие биенийхээ төлөвөөс хамаарахгүй.
 */
test.describe('Бүтээгдэхүүний хуудас', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, USERS.standard.username, USERS.standard.password);
    await expect(page.getByText('Products')).toBeVisible();
  });

  test('бараа сагслах', async ({ page }) => {
    // Тухайн барааны картыг НЭРЭЭР нь олж, дотроос нь товчийг хайна.
    // Ингэснээр "аль бараа вэ" гэдэг нь кодоос шууд уншигдана.
    const backpack = page
      .getByTestId('inventory-item')
      .filter({ hasText: 'Sauce Labs Backpack' });

    await backpack.getByRole('button', { name: 'Add to cart' }).click();

    // Сагслалт амжилттай бол товч "Remove" болж хувирна
    await expect(backpack.getByRole('button', { name: 'Remove' })).toBeVisible();

    // Сагсны тоолуур 1 болсон эсэх
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

    // Сагс руу орж, яг тэр бараа орсон эсэхийг шалгана
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();

    await logout(page);
  });

  test('барааг үнээр нь эрэмбэлэх', async ({ page }) => {
    // Эрэмбэлэх <select>-ийг role-оор нь олно (хуудсанд ганц combobox байдаг).
    // Утгыг 'lohi' гэсэн дотоод кодоор бус, хэрэглэгчид ХАРАГДАХ шошгоор сонгосон нь
    // кодыг уншихад ойлгомжтой болгож байна.
    await page.getByRole('combobox').selectOption({ label: 'Price (low to high)' });

    // Дэлгэц дээрх үнийн жагсаалтыг уншиж, өсөх дарааллаар байгааг батална
    const prices = (await page.getByTestId('inventory-item-price').allTextContents()).map(
      (text) => Number(text.replace('$', '')),
    );
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);

    await logout(page);
  });
});
