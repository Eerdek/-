import { test, expect } from './fixtures';

/**
 * Нэвтэрсний дараах бүтээгдэхүүний хуудасны тестүүд.
 *
 * `loggedIn` fixture нь тест бүрийн ӨМНӨ автоматаар нэвтэрч, ДАРАА нь гардаг тул
 * энд нэвтрэх кодыг давтаж бичихгүй — тест зөвхөн шалгах зүйл дээрээ төвлөрнө.
 */
test.describe('Бүтээгдэхүүний хуудас', () => {
  const BACKPACK = 'Sauce Labs Backpack';
  const BIKE_LIGHT = 'Sauce Labs Bike Light';

  test('бараа сагслах', async ({ loggedIn: inventory, cartPage }) => {
    await inventory.addToCart(BACKPACK);

    // Сагслалт амжилттай бол товч "Remove" болж хувирна (UI-ийн шууд хариу)
    await expect(inventory.item(BACKPACK).getByRole('button', { name: 'Remove' })).toBeVisible();

    // Сагсны тоолуур 1 болсон эсэх
    await expect(inventory.cartBadge).toHaveText('1');

    // Сагс руу орж, ЯГ тэр бараа орсон эсэхийг батална —
    // зөвхөн тоолуур шалгаад зогсвол "буруу бараа орсон" алдааг барихгүй өнгөрнө.
    await inventory.openCart();
    await cartPage.expectLoaded();
    await cartPage.expectContains([BACKPACK]);
  });

  test('олон бараа сагслаад нэгийг нь хасах', async ({ loggedIn: inventory, cartPage }) => {
    await inventory.addToCart(BACKPACK);
    await inventory.addToCart(BIKE_LIGHT);
    await expect(inventory.cartBadge).toHaveText('2');

    // Хасах үйлдэл — тоолуур буурч, товч буцаад "Add to cart" болно
    await inventory.removeFromCart(BACKPACK);
    await expect(inventory.cartBadge).toHaveText('1');
    await expect(inventory.item(BACKPACK).getByRole('button', { name: 'Add to cart' })).toBeVisible();

    // Сагсанд зөвхөн үлдсэн бараа байх ёстой
    await inventory.openCart();
    await cartPage.expectContains([BIKE_LIGHT]);
  });

  test('барааг үнээр нь өсөхөөр эрэмбэлэх', async ({ loggedIn: inventory }) => {
    await inventory.sortBy('Price (low to high)');

    // Дэлгэц дээрх үнийг уншаад, өөрсдөө эрэмбэлсэн хувилбартай нь тулгана.
    // Ингэснээр тодорхой үнэ хатуу бичихгүй тул бараа өөрчлөгдсөн ч тест хүчинтэй хэвээр.
    const prices = await inventory.visiblePrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('барааг нэрээр нь Z-A эрэмбэлэх', async ({ loggedIn: inventory }) => {
    await inventory.sortBy('Name (Z to A)');

    const names = await inventory.visibleNames();
    expect(names).toEqual([...names].sort().reverse());
  });
});
