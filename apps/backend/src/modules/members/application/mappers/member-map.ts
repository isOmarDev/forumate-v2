import { MemberDto, ReputationLevel } from '@forumate/api/members';
import { Mapper } from '@forumate/core/application';
import { MemberModel } from '@forumate/database';

import { Member } from '../../domain/entities/member';
import { MemberUsername } from '../../domain/value-objects/member-username';

type MemberPersistence = Omit<MemberModel, 'dateCreated' | 'lastUpdated'>;

class MemberMapImpl extends Mapper<Member, MemberPersistence, MemberDto> {
  toDomain(persistence: MemberModel): Member {
    return Member.reconstitute({
      id: persistence.id,
      reputationScore: persistence.reputationScore,
      userId: persistence.userId,
      username: MemberUsername.toDomain(persistence.username),
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
