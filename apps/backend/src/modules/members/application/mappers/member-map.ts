import { MemberDto } from '@forumate/api/members';
import {
  IToDomainMapper,
  IToDtoMapper,
  IToPersistenceMapper,
} from '@forumate/core';
import { MemberModel } from '@forumate/database';

import { Member } from '../../domain/entities/member';
import { ReputationLevel } from '../../domain/value-objects/member-reputation-level';

import { MemberReputationLevelMap } from './member-reputation-level-map';
import { MemberUsernameMap } from './member-username-map';

type MemberPersistence = Omit<MemberModel, 'createdAt' | 'updatedAt'>;

class MemberMapper
  implements
    IToDomainMapper<MemberModel, Member>,
    IToDtoMapper<Member, MemberDto>,
    IToPersistenceMapper<Member, MemberPersistence>
{
  toDomain(persistence: MemberModel): Member {
    return Member.reconstitute({
      id: persistence.id,
      userId: persistence.userId,
      username: MemberUsernameMap.toDomain(persistence.username),
      reputationScore: persistence.reputationScore,
      reputationLevel: MemberReputationLevelMap.toDomain(
        persistence.reputationLevel as ReputationLevel,
      ),
    });
  }

  toDTO(domain: Member): MemberDto {
    return {
      id: domain.id,
      userId: domain.userId,
      username: domain.username.value,
      reputationLevel: domain.reputationLevel.value,
      reputationScore: domain.reputationScore,
    };
  }

  toPersistence(domain: Member): MemberPersistence {
    return {
      id: domain.id,
      userId: domain.userId,
      username: domain.username.value,
      reputationLevel: domain.reputationLevel.value,
      reputationScore: domain.reputationScore,
    };
  }
}

export const MemberMap = new MemberMapper();
