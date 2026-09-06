import { Page, Locator, expect } from '@playwright/test';

/** Page Object — захиалга баталгаажуулах 3 алхамт урсгал (checkout step one/two/complete) */
export class CheckoutPage {
  readonly page: Page;

  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly errorMessage: Locator;
  readonly completeHeader: Locator;

  constructor(page: Page) {
    this.page = page;

    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.finishButton = page.getByRole('button', { name: 'Finish' });
    this.errorMessage = page.getByTestId('error');
    this.completeHeader = page.getByTestId('complete-header');
  }

  /** 1-р алхам: хүргэлтийн мэдээлэл бөглөж үргэлжлүүлэх */
  async fillCustomerInfo(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  /** 2-р алхам: захиалгыг баталгаажуулах */
  async finish() {
    await this.finishButton.click();
  }

  /** 3-р алхам: захиалга амжилттай болсныг батлах */
  async expectOrderComplete() {
    await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }
}
