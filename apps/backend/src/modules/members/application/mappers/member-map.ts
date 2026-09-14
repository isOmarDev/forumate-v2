import { MemberDto, ReputationLevel } from '@forumate/api/members';
import {
  ToDomainMapper,
  ToDtoMapper,
  ToPersistenceMapper,
} from '@forumate/core';
import { MemberModel } from '@forumate/database';

import { Member } from '../../domain/entities/member';

import { MemberUsernameMap } from './member-username-map';

type MemberPersistence = Omit<MemberModel, 'dateCreated' | 'lastUpdated'>;

class MemberMapImpl
  implements
    ToDomainMapper<Member, MemberPersistence>,
    ToDtoMapper<Member, MemberDto>,
    ToPersistenceMapper<Member, MemberPersistence>
{
  toDomain(persistence: MemberModel): Member {
    return Member.reconstitute({
      id: persistence.id,
      reputationScore: persistence.reputationScore,
      userId: persistence.userId,
      username: MemberUsernameMap.toDomain(persistence.username),
      reputationLevel: persistence.reputationLevel as ReputationLevel,
    });
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

export const MemberMap = new MemberMapImpl();
