import { CommentModel, MemberModel, PostModel, PostVoteModel } from '..';
import { PrismaDatabase } from '../database';

const dbClient = new PrismaDatabase().getClient();

type WithoutDates<T> = Omit<T, 'createdAt' | 'updatedAt'>;

const initialMembers: WithoutDates<MemberModel>[] = [
  {
    id: '1',
    userId: '1',
    username: 'Bob',
    reputationScore: 1,
    reputationLevel: 'Level1',
  },
  {
    id: '2',
    userId: '2',
    username: 'Jade',
    reputationScore: 10,
    reputationLevel: 'Level2',
  },
  {
    id: '3',
    userId: '3',
    username: 'Ruby',
    reputationScore: 2,
    reputationLevel: 'Level1',
  },
  {
    id: '4',
    userId: '4',
    username: 'Saphire',
    reputationScore: 15,
    reputationLevel: 'Level3',
  },
];

const initialPosts: WithoutDates<PostModel>[] = [
  {
    id: '1',
    memberId: '1',
    title: 'First post!',
    content: 'This is bob vances first post',
    link: null,
    postType: 'text',
    voteScore: 1,
    slug: 'This is bob vances first post',
  },
  {
    id: '2',
    memberId: '2',
    title: 'Second post!',
    content: 'This is bobs second post',
    link: null,
    postType: 'text',
    voteScore: 1,
    slug: 'This is bob vances first post',
  },
  {
    id: '3',
    memberId: '3',
    title: 'third post',
    content: 'This is tonys first post',
    link: null,
    postType: 'text',
    voteScore: 1,
    slug: 'This is bob vances first post',
  },
  {
    id: '4',
    memberId: '4',
    title: 'Links',
    content: null,
    link: 'https://example.com',
    postType: 'text',
    voteScore: 1,
    slug: 'This is a link post',
  },
];

const initialPostVotes: WithoutDates<PostVoteModel>[] = [
  // Everyone upvotes their own first post
  {
    id: '1',
    postId: '1',
    memberId: '1',
    value: 1,
  },
  {
    id: '2',
    postId: '2',
    memberId: '1',
    value: 1,
  },
  {
    id: '3',
    postId: '3',
    memberId: '2',
    value: 1,
  },
  {
    id: '4',
    postId: '4',
    memberId: '2',
    value: 1,
  },

  // Tony's post upvoted by Bob
  {
    id: '5',
    postId: '3',
    memberId: '1',
    value: 1,
  },

  // Bob's second post downvoted by Bill
  {
    id: '6',
    postId: '2',
    memberId: '3',
    value: -1,
  },
];

const initialPostComments: WithoutDates<CommentModel>[] = [
  {
    id: '1',
    memberId: '1',
    postId: '1',
    body: 'I posted this!',
    parentCommentId: null,
    voteScore: 1,
  },
  {
    id: '2',
    memberId: '2',
    postId: '2',
    body: 'Nice',
    parentCommentId: null,
    voteScore: 1,
  },
];

async function seed() {
  for (const member of initialMembers) {
    await dbClient.member.create({
      data: member,
    });
  }

  for (const post of initialPosts) {
    await dbClient.post.create({
      data: post,
    });
  }

  for (const vote of initialPostVotes) {
    await dbClient.postVote.create({
      data: vote,
    });
  }

  for (const comment of initialPostComments) {
    await dbClient.comment.create({
      data: comment,
    });
  }
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await dbClient.$disconnect();
  });
