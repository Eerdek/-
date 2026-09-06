import { test, expect } from './fixtures';

/**
 * Эрхийн хамгаалалтын тест.
 *
 * UI тест гэдэг нь зөвхөн "товч дарахад ажиллаж байна уу" биш — хэрэглэгч
 * зөвшөөрөгдөөгүй замаар орох гэж оролдоход систем хэрхэн хариу үйлдэл
 * үзүүлэхийг ч шалгах ёстой. Энэ бол QA-гийн чанарын чухал өнцөг.
 */
test.describe('Нэвтрээгүй хэрэглэгчийн хандалт', () => {
  test('шууд URL-аар бүтээгдэхүүний хуудас руу орох боломжгүй', async ({
    page,
    loginPage,
    inventoryPage,
  }) => {
    // Нэвтрэхгүйгээр хамгаалагдсан хуудас руу шууд орох оролдлого
    await page.goto('/inventory.html');

    // Систем нэвтрэх хуудас руу буцааж, тайлбар мессеж харуулах ёстой
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await loginPage.expectError(
      "Epic sadface: You can only access '/inventory.html' when you are logged in.",
    );
    await expect(inventoryPage.title).toBeHidden();
  });

  test('шууд URL-аар сагсны хуудас руу орох боломжгүй', async ({ page, loginPage }) => {
    await page.goto('/cart.html');

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await loginPage.expectError(
      "Epic sadface: You can only access '/cart.html' when you are logged in.",
    );
  });
});
