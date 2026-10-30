import { PostVote } from '../../domain/entities/post-vote';

export interface IPostVotesRepository {
  findByMemberAndPostId(
    memberId: string,
    postId: string,
  ): Promise<PostVote | null>;
  save(vote: PostVote): Promise<void>;
}
