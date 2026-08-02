import { GoToOptions } from 'puppeteer';

import { PuppeteerPageDriver } from '../driver';

export abstract class PageObject {
  constructor(protected driver: PuppeteerPageDriver, public url: string) {}

  public async open(option?: GoToOptions) {
    await this.driver.page.goto(this.url, option);
  }
}
