import path from 'path';
import { defineFeature, loadFeature } from 'jest-cucumber';

import { App, createAppObject, Layout, Pages } from '../support/pages';
import { PuppeteerPageDriver } from '../support/driver';
import { AppNotifications } from '../support/components';
import {
  CreateUserInputBuilder,
  UserBuilder,
} from '../../../shared/tests/support/builders/user';
import { resetDatabase } from '../../../shared/tests/support/fixtures/reset';
import { CreateUserInput } from '@forumate/shared/api/users';

const feature = loadFeature(
  path.join(__dirname, '../../../shared/tests/features/registration.feature'),
  { tagFilter: '@frontend' },
);

defineFeature(feature, (test) => {
  let puppeteerPageDriver: PuppeteerPageDriver;
  let app: App;
  let layout: Layout;
  let pages: Pages;
  let notifications: AppNotifications;
  let userInput: CreateUserInput;

  beforeAll(async () => {
    puppeteerPageDriver = await PuppeteerPageDriver.create({
      headless: false,
      slowMo: 10,
    });
    app = createAppObject(puppeteerPageDriver);
    layout = app.layout;
    pages = app.pages;
    notifications = app.notifications;
  });

  afterAll(async () => {
    await puppeteerPageDriver.browser.close();
  });

  afterEach(async () => {
    await resetDatabase();
  });

  jest.setTimeout(60000);

  test('Successful registration with marketing emails accepted', ({
    given,
    when,
    then,
    and,
  }) => {
    given('I am a new user', async () => {
      userInput = new CreateUserInputBuilder().build();
      await pages.registration.open();
    });

    when(
      'I register with valid account details accepting marketing emails',
      async () => {
        await pages.registration.enterAccountDetails(userInput);
        await pages.registration.acceptMarketingEmails();
        await pages.registration.submitRegistrationForm();
      },
    );

    then('I should be granted access to my account', async () => {
      expect(await notifications.isSuccessToastVisible()).toBeTruthy();
      expect(await layout.header.getUsernameFromHeader()).toBe(
        userInput.username,
      );
    });

    and('I should expect to receive marketing emails', () => {});
  });

  test('Invalid or missing registration details', ({
    given,
    when,
    then,
    and,
  }) => {
    given('I am a new user', async () => {
      userInput = new CreateUserInputBuilder().withEmail('dad').build();
      await pages.registration.open();
    });

    when('I register with invalid account details', async () => {
      await pages.registration.enterAccountDetails(userInput);
      await pages.registration.submitRegistrationForm();
    });

    then(
      'I should see an error notifying me that my input is invalid',
      async () => {
        expect(await notifications.isErrorToastVisible()).toBeTruthy();
      },
    );

    and('I should not have been sent access to account details', () => {});
  });

  test('Account already created with email', ({ given, when, then, and }) => {
    given(
      'a set of users already created accounts',
      async (table: Omit<CreateUserInput, 'password'>[]) => {
        await Promise.all(
          table.map((row) =>
            new UserBuilder()
              .withEmail(row.email)
              .withUsername(row.username)
              .withFirstName(row.firstName)
              .withLastName(row.lastName)
              .build(),
          ),
        );

        await pages.registration.open();
      },
    );

    when(
      'new users attempt to register with those emails',
      async (table: Omit<CreateUserInput, 'password'>[]) => {
        const firstRow = table[0];
        const userInput = new CreateUserInputBuilder()
          .withEmail(firstRow.email)
          .build();

        await pages.registration.enterAccountDetails(userInput);
        await pages.registration.submitRegistrationForm();
      },
    );

    then(
      'they should see an error notifying them that the account already exists',
      async () => {
        expect(await notifications.getErrorNotificationText()).toBeDefined();
      },
    );

    and('they should not have been sent access to account details', () => {});
  });
});
