import { PrismaPostRepo } from '../adapters/prisma-post-repo';
import { Database } from '../../../shared/database';

describe('post repository', () => {
  const database = new Database();
  const dbClient = database.getClient();
  let postRepositories = [new PrismaPostRepo(dbClient)];

  afterAll(async () => {
    await database.disconnect();
  });

  describe.each(postRepositories.map((repo) => [repo.constructor.name, repo]))(
    '%s',
    (_, repo) => {
      it('gets recent posts', async () => {
        const fetchedPosts = await repo.findAll();
        expect(fetchedPosts).toEqual([]);
      });
    },
  );
});
