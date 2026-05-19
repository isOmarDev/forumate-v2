import path from 'path';
import { defineFeature, loadFeature } from 'jest-cucumber';

import { CreateUserCommand } from '../../src/modules/user/user-command';
import { InMemoryUserRepo } from '../../src/modules/user/adapters/in-memory-user-repo';
import { CompositionRoot } from '../../src/shared/composition-root';
import { Config } from '../../src/shared/config';
import { CreateUserInputBuilder } from '../../../shared/tests/support/builders/create-user-input-builder';
import { IApplication } from '../../src/shared/application/application-interface';
import { User } from '@dddforum/shared/api/users';

const feature = loadFeature(
  path.resolve(
    __dirname,
    '../../../shared/tests/features/registration.feature',
  ),
);

defineFeature(feature, (test) => {
  const config = new Config('test:unit');
  let compositionRoot: CompositionRoot;
  let application: IApplication;
  let inMemoryUserRepo: InMemoryUserRepo;

  let createUserCommand: CreateUserCommand['props'];
  let createUserResponse: User;
  let addEmailToListResponse: string;

  beforeAll(() => {
    compositionRoot = CompositionRoot.createCompositionRoot(config);
    application = compositionRoot.getApplication();
    inMemoryUserRepo = compositionRoot.getRepositories()
      .user as InMemoryUserRepo;
  });

  afterEach(async () => {
    await inMemoryUserRepo.reset();
  });

  test.only('Successful registration with marketing emails accepted', ({
    given,
    when,
    then,
    and,
  }) => {
    given('I am a new user', () => {
      createUserCommand = new CreateUserInputBuilder().build();
    });

    when(
      'I register with valid account details accepting marketing emails',
      async () => {
        createUserResponse = await application.user.createUser({
          props: createUserCommand,
          ...createUserCommand,
        });

        addEmailToListResponse = await application.marketing.addEmailToList({
          email: createUserCommand.email,
        });
      },
    );

    then('I should be granted access to my account', async () => {
      expect(createUserResponse.id).toBeDefined();
      expect(createUserResponse.email).toBe(createUserCommand.email);
      expect(createUserResponse.username).toBe(createUserCommand.username);
      expect(createUserResponse.firstName).toBe(createUserCommand.firstName);
      expect(createUserResponse.lastName).toBe(createUserCommand.lastName);

      const getUserResponse = await application.user.getUserByEmail(
        createUserCommand.email,
      );

      expect(getUserResponse.email).toBe(createUserCommand.email);
    });

    and('I should expect to receive marketing emails', () => {
      expect(addEmailToListResponse).toBe(createUserCommand.email);
    });
  });

  test('Successful registration without marketing emails accepted', ({
    given,
    when,
    then,
    and,
  }) => {
    given('I am a new user', () => {});

    when(
      'I register with valid account details declining marketing emails',
      () => {},
    );

    then('I should be granted access to my account', () => {});

    and('I should not expect to receive marketing emails', () => {});
  });

  test('Invalid or missing registration details', ({
    given,
    when,
    then,
    and,
  }) => {
    given('I am a new user', () => {});

    when('I register with invalid account details', () => {});

    then(
      'I should see an error notifying me that my input is invalid',
      () => {},
    );

    and('I should not have been sent access to account details', () => {});
  });

  test('Account already created with email', ({ given, when, then, and }) => {
    given('a set of users already created accounts', (table) => {});

    when('new users attempt to register with those emails', (table) => {});

    then(
      'they should see an error notifying them that the account already exists',
      () => {},
    );

    and('they should not have been sent access to account details', () => {});
  });

  test('Username already taken', ({ given, when, then, and }) => {
    given(
      'a set of users have already created their accounts with valid details',
      (table) => {},
    );

    when(
      'new users attempt to register with already taken usernames',
      (table) => {},
    );

    then(
      'they see an error notifying them that the username has already been taken',
      () => {},
    );

    and('they should not have been sent access to account details', () => {});
  });
});
