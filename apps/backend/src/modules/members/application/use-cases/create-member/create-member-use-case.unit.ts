import {} from '@forumate/api/members';
import * as Users from '@forumate/api/users';
import { DecodedIdToken } from '@forumate/api/users';
import { InMemoryEventBus } from '@forumate/bus';
import { PrismaDatabase } from '@forumate/database';

import { Config } from '../../../../../shared/config';
import { Member } from '../../../domain/entities/member';
import { PrismaMembersRepository } from '../../../infrastructure/repositories/prisma-members-repository';

import { CreateMemberUseCase } from './create-member-use-case';

describe('createMember', () => {
  const config = new Config('test:unit');
  const database = new PrismaDatabase(config);
  const membersRepo = new PrismaMembersRepository(database);
  const eventBus = new InMemoryEventBus();

  const useCase = new CreateMemberUseCase(membersRepo, eventBus);

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
