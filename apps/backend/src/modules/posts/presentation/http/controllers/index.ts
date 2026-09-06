import { PostsService } from '../../../application/posts-service';

import { CreatePostController } from './create-post-controller';
import { GetPostByIdController } from './get-post-by-id-controller';
import { GetPostsController } from './get-posts-controller';

export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  public createPost(): CreatePostController {
    return new CreatePostController(this.postsService);
  }
  public getPosts(): GetPostsController {
    return new GetPostsController(this.postsService);
  }
  public getPostById(): GetPostByIdController {
    return new GetPostByIdController(this.postsService);
  }
}
