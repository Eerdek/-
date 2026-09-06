import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object — нэвтрэх хуудас.
 *
 * Page Object Model (POM) гэдэг нь хуудас бүрийн локатор болон үйлдлийг нэг класс
 * дотор багцлах загвар юм. Ач холбогдол:
 *   1. Локатор нэг л газарт бичигдэнэ — дизайн өөрчлөгдвөл 10 тест засахгүй, 1 класс засна;
 *   2. Тестийн код нь "юу хийж байгаа" талаараа уншигдана, "хэрхэн олж байгаа" нь нуугдана;
 *   3. Шинэ тест бичихэд бэлэн үйлдлүүдийг дахин ашиглана.
 */
export class LoginPage {
  readonly page: Page;

  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Бүх локатор нь хэрэглэгчийн НҮДЭЭР харагдах шинжид тулгуурлаж байна.
    // Эдгээр нь "lazy" — зарлах үедээ хайлт хийдэггүй, ашиглах агшинд шинээр хайдаг
    // тул хуудас дахин ачаалагдсан ч хуучирдаггүй (stale element алдаа гарахгүй).
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.getByTestId('error');
  }

  /** Нэвтрэх хуудсыг нээх (baseURL нь playwright.config.ts дотор тодорхойлогдсон) */
  async goto() {
    await this.page.goto('/');
    await expect(this.loginButton).toBeVisible();
  }

  /** Нэр, нууц үг оруулаад Login товч дарах */
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /** Хүлээгдэж буй алдааны мессеж яг тэр хэлбэрээрээ гарсан эсэхийг шалгах */
  async expectError(message: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toHaveText(message);
  }
}
