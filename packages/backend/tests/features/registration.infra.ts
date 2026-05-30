import path from 'path';
import { defineFeature, loadFeature } from 'jest-cucumber';

import { CreateUserCommand } from '../../src/modules/user/user-command';
import {
  EmailAlreadyInUseException,
  UsernameAlreadyTakenException,
} from '../../src/modules/user/user-exceptions';
import { ContactListApiSpy } from '../../src/modules/marketing/adapters/contact-list-api-spy';
import { TransactionalEmailApiSpy } from '../../src/modules/notification/adapters/transactional-email-api';
import { IApplication } from '../../src/shared/application/application-interface';
import { CompositionRoot } from '../../src/shared/composition-root';
import { Database } from '../../src/shared/database';
import { Config } from '../../src/shared/config';

import {
  UserBuilder,
  CreateUserInputBuilder,
} from '../../../shared/tests/support/builders/user';
import { CreateUserInput, User } from '@dddforum/shared/api/users';

const feature = loadFeature(
  path.resolve(
    __dirname,
    '../../../shared/tests/features/registration.feature',
  ),
);

defineFeature(feature, (test) => {
  const config = new Config('test:infra');
  let compositionRoot: CompositionRoot;
  let application: IApplication;
  let database: Database;
  let transactionalEmailApiSpy: TransactionalEmailApiSpy;
  let contactListApiSpy: ContactListApiSpy;

  let createUserCommand: CreateUserCommand;
  let createUserResponse: User;
  let createUserResponses: Promise<User>[];
  let addEmailToListResponse: string | undefined;

  beforeAll(() => {
    compositionRoot = CompositionRoot.createCompositionRoot(config);
    database = compositionRoot.getDatabase();
    application = compositionRoot.getApplication();
    transactionalEmailApiSpy =
      compositionRoot.getTransactionalEmailApi() as TransactionalEmailApiSpy;
    contactListApiSpy =
      compositionRoot.getContactListApi() as ContactListApiSpy;
  });

  afterEach(async () => {
    transactionalEmailApiSpy.reset();
    contactListApiSpy.reset();
    addEmailToListResponse = undefined;
  });

  afterAll(async () => {
    await database.disconnect();
  });

  test('Successful registration with marketing emails accepted', ({
    given,
    when,
    then,
    and,
  }) => {
    given('I am a new user', () => {
      createUserCommand = new CreateUserInputBuilder().buildCommand();
    });

    when(
      'I register with valid account details accepting marketing emails',
      async () => {
        createUserResponse = await application.user.createUser(
          createUserCommand,
        );

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

      expect(transactionalEmailApiSpy.getTimesMethodCalled('sendMail')).toBe(1);
    });

    and('I should expect to receive marketing emails', () => {
      expect(addEmailToListResponse).toBe(createUserCommand.email);
      expect(contactListApiSpy.getTimesMethodCalled('addEmailToList')).toBe(1);
    });
  });

  test('Successful registration without marketing emails accepted', ({
    given,
    when,
    then,
    and,
  }) => {
    given('I am a new user', () => {
      createUserCommand = new CreateUserInputBuilder().buildCommand();
    });

    when(
      'I register with valid account details declining marketing emails',
      async () => {
        createUserResponse = await application.user.createUser(
          createUserCommand,
        );
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

      expect(transactionalEmailApiSpy.getTimesMethodCalled('sendMail')).toBe(1);
    });

    and('I should not expect to receive marketing emails', () => {
      expect(addEmailToListResponse).toBeFalsy();
      expect(contactListApiSpy.getTimesMethodCalled('addEmailToList')).toBe(0);
    });
  });

  test('Invalid or missing registration details', ({
    given,
    when,
    then,
    and,
  }) => {
    let missingParams: Partial<CreateUserInput>;
    let error: unknown;

    given('I am a new user', () => {
      const newUser = new CreateUserInputBuilder().build();
      missingParams = {
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      };
    });

    when('I register with invalid account details', async () => {
      try {
        createUserCommand = CreateUserCommand.validateRequest(missingParams);
        await application.user.createUser(createUserCommand);
      } catch (e) {
        error = e;
      }
    });

    then('I should see an error notifying me that my input is invalid', () => {
      expect(error).toBeDefined();
    });

    and('I should not have been sent access to account details', () => {
      expect(transactionalEmailApiSpy.getTimesMethodCalled('sendMail')).toBe(0);
    });
  });

  test('Account already created with email', ({ given, when, then, and }) => {
    let users: CreateUserCommand[];

    given(
      'a set of users already created accounts',
      async (table: CreateUserInput[]) => {
        await Promise.all(
          table.map((row) => {
            return new UserBuilder()
              .withEmail(row.email)
              .withUsername(row.username)
              .withFirstName(row.firstName)
              .withLastName(row.lastName)
              .build();
          }),
        );
      },
    );

    when(
      'new users attempt to register with those emails',
      async (table: CreateUserInput[]) => {
        users = table.map((row) =>
          new CreateUserInputBuilder()
            .withEmail(row.email)
            .withUsername(row.username)
            .withFirstName(row.firstName)
            .withLastName(row.lastName)
            .buildCommand(),
        );

        createUserResponses = users.map((user) =>
          application.user.createUser(user),
        );
      },
    );

    then(
      'they should see an error notifying them that the account already exists',
      () => {
        createUserResponses.forEach((response) => {
          expect(response).rejects.toThrow(EmailAlreadyInUseException);
        });
      },
    );

    and('they should not have been sent access to account details', () => {
      expect(transactionalEmailApiSpy.getTimesMethodCalled('sendMail')).toBe(0);
    });
  });

  test('Username already taken', ({ given, when, then, and }) => {
    let users: CreateUserCommand[];

    given(
      'a set of users have already created their accounts with valid details',
      async (table: CreateUserInput[]) => {
        await Promise.all(
          table.map((row) => {
            return new UserBuilder()
              .withEmail(row.email)
              .withUsername(row.username)
              .withFirstName(row.firstName)
              .withLastName(row.lastName)
              .build();
          }),
        );
      },
    );

    when(
      'new users attempt to register with already taken usernames',
      async (table:CreateUserInput[]) => {
        users = table.map((row) =>
          new CreateUserInputBuilder()
            .withEmail(row.email)
            .withUsername(row.username)
            .withFirstName(row.firstName)
            .withLastName(row.lastName)
            .buildCommand(),
        );

        createUserResponses = users.map((user) =>
          application.user.createUser(user),
        );
      },
    );

    then(
      'they see an error notifying them that the username has already been taken',
      () => {
        createUserResponses.forEach((response) => {
          expect(response).rejects.toThrow(UsernameAlreadyTakenException);
        });
      },
    );

    and('they should not have been sent access to account details', () => {
      expect(transactionalEmailApiSpy.getTimesMethodCalled('sendMail')).toBe(0);
    });
  });
});
