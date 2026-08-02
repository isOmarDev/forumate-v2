import { TIMEOUTS } from '../constants/timeout';
import { PuppeteerPageDriver } from '../driver';
import { PageElementsSelector } from '../../../src/shared/selectors';

export interface PageElementsConfig {
  [key: string]: PageElementsSelector;
}

export class PageElements {
  constructor(
    private pageElementsConfig: PageElementsConfig,
    private driver: PuppeteerPageDriver,
  ) {}

  public get(key: string, timeout: number = TIMEOUTS.default) {
    const element = this.pageElementsConfig[key];

    if (!element) {
      throw new Error(
        `Element "${key}" not found in config. Available keys: [${Object.keys(
          this.pageElementsConfig,
        ).join(', ')}]`,
      );
    }

    return this.driver.page.locator(element.selector).setTimeout(timeout);
  }
}
