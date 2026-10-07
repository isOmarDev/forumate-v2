import { faker } from '@faker-js/faker';

import { MemberModel, PostModel } from '@forumate/database';

import { ReputationLevel } from '../../../src/modules/members/domain/value-objects/member-reputation-level';
import { CompositionRoot } from '../../../src/shared/composition-root';

export type SeedMemberOverrides = {
  userId?: string;
  username?: string;
  reputationScore?: number;
  reputationLevel?: ReputationLevel;
};

export type SeedPostOverrides = {
  memberId: string;
  postType?: 'text' | 'link';
  title?: string;
  content?: string;
  link?: string;
  voteScore?: number;
};

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

  async seedMember(overrides: SeedMemberOverrides = {}): Promise<MemberModel> {
    const client = this.composition.getDatabase().getClient();

    return client.member.create({
      data: {
        id: faker.string.uuid(),
        userId: overrides.userId ?? faker.string.uuid(),
        username: overrides.username ?? faker.internet.username(),
        reputationScore: overrides.reputationScore ?? 0,
        reputationLevel: overrides.reputationLevel ?? 'Level1',
      },
    });
  }

  async seedPost(overrides: SeedPostOverrides): Promise<PostModel> {
    const client = this.composition.getDatabase().getClient();
    const postType = overrides.postType ?? 'text';
    const title = overrides.title ?? faker.lorem.sentence({ min: 5, max: 10 });

    return client.post.create({
      data: {
        id: faker.string.uuid(),
        memberId: overrides.memberId,
        postType,
        title,
        content:
          postType === 'text'
            ? (overrides.content ?? faker.lorem.paragraph())
            : null,
        link:
          postType === 'link'
            ? (overrides.link ?? faker.internet.url({ protocol: 'https' }))
            : null,
        slug: `${faker.helpers.slugify(title).toLowerCase()}-${faker.string.alphanumeric(6).toLowerCase()}`,
        voteScore: overrides.voteScore ?? 0,
      },
    });
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
