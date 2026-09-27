import { randomUUID } from 'node:crypto';

import { CreateMemberCommand } from '@forumate/api';
import { IEventBus, InMemoryEventBus } from '@forumate/bus';
import { memberErrorCodes } from '@forumate/errors/domain';

import { CreateMemberInputBuilder } from '../../../../../../tests/builders/inputs/member-input-builders';
import { setupLevel1Member } from '../../../../../../tests/fixtures/unit/members';
import { Member } from '../../../domain/entities/member';
import {
  MemberAlreadyExistsError,
  MemberUsernameAlreadyExistsError,
} from '../../../domain/errors/member-errors';
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

  test('should fail if username is already taken', async () => {
    const existingMember = setupLevel1Member(membersRepositorySpy);

    const memberInput = new CreateMemberInputBuilder()
      .withUsername(existingMember.username)
      .build();

    const commandOrError = CreateMemberCommand.create(memberInput);
    const result = await createMemberUseCase.execute(commandOrError.getValue());

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBeInstanceOf(MemberUsernameAlreadyExistsError);
    expect(result.getError().code).toBe(
      memberErrorCodes.MEMBER_USERNAME_ALREADY_EXISTS,
    );
    expect(result.getError().message).toBeDefined();

    expect(membersRepositorySpy.getTimesMethodCalled('getByUsername')).toBe(1);
    expect(membersRepositorySpy.getTimesMethodCalled('save')).toBe(0);
  });

  test('should fail if member already exists', async () => {
    const existingMember = setupLevel1Member(membersRepositorySpy);

    const memberInput = new CreateMemberInputBuilder()
      .withUserId(existingMember.userId)
      .build();

    const commandOrError = CreateMemberCommand.create(memberInput);
    const result = await createMemberUseCase.execute(commandOrError.getValue());

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBeInstanceOf(MemberAlreadyExistsError);
    expect(result.getError().code).toBe(memberErrorCodes.MEMBER_ALREADY_EXISTS);
    expect(result.getError().message).toBeDefined();

    expect(membersRepositorySpy.getTimesMethodCalled('getByUserId')).toBe(1);
    expect(membersRepositorySpy.getTimesMethodCalled('save')).toBe(0);
  });
});
