import { test, expect } from '@playwright/test';
import { USERS, login, logout } from './helpers';

/**
 * Тест №1-3: Нэвтрэх урсгал (authentication)
 * Тестлэх сайт: https://www.saucedemo.com — тест хийх зориулалттай нээлттэй демо дэлгүүр.
 *
 * Тест бүр өөрөө нэвтэрч, өөрөө гардаг тул дарааллаас үл хамааран
 * дангаараа ажиллана (test isolation).
 */
test.describe('Нэвтрэх үйлдэл', () => {
  test('амжилттай нэвтрэх', async ({ page }) => {
    await login(page, USERS.standard.username, USERS.standard.password);

    // 1) Хаяг нь бүтээгдэхүүний хуудас руу шилжсэн эсэх
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    // 2) Хуудасны гарчиг "Products" харагдаж байна уу
    await expect(page.getByText('Products')).toBeVisible();

    // 3) Бараануудын жагсаалт хоосон биш эсэх — 6 бараа байдаг
    await expect(page.getByTestId('inventory-item')).toHaveCount(6);

    // Алхам 5: тестээ гарах үйлдлээр зөв төгсгөнө
    await logout(page);
  });

  test('амжилтгүй нэвтрэх — буруу нууц үг', async ({ page }) => {
    await login(page, USERS.standard.username, 'buruu_nuuts_ug');

    // Сөрөг тест: алдааны мессеж харагдаж, хаяг нь нэвтрэх хуудсандаа үлдэнэ
    const error = page.getByTestId('error');
    await expect(error).toBeVisible();
    await expect(error).toHaveText(
      'Epic sadface: Username and password do not match any user in this service',
    );
    await expect(page).toHaveURL('https://www.saucedemo.com/');

    // Нэвтрээгүй тул бүтээгдэхүүний гарчиг харагдах ЁСГҮЙ
    await expect(page.getByText('Products')).toBeHidden();
  });

  test('амжилтгүй нэвтрэх — түгжигдсэн хэрэглэгч', async ({ page }) => {
    await login(page, USERS.locked.username, USERS.locked.password);

    // Зөв нууц үгтэй ч түгжигдсэн хэрэглэгчийг систем оруулахгүй
    await expect(page.getByTestId('error')).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.',
    );
  });
});
