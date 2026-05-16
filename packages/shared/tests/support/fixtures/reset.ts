import { dbClient } from '../../../../backend/src/shared/bootstrap';

export async function resetDatabase() {
  const deleteAllUsers = dbClient.user.deleteMany();
  const deleteAllMembers = dbClient.member.deleteMany();
  const deleteAllPosts = dbClient.post.deleteMany();
  const deleteAllComments = dbClient.comment.deleteMany();
  const deleteAllVotes = dbClient.vote.deleteMany();

  try {
    await dbClient.$transaction([
      deleteAllUsers,
      deleteAllMembers,
      deleteAllPosts,
      deleteAllComments,
      deleteAllVotes,
    ]);
  } catch (error) {
    console.error(error);
  } finally {
    await dbClient.$disconnect();
  }
}
