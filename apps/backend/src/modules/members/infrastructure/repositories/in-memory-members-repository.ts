import { Spy } from '../../../../shared/test-doubles/spy';
import { IMembersRepository } from '../../application/ports/members-repository';
import { Member } from '../../domain/entities/member';

export class InMemoryMembersRepository
  extends Spy<IMembersRepository>
  implements IMembersRepository
{
  private members: Member[] = [];

  public findUserByUsername(username: string): Promise<Member | null> {
    this.addCall('findUserByUsername', [username]);

    return Promise.resolve(
      this.members.find((member) => member.username.value === username) ?? null,
    );
  }

  public getMemberByUserId(userId: string): Promise<Member | null> {
    this.addCall('getMemberByUserId', [userId]);

    return Promise.resolve(
      this.members.find((member) => member.userId === userId) ?? null,
    );
  }

  public getMemberById(memberId: string): Promise<Member | null> {
    this.addCall('getMemberById', [memberId]);

    return Promise.resolve(
      this.members.find((member) => member.id === memberId) ?? null,
    );
  }

  public save(member: Member): Promise<void> {
    this.addCall('save', [member]);

    this.members.push(member);

    return Promise.resolve();
  }

  public async reset(): Promise<void> {
    this.members = [];
    this.calls = [];
  }
}
