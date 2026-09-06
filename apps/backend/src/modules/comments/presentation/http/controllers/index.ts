import { CommentsService } from '../../../application/comments-service';

import { GetCommentsByPostIdController } from './get-comments-by-post-id-controller';
import { PostCommentController } from './post-comment-controller';

export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  public postComment(): PostCommentController {
    return new PostCommentController(this.commentsService);
  }

  public getCommentsByPostId(): GetCommentsByPostIdController {
    return new GetCommentsByPostIdController(this.commentsService);
  }
}
