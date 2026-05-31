import { CompositionRoot } from '../../src/shared/composition-root';
import { Config } from '../../src/shared/config';
import { CreateUserInputBuilder } from '../../../shared/tests/support/builders/user';
import { ValidatedUserBuilder } from '../../../shared/tests/support/builders/user/validatedUserBuilder';
import { createApiClient } from '@dddforum/shared/api';

describe('users http API', () => {
  const client = createApiClient('http://localhost:3000');
  const config = new Config('test:infra');

  const composition = CompositionRoot.createCompositionRoot(config);
  const server = composition.getWebServer();
  const application = composition.getApplication();

  let createUserSpy: jest.SpyInstance;

  beforeAll(async () => {
    await server.start();
    createUserSpy = jest.spyOn(application.user, 'createUser');
  });

  afterEach(() => {
    createUserSpy.mockClear();
  });

  afterAll(async () => {
    await server.stop();
  });

  it('can create users', async () => {
    const createUserInput = new CreateUserInputBuilder().build();
    const createUserResponseStub = new ValidatedUserBuilder()
      .withEmail(createUserInput.email)
      .withFirstName(createUserInput.firstName)
      .withLastName(createUserInput.lastName)
      .withUsername(createUserInput.username);

    createUserSpy.mockResolvedValue(createUserResponseStub);

    await client.users.register(createUserInput);

    expect(application.user.createUser).toHaveBeenCalledTimes(1);
  });
});
