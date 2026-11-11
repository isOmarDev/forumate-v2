import { Spy } from '../../../../../shared/test-doubles/spy';
import { IMembersRepository } from '../../../application/ports/members-repository';
import { Member } from '../../../domain/entities/member';

export class InMemoryMembersRepository
  extends Spy<IMembersRepository>
  implements IMembersRepository
{
  private members: Member[] = [];

  public findByUsername(username: string): Promise<Member | null> {
    this.addCall('findByUsername', [username]);

    return Promise.resolve(
      this.members.find((member) => member.username.value === username) ?? null,
    );
  }

  public findByUserId(userId: string): Promise<Member | null> {
    this.addCall('findByUserId', [userId]);

    return Promise.resolve(
      this.members.find((member) => member.userId === userId) ?? null,
    );
  }

  public findById(memberId: string): Promise<Member | null> {
    this.addCall('findById', [memberId]);

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

  public seed(...members: Member[]): void {
    this.members.push(...members);
  }

  public getAll(): Member[] {
    return this.members;
  }
}
