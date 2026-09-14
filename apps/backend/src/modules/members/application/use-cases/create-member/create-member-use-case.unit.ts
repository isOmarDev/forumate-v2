import { randomUUID } from 'node:crypto';

import { CreateMemberCommand } from '@forumate/api';
import { IEventBus } from '@forumate/bus';

import { IApplication } from '../../../../../shared/application/application-interface';
import { CompositionRoot } from '../../../../../shared/composition-root';
import { Config } from '../../../../../shared/config';
import { Member } from '../../../domain/entities/member';
import { InMemoryMembersRepository } from '../../../infrastructure/repositories/in-memory-members-repository';

describe('createMember', () => {
  const config = new Config('test:unit');

  let compositionRoot: CompositionRoot;
  let application: IApplication;

  let membersRepositorySpy: InMemoryMembersRepository;
  let eventBus: IEventBus;

  beforeAll(() => {
    compositionRoot = CompositionRoot.createCompositionRoot(config);
    application = compositionRoot.getApplication();
    membersRepositorySpy = compositionRoot.getRepositories()
      .members as InMemoryMembersRepository;
    eventBus = compositionRoot.getEventBus();
  });

  afterEach(() => {
    membersRepositorySpy.reset();
    eventBus.clear();
  });

  test('should create a member when username is available and data is valid', async () => {
    const mockInput = {
      username: 'omarimik',
      email: 'test@example.com',
      userId: randomUUID(),
    };
    const commandOrError = CreateMemberCommand.create(mockInput);

    const result = await application.members.createMember(
      commandOrError.getValue(),
    );

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(Member);
    expect(membersRepositorySpy.save).toHaveBeenCalledTimes(1);
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
