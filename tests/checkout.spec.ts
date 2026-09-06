import { test, expect, CUSTOMER } from './fixtures';

/**
 * Худалдан авалтын бүрэн урсгал (end-to-end).
 *
 * Дээрх тестүүд нь тус тусдаа жижиг үйлдлийг шалгадаг бол энэ тест нь
 * хэрэглэгчийн ЖИНХЭНЭ зам — бараа сонгох -> сагслах -> мэдээлэл бөглөх ->
 * захиалга баталгаажуулах — бүхэлдээ ажиллаж байгааг батална.
 */
test.describe('Худалдан авалтын урсгал', () => {
  const BACKPACK = 'Sauce Labs Backpack';

  test('бараа сонгоод захиалгыг эцэс хүртэл дуусгах', async ({
    loggedIn: inventory,
    cartPage,
    checkoutPage,
  }) => {
    // 1. Бараа сагслах
    await inventory.addToCart(BACKPACK);
    await expect(inventory.cartBadge).toHaveText('1');

    // 2. Сагс руу орж агуулгыг шалгах
    await inventory.openCart();
    await cartPage.expectContains([BACKPACK]);

    // 3. Checkout — хүргэлтийн мэдээлэл бөглөх
    await cartPage.checkout();
    await checkoutPage.fillCustomerInfo(
      CUSTOMER.firstName,
      CUSTOMER.lastName,
      CUSTOMER.postalCode,
    );

    // 4. Тойм хуудсанд сонгосон бараа хэвээр байгаа эсэх
    await expect(cartPage.page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
    await expect(cartPage.page.getByText(BACKPACK)).toBeVisible();

    // 5. Захиалгыг дуусгах
    await checkoutPage.finish();
    await checkoutPage.expectOrderComplete();
  });

  test('хүргэлтийн мэдээлэл дутуу бол цааш үргэлжлүүлэхгүй', async ({
    loggedIn: inventory,
    cartPage,
    checkoutPage,
  }) => {
    // Сөрөг тест: заавал бөглөх талбарыг хоосон орхиход систем зогсоох ёстой
    await inventory.addToCart(BACKPACK);
    await inventory.openCart();
    await cartPage.checkout();

    await checkoutPage.continueButton.click();
    await expect(checkoutPage.errorMessage).toHaveText('Error: First Name is required');

    // Алдаа гарсан ч хуудас солигдоогүй байх ёстой
    await expect(checkoutPage.page).toHaveURL(
      'https://www.saucedemo.com/checkout-step-one.html',
    );
  });
});
