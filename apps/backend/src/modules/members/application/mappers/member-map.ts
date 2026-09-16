import { MemberDto, ReputationLevel } from '@forumate/api/members';
import {
  IToDomainMapper,
  IToDtoMapper,
  IToPersistenceMapper,
} from '@forumate/core';
import { MemberModel } from '@forumate/database';

import { Member } from '../../domain/entities/member';

import { MemberUsernameMap } from './member-username-map';

type MemberPersistence = Omit<MemberModel, 'dateCreated' | 'lastUpdated'>;

class MemberMapper
  implements
    IToDomainMapper<Member, MemberPersistence>,
    IToDtoMapper<Member, MemberDto>,
    IToPersistenceMapper<Member, MemberPersistence>
{
  toDomain(persistence: MemberPersistence): Member {
    const memberOrError = Member.reconstitute({
      id: persistence.id,
      userId: persistence.userId,
      username: MemberUsernameMap.toDomain(persistence.username),
      reputationScore: persistence.reputationScore,
      reputationLevel: persistence.reputationLevel as ReputationLevel,
    });

    return memberOrError.getValue();
  }

  toDTO(domain: Member): MemberDto {
    return {
      userId: domain.userId,
      memberId: domain.id,
      username: domain.username.value,
      reputationLevel: domain.reputationLevel,
      reputationScore: domain.reputationScore,
    };
  }

  toPersistence(domain: Member): MemberPersistence {
    return {
      id: domain.id,
      userId: domain.userId,
      username: domain.username.value,
      reputationScore: domain.reputationScore,
      reputationLevel: domain.reputationLevel,
    };
  }
}

export const MemberMap = new MemberMapper();
