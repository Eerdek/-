import { Page, expect } from '@playwright/test';

/**
 * Дахин давтагдах үйлдлүүдийг нэг дор төвлөрүүлсэн туслах функцууд.
 * Ингэснээр тест бүр өөрөө өөрийгөө бэлдэж чаддаг тул тестүүд бие даасан
 * (test isolation) хэвээр үлдэж, локаторын өөрчлөлтийг нэг газраас засна.
 */

/** Тест хэрэглэгчийн эрхүүд — saucedemo нь нээлттэй демо тул нууц үг задгай байхад асуудалгүй */
export const USERS = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  locked: { username: 'locked_out_user', password: 'secret_sauce' },
} as const;

/**
 * Нэвтрэх хуудсаар дамжуулж систем рүү нэвтэрнэ.
 * Locator-ууд нь хэрэглэгчийн НҮДЭЭР харагдах шинжид (placeholder, role, нэр) тулгуурладаг —
 * XPath/CSS-ийн адил DOM-ын бүтцээс хамаардаггүй тул хуудас өөрчлөгдөхөд бага эвдэрнэ.
 */
export async function login(page: Page, username: string, password: string) {
  await page.goto('/');
  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
}

/** Бургер цэсээр дамжин гарах — тест бүрийг цэвэр төлөвт төгсгөнө */
export async function logout(page: Page) {
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();

  // Гарсны дараа заавал нэвтрэх хуудас руу буцаж, Login товч дахин харагдана
  await expect(page).toHaveURL('https://www.saucedemo.com/');
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
}
