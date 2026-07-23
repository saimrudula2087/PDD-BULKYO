import { By } from 'selenium-webdriver';
import { BasePage } from './base.page.js';

export class RegisterCatererPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.businessNameInput = By.xpath("//input[@placeholder='e.g. Royal Indian Feasts']");
    this.emailInput = By.xpath("//input[@type='email']");
    this.fileInput = By.xpath("//input[@type='file']");
    this.passwordInput = By.xpath("//input[@type='password']");
    this.submitBtn = By.xpath("//button[@type='submit']");
  }

  async register(businessName, email, fssaiFilePath, password) {
    await this.type(this.businessNameInput, businessName);
    await this.type(this.emailInput, email);
    
    // File upload in Selenium is done by typing the absolute file path into the input element
    const fileEl = await this.findElement(this.fileInput);
    await fileEl.sendKeys(fssaiFilePath);

    await this.type(this.passwordInput, password);
    await this.click(this.submitBtn);
  }
}
