import { Member } from '../../domain/entities/member';

export interface IMembersRepository {
  findByUsername(username: string): Promise<Member | null>;
  findByUserId(userId: string): Promise<Member | null>;
  findById(memberId: string): Promise<Member | null>;
  save(member: Member): Promise<void>;
}
