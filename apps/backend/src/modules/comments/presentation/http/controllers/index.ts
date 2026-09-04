import { CommentsService } from '../../../application/comments-service';

import { GetCommentsByPostId } from './get-comments-by-post-id';
import { PostComment } from './post-comment';

export class CommentsControllers {
  constructor(private readonly commentsService: CommentsService) {}

  public postComment(): PostComment {
    return new PostComment(this.commentsService);
  }

  public getCommentsByPostId(): GetCommentsByPostId {
    return new GetCommentsByPostId(this.commentsService);
  }
}
