import { UserRepo } from '../adapters/user-repo';
import { CreateUserCommand } from '../user-command';
import { Database } from '../../../shared/database';
import { CreateUserInputBuilder } from '../../../../../shared/tests/support/builders/create-user-input-builder';
import { resetDatabase } from '../../../../../shared/tests/support/fixtures/reset';

describe('user repository', () => {
  const database = new Database();
  const dbClient = database.getClient();
  let userRepositories = [new UserRepo(dbClient)];

  afterEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await database.disconnect();
  });

  it('creates and gets a user by email', async () => {
    const userInput = new CreateUserInputBuilder().build();

    for (const repo of userRepositories) {
      const savedUser = await repo.create(userInput as CreateUserCommand);
      const fetchedUser = await repo.findByEmail(userInput.email);

      expect(savedUser).toBeDefined();
      expect(fetchedUser).toBeDefined();
      expect(savedUser.email).toBe(fetchedUser?.email);
    }
  });

  it('gets a user by username', async () => {
    const userInput = new CreateUserInputBuilder().build();

    for (const repo of userRepositories) {
      const savedUser = await repo.create(userInput as CreateUserCommand);
      const fetchedUser = await repo.findByUsername(userInput.username);

      expect(savedUser).toBeDefined();
      expect(fetchedUser).toBeDefined();
      expect(savedUser.username).toBe(fetchedUser?.username);
    }
  });
});
