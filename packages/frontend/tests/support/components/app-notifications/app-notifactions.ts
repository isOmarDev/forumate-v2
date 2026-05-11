import { Component } from '../component';
import { PageElements } from '../page-elements';
import { PuppeteerPageDriver } from '../../driver';
import { appSelectors } from '../../../../src/shared/selectors';

export class AppNotifications extends Component {
  private elements: PageElements;

  constructor(driver: PuppeteerPageDriver) {
    super(driver);
    this.elements = new PageElements(appSelectors.notifications, driver);
  }

  public async isSuccessToastVisible() {
    try {
      await this.elements.get('success').wait();
      return true;
    } catch (err) {
      return false;
    }
  }

  public async isErrorToastVisible() {
    try {
      await this.elements.get('failure').wait();
      return true;
    } catch (err) {
      return false;
    }
  }

  public async getErrorNotificationText() {
    const errorText = await this.elements
      .get('failure')
      .map((el) => el.textContent)
      .wait();

    return errorText;
  }
}
