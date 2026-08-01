import puppeteer, { Browser, Page, LaunchOptions } from 'puppeteer';

export class PuppeteerPageDriver {
  private constructor(public browser: Browser, public page: Page) {}

  static async create(option?: LaunchOptions) {
    const browser = await puppeteer.launch(option);
    const page = await browser.newPage();
    return new PuppeteerPageDriver(browser, page);
  }
}
