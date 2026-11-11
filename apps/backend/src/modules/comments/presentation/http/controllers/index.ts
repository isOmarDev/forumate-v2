import { CommentsService } from '../../../application/comments-service';

import { GetCommentsByPostIdController } from './get-comments-by-post-id-controller';
import { PostCommentController } from './post-comment-controller';

export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  public postComment() {
    return new PostCommentController(this.commentsService);
  }

  public getCommentsByPostId() {
    return new GetCommentsByPostIdController(this.commentsService);
  }
}
