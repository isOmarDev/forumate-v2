import { MemberModel, PostModel } from '@forumate/database';

import { Member } from '../../../src/modules/members/domain/entities/member';
import { MembersModule } from '../../../src/modules/members/members-module';
import { CompositionRoot } from '../../../src/shared/composition-root';

export class DatabaseFixture {
  constructor(private composition: CompositionRoot) {}

  async getMemberById(id: string): Promise<MemberModel | null> {
    const connection = this.composition.getDatabase().getClient();
    return connection.member.findUnique({ where: { id } });
  }

  async getPostById(id: string): Promise<PostModel | null> {
    const connection = this.composition.getDatabase().getClient();
    return connection.post.findUnique({ where: { id } });
  }

  async setupWithExistingMembers(members: Member[]) {
    const membersModule = this.composition.getModule(
      'members',
    ) as MembersModule;
    const membersRepo = membersModule.getMembersRepository();
    await Promise.all(members.map((member) => membersRepo.save(member)));
  }

  async resetDatabase() {
    const connection = this.composition.getDatabase().getClient();

    try {
      await connection.$transaction([
        connection.postVote.deleteMany(),
        connection.commentVote.deleteMany(),
        connection.comment.deleteMany(),
        connection.post.deleteMany(),
        connection.member.deleteMany(),
      ]);
    } catch (error) {
      console.error('Failed to reset test database:', error);
      throw error;
    }
  }
}
