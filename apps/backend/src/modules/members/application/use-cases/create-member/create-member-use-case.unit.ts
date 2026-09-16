import { randomUUID } from 'node:crypto';

import { CreateMemberCommand } from '@forumate/api';
import { IEventBus, InMemoryEventBus } from '@forumate/bus';

import { Member } from '../../../domain/entities/member';
import { InMemoryMembersRepository } from '../../../infrastructure/repositories/in-memory-members-repository';

import { CreateMemberUseCase } from './create-member-use-case';

describe('createMember', () => {
  let createMemberUseCase: CreateMemberUseCase;
  let membersRepositorySpy: InMemoryMembersRepository;
  let eventBus: IEventBus;

  beforeEach(() => {
    membersRepositorySpy = new InMemoryMembersRepository();
    eventBus = new InMemoryEventBus();

    createMemberUseCase = new CreateMemberUseCase(
      membersRepositorySpy,
      eventBus,
    );
  });

  afterEach(() => {
    membersRepositorySpy.reset();
    eventBus.clear();
  });

  test.only('should create a member when username is available and data is valid', async () => {
    const mockInput = {
      username: 'omarimik',
      email: 'test@example.com',
      userId: randomUUID(),
    };
    const commandOrError = CreateMemberCommand.create(mockInput);

    const result = await createMemberUseCase.execute(commandOrError.getValue());

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(Member);
    expect(membersRepositorySpy.getTimesMethodCalled('save')).toBe(1);
  });

  test.skip('should fail if username is already taken', async () => {
    // Implement
    throw new Error('Not yet implemented');
  });

  test.skip('should fail if validation fails', async () => {
    // Implement
    throw new Error('Not yet implemented');
  });
});
