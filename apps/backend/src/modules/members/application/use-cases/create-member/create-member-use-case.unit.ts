import { randomUUID } from 'node:crypto';

import { CreateMemberCommand } from '@forumate/api';
import { IEventBus, InMemoryEventBus } from '@forumate/bus';

import { CreateMemberInputBuilder } from '../../../../../../tests/builders/inputs/member-input-builders';
import { UsernameAlreadyTakenError } from '../../../../users/domain/errors/users-errors';
import { Member } from '../../../domain/entities/member';
import { MemberUsername } from '../../../domain/value-objects/member-username';
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

  test('should create a member when username is available and data is valid', async () => {
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

  test.only('should fail if username is already taken', async () => {
    const existingMemberInput = new CreateMemberInputBuilder()
      .withUsername('omarimik')
      .build();

    const memberUsername = MemberUsername.create(
      existingMemberInput.username,
    ).getValue();

    const member = Member.create({
      userId: existingMemberInput.userId,
      username: memberUsername,
    }).getValue();

    await membersRepositorySpy.save(member);

    const createMemberInput = new CreateMemberInputBuilder()
      .withUsername('omarimik')
      .build();

    const commandOrError = CreateMemberCommand.create(createMemberInput);
    const result = await createMemberUseCase.execute(commandOrError.getValue());

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBeInstanceOf(UsernameAlreadyTakenError);
    expect(result.getError().code).toBe('MEMBER_USERNAME_TAKEN');
    expect(result.getError().message).toBeDefined();

    expect(membersRepositorySpy.getTimesMethodCalled('save')).toBe(0);
    expect(
      membersRepositorySpy.getTimesMethodCalled('findUserByUsername'),
    ).toBe(1);
  });

  test('should fail if validation fails', async () => {
    // Implement
    throw new Error('Not yet implemented');
  });
});
