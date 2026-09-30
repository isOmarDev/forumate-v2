import { Spy } from '../../../../shared/test-doubles/spy';
import { IMembersRepository } from '../../application/ports/members-repository';
import { Member } from '../../domain/entities/member';

export class InMemoryMembersRepository
  extends Spy<IMembersRepository>
  implements IMembersRepository
{
  private members: Member[] = [];

  public getByUsername(username: string): Promise<Member | null> {
    this.addCall('getByUsername', [username]);

    return Promise.resolve(
      this.members.find((member) => member.username.value === username) ?? null,
    );
  }

  public getByUserId(userId: string): Promise<Member | null> {
    this.addCall('getByUserId', [userId]);

    return Promise.resolve(
      this.members.find((member) => member.userId === userId) ?? null,
    );
  }

  public getById(memberId: string): Promise<Member | null> {
    this.addCall('getById', [memberId]);

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
