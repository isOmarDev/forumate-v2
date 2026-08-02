import { Component, PageElements, PageElementsConfig } from '..';
import { PuppeteerPageDriver } from '../../driver';
import { appSelectors } from '../../../../src/shared/selectors';

const headerComponentElementsConfig: PageElementsConfig = {
  header: appSelectors.layout.header,
};

export class HeaderComponent extends Component {
  private elements: PageElements;

  constructor(driver: PuppeteerPageDriver) {
    super(driver);
    this.elements = new PageElements(headerComponentElementsConfig, driver);
  }

  async getUsernameFromHeader() {
    const text = await this.elements
      .get('header')
      .map((el) => el.textContent)
      .wait();

    return text;
  }
}
