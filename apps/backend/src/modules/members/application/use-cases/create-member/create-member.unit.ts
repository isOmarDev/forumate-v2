import { Member } from '../../../domain/member';
import { CreateMember } from './create-member';
import { ProductionMembersRepository } from '../../../repos/adapters/production-members-repository';
import { PrismaDatabase } from '@forumate/database';
import {} from '@forumate/api/members';
import * as Users from '@forumate/api/users';
import { InMemoryEventBus } from '@forumate/bus';
import { Config } from '../../../../../shared/config';
import { DecodedIdToken } from '@forumate/api/users';

describe('createMember', () => {
  let config = new Config('test:unit');
  let database = new PrismaDatabase(config);
  let membersRepo = new ProductionMembersRepository(database);
  let eventBus = new InMemoryEventBus();

  const useCase = new CreateMember(membersRepo, eventBus);

  const mockToken: DecodedIdToken = {
    email: 'test@example.com',
    uid: 'auth0|123',
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('should create a member when username is available and data is valid', async () => {
    // Implement
    throw new Error('Not yet implemented');
  });

  test('should fail if username is already taken', async () => {
    // Implement
    throw new Error('Not yet implemented');
  });

  test('should fail if validation fails', async () => {
    // Implement
    throw new Error('Not yet implemented');
  });
});
