import { PageObject } from '../page-object';
import { PuppeteerPageDriver } from '../../driver';
import { CreateUserInput } from '@dddforum/shared/api/users';
import { PageElements } from '../../components';
import { appSelectors } from '../../../../src/shared/selectors';

export class RegistrationPage extends PageObject {
  private elements: PageElements;

  constructor(driver: PuppeteerPageDriver) {
    super(driver, 'http://localhost:5173/join');
    this.elements = new PageElements(
      appSelectors.registration.registrationForm,
      driver,
    );
  }

  public async enterAccountDetails(userInput: CreateUserInput) {
    const fields: Array<[string, string | undefined]> = [
      ['email', userInput.email],
      ['username', userInput.username],
      ['firstname', userInput.firstName],
      ['lastname', userInput.lastName],
    ];

    for (const [key, value] of fields) {
      if (value) {
        await this.elements.get(key).fill(value);
      }
    }
  }

  public async acceptMarketingEmails() {
    await this.elements.get('marketingCheckbox').click();
  }

  public async submitRegistrationForm() {
    await this.elements.get('submit').click();
  }
}
