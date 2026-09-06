import { test, expect, USERS } from './fixtures';

/**
 * Нэвтрэх урсгалын тестүүд (authentication).
 * Тестлэх сайт: https://www.saucedemo.com — тест хийх зориулалттай нээлттэй демо дэлгүүр.
 *
 * Тест бүр өөрөө хуудсаа нээж, өөрөө гардаг тул дарааллаас үл хамааран
 * дангаараа ажиллана (test isolation).
 */
test.describe('Нэвтрэх үйлдэл', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('амжилттай нэвтрэх', async ({ loginPage, inventoryPage, menu }) => {
    await loginPage.login(USERS.standard.username, USERS.standard.password);

    // 1) Хаяг нь бүтээгдэхүүний хуудас руу шилжиж, гарчиг нь харагдсан эсэх
    await inventoryPage.expectLoaded();

    // 2) Бараанууд үнэхээр ачаалагдсан эсэх — saucedemo дээр 6 бараа байдаг
    await expect(inventoryPage.items).toHaveCount(6);

    // 3) Шинээр нэвтэрсэн үед сагс хоосон байх ёстой (тоолуур огт харагдахгүй)
    await expect(inventoryPage.cartBadge).toBeHidden();

    // Алхам 5: тестээ гарах үйлдлээр зөв төгсгөнө
    await menu.logout();
  });

  test('амжилтгүй нэвтрэх — буруу нууц үг', async ({ loginPage, inventoryPage, page }) => {
    await loginPage.login(USERS.standard.username, 'buruu_nuuts_ug');

    // Сөрөг тест: алдааны мессеж яг тэр хэлбэрээрээ гарах ёстой
    await loginPage.expectError(
      'Epic sadface: Username and password do not match any user in this service',
    );

    // Хаяг солигдоогүй, бүтээгдэхүүний гарчиг харагдах ЁСГҮЙ
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(inventoryPage.title).toBeHidden();
  });

  test('амжилтгүй нэвтрэх — түгжигдсэн хэрэглэгч', async ({ loginPage }) => {
    // Нэр, нууц үг нь ЗӨВ ч гэсэн түгжигдсэн хэрэглэгчийг систем оруулах ёсгүй.
    // Энэ нь "нууц үг таарч байвал нэвтрүүлнэ" гэсэн энгийн логикоос давсан шалгуур.
    await loginPage.login(USERS.locked.username, USERS.locked.password);

    await loginPage.expectError('Epic sadface: Sorry, this user has been locked out.');
  });

  test('амжилтгүй нэвтрэх — талбар хоосон', async ({ loginPage }) => {
    // Хил хязгаарын тест (boundary): огт юу ч бөглөөгүй үед
    await loginPage.loginButton.click();
    await loginPage.expectError('Epic sadface: Username is required');

    // Зөвхөн нэрээ бөглөсөн үед нууц үг шаардах ёстой
    await loginPage.usernameInput.fill(USERS.standard.username);
    await loginPage.loginButton.click();
    await loginPage.expectError('Epic sadface: Password is required');
  });
});
